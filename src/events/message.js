const { isAdmin } = require("../utils");

class MessageEvent {
  constructor(bot) {
    this.bot = bot;
    this.meta = {
      name: "message"
    };
  }

  async incrementExistingReferral(uid) {
    const db = this.bot.db.fetch();
    const userRefs = db.collection('user_references');

    const referrals = await userRefs.find({
      referrals: {
        $elemMatch: { userId: uid }
      }
    }).toArray();
    if (referrals.length === 0) return null;

    const referral = referrals.shift();
    return await userRefs.updateOne(
      { referenceToken: referral.referenceToken },
      { $set: { referrals: referral.referrals.map((r) => {
        if (r.userId !== uid) return r;

        // Check if they've already got the threshold for messages
        if (r.messages.filter((m) => m.msgTime >= (+new Date() - (86400 * 1000))).length >= this.bot.config.settings.maxPointsPerDay) {
          return r;
        }

        // Add new message
        return {
          ...r,
          messages: [...r.messages, {msgTime: +new Date()}]
        };
      }) }},
      { returnOriginal: true }
    );
  }

  async run(msg) {
    try {
      // Increase referral message counts if a referral exists
      if (msg.text && msg.text.length >= this.bot.config.settings.charThreshold) {
        await this.incrementExistingReferral(msg.from.id);
      }
      
      // Command check
      if (!msg.text || msg.text.substr(0, 1) !== '/') return;
      
      const args = msg.text.slice(1).trim().split(/ +/g);
      let cmdText = args.shift().toLowerCase();
      if (cmdText.endsWith('@flavors_referral_bot')) {
        // Remove bot mention when clicking commands in a group chat
        cmdText = cmdText.replace('@flavors_referral_bot', '');
      }
      const cmd = this.bot.commands.fetch(cmdText);
      
      if (!cmd) return;
      if (cmd.meta.adminOnly && !isAdmin(msg.from.id)) {
        return this.bot.sendMessage(msg.chat.id, 'You are not an administrator.');
      }

      switch (true) {
        case cmd.meta.channels.includes(msg.chat.type):
          console.log(`[CMD] @${msg.from.username} executed "/${cmdText}" with arguments: ${args.join(' ') || 'n/a'}`);
          await cmd.run(msg, args);
          break;

        default:
          console.log(`[MSG] @${msg.from.username}: ${msg.text.substr(0, 50)}${msg.text.length > 50 ? '...' : ''}`);
          break;
      }
    }
    catch (e) {
      console.log(e);
    }
  }
};

module.exports = MessageEvent;
