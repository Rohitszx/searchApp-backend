const logger = require('../utils/logger');
const config = require('../config');
const grpc = require('@grpc/grpc-js');

async function searchQuestions(db, call, callback) {
  const { query, type, page = 1, limit = 10 } = call.request;
  const skip = (page - 1) * limit;

  try {
    const collection = db.collection(config.dbName);
    const filter = {
      ...(query && { title: { $regex: query, $options: 'i' } }),
      ...(type && { type }),
    };

    const [questions, total] = await Promise.all([
      collection.find(filter).skip(skip).limit(limit).toArray(),
      collection.countDocuments(filter),
    ]);

    const formattedQuestions = questions.map((q) => {
      if (q.type === 'MCQ') {
        return {
          id: q._id.toString(),
          type: q.type,
          title: q.title,
          solution: q.solution || '',
          options: q.options || [], 
        };
      }

      if (q.type === 'ANAGRAM') {
        return {
          id: q._id.toString(),
          type: q.type,
          title: q.title,
          solution: q.solution || '',
          anagramType: q.anagramType || '', 
          blocks: q.blocks || [],
        };
      }
      return {
        id: q._id.toString(),
        type: q.type,
        title: q.title,
        solution: q.solution || '',
      };
    });

    logger.info(`Fetched ${questions.length} questions for query: "${query}" with type: "${type}"`);
    callback(null, { questions: formattedQuestions, total });
  } catch (err) {
    logger.error('Error in searchQuestions:', err);
    callback({
      code: grpc.status.INTERNAL,
      message: 'Internal server error',
    });
  }
}

module.exports = {
  searchQuestions,
};
