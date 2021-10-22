module.exports = class {
  constructor(bot) {
    this.bot = bot;
    this.meta = {
      name: "myid",
      description: "Shows your Telegram User ID.",
      channels: ['private', 'supergroup'],
      adminOnly: false
    };
  }

  async run(msg) {
    this.bot.sendMessage(msg.chat.id, `Your Telegram User ID is: ${msg.from.id}.`);
  }
};
