require('dotenv').config();

const config = {
  mongoURI: process.env.MONGO_URI || 'mongodb://localhost:27017',
  dbName: process.env.DB_NAME || 'questions',
  grpcPort: process.env.GRPC_PORT || 50051,
  logLevel: process.env.LOG_LEVEL || 'info',
};

module.exports = config;
