module.exports = class {
  constructor(bot) {
    this.bot = bot;
    this.meta = {
      name: "top",
      description: "Shows the Top 10 members of the referral leaderboard",
      channels: ['private', 'supergroup'],
      adminOnly: false
    };
  }

  async getReferrals() {
    const db = this.bot.db.fetch();
    const userRefs = db.collection('user_references');
    const referrals = await userRefs.find({}).toArray();
    return referrals.sort(
      (a, b) => 
        (b.referrals.length + b.referrals.map((r) => r.messages.length).reduce((a, b) => a + b))
          - (a.referrals.length + a.referrals.map((r) => r.messages.length).reduce((a, b) => a + b))
    );
  }

  async run(msg) {
    const referrals = await this.getReferrals();
    const text = referrals.map((ref) => `@${ref.userName} | ${ref.referrals.length + ref.referrals.map((r) => r.messages.length).reduce((a, b) => a + b)} points`);

    if (text.length > 0) {
      return this.bot.sendMessage(msg.chat.id, `Top 10 Leaderboard\n\n${text.slice(0, 10).join('\n')}`);
    }

    this.bot.sendMessage(msg.chat.id, "Top 10 Leaderboard\n\nNo one has made any referrals yet.\nGet started by typing /ref in the chat.");
  }
};
