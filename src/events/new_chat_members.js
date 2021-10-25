class NewMemberEvent {
  constructor(bot) {
    this.bot = bot;
    this.meta = {
      name: "new_chat_members"
    };
  }

  async run(ctx) {
    // console.log('Found new chat member:', ctx);
  }
};

module.exports = NewMemberEvent;
