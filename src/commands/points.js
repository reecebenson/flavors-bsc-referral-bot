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
    let points = 0;

    const referrals = await userRefs.find({ userId: uid }).toArray();
    if (referrals.length === 0) return 0;

    // Work out how many points this user has
    const mine = referrals.shift();
    points = (mine.referrals || []).length;
    mine.referrals.forEach((referral) => {
      points += referral.messageCount;
    });
    return points;
  }

  async run(msg) {
    const points = await this.getMyPoints(msg.from.id);
    this.bot.sendMessage(msg.chat.id, `You have ${points} point${points === 1 ? '' : 's'}.`);
  }
};
