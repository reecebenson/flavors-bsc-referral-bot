const { isAdmin } = require('../utils');

module.exports = class {
  constructor(bot) {
    this.bot = bot;
    this.meta = {
      name: "help",
      description: "Displays a help message with the available commands.",
      channels: ['private', 'supergroup'],
      adminOnly: false
    };
  }

  run(msg) {
    const cmds = [];
    Object.keys(this.bot.commands.commands).forEach((name) => {
      const cmd = this.bot.commands.fetch(name);
      
      if (
        (isAdmin(msg.from.id) && cmd.meta.adminOnly) ||
        !cmd.meta.adminOnly
      ) {
        cmds.push(`/${name} - ${cmd.meta.description || 'no description'}`);
      }
    });

    this.bot.sendMessage(msg.chat.id, `Command List\n\n${cmds.join('\n')}`);
  }
};
