const { uuid } = require('uuidv4');

module.exports = class {
  constructor(bot) {
    this.bot = bot;
    this.meta = {
      name: "ref",
      description: "Get your unique reference link.",
      channels: ['private'],
      adminOnly: false
    };
  }

  async getUserRef(uid) {
    const db = this.bot.db.fetch();
    const userRefs = db.collection('user_references');

    // Check if we have an existing user reference
    const existing = await userRefs.find({ userId: uid }).toArray();
    if (existing.length === 0) {
      // Create a reference
      const userRef = uuid();
      const ref = await userRefs.insert({
        userId: uid,
        referenceToken: userRef,
        points: 0
      });

      return userRef;
    }
    return existing.shift().referenceToken;
  }

  async run(msg) {
    const ref = await this.getUserRef(msg.from.id);
    const link = `${this.bot.config['links']['bot']}?start=${ref}`;
    this.bot.sendMessage(msg.chat.id, `This link is your personal and unique referral code for Flavors Token. Use this link to gain points and work your way up the leaderboard!\n\n${link}`);
  }
};
