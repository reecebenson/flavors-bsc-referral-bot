module.exports = class {
  constructor(bot) {
    this.bot = bot;
    this.meta = {
      name: "points",
      description: "Shows your current points and position from referrals.",
      channels: ['private', 'supergroup'],
      adminOnly: false
    };
  }

  async getMyPoints(uid) {
    const db = this.bot.db.fetch();
    const userRefs = db.collection('user_references');

    const referrals = await userRefs.find({ userId: uid }).toArray();
    if (referrals.length === 0) return 0;

    // Work out how many points this user has
    let points = 0;
    const mine = referrals.shift();
    points = (mine.referrals || []).length;
    mine.referrals.forEach((referral) => {
      points += referral.messages.length;
    });
    return points;
  }

  async getUserPoints(name) {
    const db = this.bot.db.fetch();
    const userRefs = db.collection('user_references');
    const referrals = await userRefs.find({
      "$or": [
        {userName: name.toLowerCase()},
        {userName: name.substring(0, 1).toLowerCase()}
      ]
    }).toArray();
    if (referrals.length === 0) {
      return null;
    }

    const referral = referrals.shift();
    const points = await this.getMyPoints(referral.userId);
    return points;
  }

  async run(msg, args) {
    const filter = args.shift();
    if (!filter) {
      const points = await this.getMyPoints(msg.from.id);
      return this.bot.sendMessage(msg.chat.id, `You have ${points} point${points === 1 ? '' : 's'}.`);
    }

    const points = await this.getUserPoints(filter);
    if (points === null) return this.bot.sendMessage(msg.chat.id, `Unable to find points for: ${filter}.`);
    return this.bot.sendMessage(msg.chat.id, `${filter} has ${points} point${points === 1 ? '' : 's'}.`);
  }
};
