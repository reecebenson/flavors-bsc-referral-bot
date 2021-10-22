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

  async run(msg) {
    this.bot.sendMessage(msg.chat.id, `You have 0 points.`);
  }
};
