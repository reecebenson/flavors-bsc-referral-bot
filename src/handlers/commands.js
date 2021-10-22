const fs = require('fs');
const path = require('path');

class CommandHandler {
  constructor(bot) {
    this.bot = bot;
    this.commands = {};
  }

  process(dir, stack = "") {
    fs.readdirSync(dir).forEach((file) => {
      if (fs.statSync(path.join(dir, file)).isDirectory()) {
        this.process(path.join(dir, file), `${stack}${file}/`);
      }
      
      // Get command
      let cmdFile = require(path.join(dir, file));
      let cmd = new cmdFile(this.bot);

      // Cache our command
      this.commands[cmd.meta.name.toLowerCase()] = cmd;
      delete require.cache[require.resolve(path.join(dir, file))];

      // Log
      console.log(`[CMD] Initialised "/${cmd.meta.name}"`);
    });

    return this.commands;
  }

  fetch(name) {
    if (!Object.keys(this.commands).includes(name.toLowerCase())) return null;
    return this.commands[name.toLowerCase()];
  }
}

module.exports = CommandHandler;
