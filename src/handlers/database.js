const { MongoClient } = require('mongodb');

class DatabaseHandler {
  constructor(bot, dbConfig) {
    this.bot = bot;
    this.dbClient = new MongoClient(dbConfig.url);
    this.conn = null;

    // Attempt database connection
    this.dbClient.connect()
      .then(() => {
        this.conn = this.dbClient.db(dbConfig.name);
        console.log(`[MNG] Connected to database: "${dbConfig.name}" successfully.`);
      })
      .catch((err) => {
        console.log(`[ERR] Unable to connect to database:\n${err}`);
      });
  }

  fetch() {
    return this.conn;
  }
}

module.exports = DatabaseHandler;
