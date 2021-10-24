module.exports = class {
  constructor(bot) {
    this.bot = bot;
    this.meta = {
      name: "top",
      description: "Shows the Top X members of the referral leaderboard",
      channels: ['private', 'supergroup'],
      adminOnly: false
    };
  }

  async getReferrals() {
    const db = this.bot.db.fetch();
    const userRefs = db.collection('user_references');
    const referrals = await userRefs.find({}).toArray();
    return referrals.sort((a, b) => b.referrals.length - a.referrals.length);
  }

  async run(msg) {
    const referrals = await this.getReferrals();
    const text = referrals.map((ref) => `@${ref.userName} | ${ref.referrals.length} points`);
    this.bot.sendMessage(msg.chat.id, `Top Leaderboard\n\n${text.join('\n')}`);
  }
};
