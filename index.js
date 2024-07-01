const fastify = require('fastify')({ logger: true, connectionTimeout: 5000 });
const { v4: uuidv4 } = require('uuid');
const generateNewWorker = require('./utils/generateNewWorker');
const requestTracker = require('./utils/requestTracker');

const getCatsWorker = generateNewWorker('getCatsWorker');
const getDogsWorker = generateNewWorker('getDogsWorker');

fastify.addHook('onRequest', async (request, reply) => {
  let correlationId = request.headers['correlationid'];

  if (!correlationId) {
    correlationId = uuidv4();
  }

  request.correlationId = correlationId;
  reply.header('correlationId', correlationId);
});

fastify.get('/getCatsInfo', function handler(request, reply) {
  requestTracker[request.id] = (result) => reply.send(result);
  const worker = getCatsWorker();
  worker.postMessage({ requestId: request.id });
});

fastify.get('/getDogsInfo', function handler(request, reply) {
  requestTracker[request.id] = (result) => reply.send(result);
  const worker = getDogsWorker();
  worker.postMessage({ requestId: request.id });
});

fastify.listen({ port: 3000 }, (err) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
});
