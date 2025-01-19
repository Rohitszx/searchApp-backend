function handleGrpcError(error, callback) {
    callback({
      code: error.code || grpc.status.UNKNOWN,
      message: error.message || 'An unknown error occurred',
    });
  }
  
  module.exports = handleGrpcError;
  