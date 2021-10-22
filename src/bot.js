const path = require('path');
const TelegramBot = require('node-telegram-bot-api');
const Config = require('../config.json');
const CommandHandler = require('./handlers/commands');
const EventHandler = require('./handlers/events');
const DatabaseHandler = require('./handlers/database');

// Bot
const bot = new TelegramBot(Config.accessToken, {
  polling: true
});

// Grab handlers
bot.config = Config;
bot.db = new DatabaseHandler(bot, Config.db);
bot.events = new EventHandler(bot);
bot.commands = new CommandHandler(bot);

// Initialise
bot.base = path.join(__dirname, '../src');
bot.events.process(`${bot.base}/events/`);
bot.commands.process(`${bot.base}/commands/`);

// Execute
bot.events.handle();
