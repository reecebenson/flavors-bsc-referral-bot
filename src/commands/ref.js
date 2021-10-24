const { uuid } = require('uuidv4');

module.exports = class {
  constructor(bot) {
    this.bot = bot;
    this.meta = {
      name: "ref",
      description: "Get your unique reference link.",
      channels: ['private', 'supergroup'],
      adminOnly: false
    };
  }

  async getUserRef(from) {
    const db = this.bot.db.fetch();
    const userRefs = db.collection('user_references');

    // Check if we have an existing user reference
    const existing = await userRefs.find({ userId: from.id }).toArray();
    if (existing.length === 0) {
      // TODO: Check timestamp on user reference ?

      // Create a reference
      const userRef = uuid();
      await userRefs.insert({
        userId: from.id,
        userName: from.username,
        referenceToken: userRef,
        referrals: []
      });
      return userRef;
    }

    // Return existing reference
    return existing.shift().referenceToken;
  }

  async run(msg) {
    const ref = await this.getUserRef(msg.from);
    const link = `${this.bot.config['links']['bot']}?start=${ref}`;
    this.bot.sendMessage(msg.chat.id, `This link is your personal and unique referral code for Flavors Token. Use this link to gain points and work your way up the leaderboard!\n\n${link}`);
  }
};
