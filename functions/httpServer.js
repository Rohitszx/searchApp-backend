const express = require('express');
const grpc = require('@grpc/grpc-js');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const config = require('../src/config/index');
const logger = require('../src/utils/logger');
const { searchQuestions } = require('../src/services/questionService');

const PROTO_PATH = path.resolve(__dirname, '../src/proto/questions.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const questionsProto = grpc.loadPackageDefinition(packageDefinition).questions;

module.exports.handler = async (event, context) => {
  const app = express();
  const grpcClient = new questionsProto.QuestionService(
    `localhost:${config.grpcPort}`,
    grpc.credentials.createInsecure()
  );

  app.use(cors());
  app.use(bodyParser.json());
  app.get('/api/hello', async (req, res) => {
    return res.json({ message: 'Hello from server!' });
  });

  app.post('/api/search', async (req, res) => {
    const { query, type, page = 1, limit = 10 } = req.body;
    grpcClient.SearchQuestions({ query, type, page, limit }, (err, response) => {
      if (err) {
        logger.error('Error communicating with gRPC server:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }
      return res.json(response);
    });
  });

  return new Promise((resolve, reject) => {
    app.listen(config.httpPort || 3000, () => {
      logger.info(`HTTP server running on http://localhost:${config.httpPort}`);
      resolve({
        statusCode: 200,
        body: JSON.stringify({ message: 'HTTP server running successfully' }),
      });
    });
  });
};
