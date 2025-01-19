const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const connectDB = require('./db/connection');
const config = require('./config');
const logger = require('./utils/logger');
const cors = require('cors');

const PROTO_PATH = path.resolve(__dirname, './proto/questions.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const questionsProto = grpc.loadPackageDefinition(packageDefinition).questions;

async function startGrpcServer(db) {
  const server = new grpc.Server({
    'grpc.max_receive_message_length': 10 * 1024 * 1024, // 10MB
    'grpc.max_send_message_length': 10 * 1024 * 1024,    // 10MB
  });

  const { searchQuestions } = require('./services/questionService');

  server.addService(questionsProto.QuestionService.service, {
    SearchQuestions: (call, callback) => searchQuestions(db, call, callback),
  });

  server.bindAsync(
    `localhost:${config.grpcPort}`,
    grpc.ServerCredentials.createInsecure(),
    (err) => {
      if (err) {
        logger.error('Failed to bind gRPC server:', err);
        process.exit(1);
      }
      logger.info(`gRPC server running on localhost:${config.grpcPort}`);
      server.start();
    }
  );
}

function startHttpServer() {
  const app = express();
  const corsOptions = {
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  };
  app.use(cors(corsOptions));
  app.use(bodyParser.json());

  const grpcClient = new questionsProto.QuestionService(
    `localhost:${config.grpcPort}`,
    grpc.credentials.createInsecure()
  );

  app.post('/api/search', async (req, res) => {
    const { query, type, page = 1, limit = 10 } = req.body;
    grpcClient.SearchQuestions({ query, type, page, limit }, (err, response) => {
      if (err) {
        logger.error('Error communicating with gRPC server:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }
      console.log('response:', response);
      return res.json(response);
    });
  });

  const port = config.httpPort || 3000;
  app.listen(port, () => {
    logger.info(`HTTP server running on http://localhost:${port}`);
  });
}

async function startServer() {
  try {
    const db = await connectDB();
    await startGrpcServer(db);
    startHttpServer();
  } catch (error) {
    logger.error('Error starting servers:', error);
    process.exit(1);
  }
}

module.exports = startServer;
