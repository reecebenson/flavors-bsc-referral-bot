const fs = require('fs');
const path = require('path');

class EventHandler {
  constructor(bot) {
    this.bot = bot;
    this.events = {};
  }

  process(dir, stack = "") {
    fs.readdirSync(dir).forEach((file) => {
      if (fs.statSync(path.join(dir, file)).isDirectory()) {
        this.process(path.join(dir, file), `${stack}${file}/`);
      }
      
      // Get command
      let eventFile = require(path.join(dir, file));
      let evt = new eventFile(this.bot);

      // Cache our command
      this.events[evt.meta.name] = evt;
      delete require.cache[require.resolve(path.join(dir, file))];

      // Log
      console.log(`[EVT] Initialised "${evt.meta.name}"`);
    });

    return this.events;
  }

  handle() {
    Object.entries(this.events).forEach(([name, event]) => {
      try {
        this.bot.on(name, (msg) => event.run(msg));
      }
      catch {
        console.error(`[ERR] Failed to initialise event for: "${name}"!`);
      }
    });
  }
}

module.exports = EventHandler;
