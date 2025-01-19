const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');
const config = require('../config');
const logger = require('../utils/logger');

const PROTO_PATH = path.resolve(__dirname, '../proto/questions.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const questionsProto = grpc.loadPackageDefinition(packageDefinition).questions;

module.exports.handler = async (event, context) => {
  const server = new grpc.Server();

  const { searchQuestions } = require('../services/questionService');

  server.addService(questionsProto.QuestionService.service, {
    SearchQuestions: (call, callback) => searchQuestions(call.request, callback),
  });

  return new Promise((resolve, reject) => {
    server.bindAsync(
      `localhost:${config.grpcPort}`,
      grpc.ServerCredentials.createInsecure(),
      (err) => {
        if (err) {
          logger.error('gRPC Server error:', err);
          reject(err);
        }
        logger.info(`gRPC server running on localhost:${config.grpcPort}`);
        server.start();
        resolve({
          statusCode: 200,
          body: JSON.stringify({ message: 'gRPC server started successfully' }),
        });
      }
    );
  });
};
