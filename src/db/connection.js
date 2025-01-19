const { MongoClient } = require('mongodb');
const config = require('../config');
const logger = require('../utils/logger');

let dbInstance = null;

async function connectDB() {
  if (dbInstance) return dbInstance;

  try {
    const client = new MongoClient(config.mongoURI);
    await client.connect();
    dbInstance = client.db(config.dbName);
    logger.info('Connected to MongoDB successfully');
    return dbInstance;
  } catch (err) {
    logger.error('MongoDB connection error:', err);
    throw new Error('Failed to connect to MongoDB');
  }
}

module.exports = connectDB;