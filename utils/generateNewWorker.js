const { Worker } = require('worker_threads');
const path = require('path');
const requestTracker = require('./requestTracker');

const idleTimeout = 15 * 60 * 1000; // 15 minutes in milliseconds

const generateNewWorker = (workerName) => {
  let worker = null;
  let idleTimer = null;

  const createWorker = () => {
    worker = new Worker(path.join(__dirname, '../workers', workerName));

    const resetIdleTimer = () => {
      if (idleTimer) {
        clearTimeout(idleTimer);
      }
      idleTimer = setTimeout(() => {
        console.log(`Terminating idle worker: ${worker.threadId}`);
        worker.terminate();
      }, idleTimeout);
    };

    worker.on('message', (data) => {
      const { response, requestId } = data;
      requestTracker[requestId](response);
      delete requestTracker[requestId];
      resetIdleTimer();
    });

    worker.on('error', (error) => {
      console.error(`Worker error: ${error}`);
      worker.terminate();
    });

    worker.on('exit', (code) => {
      if (code !== 0) {
        console.error(`Worker stopped with exit code ${code}`);
      }
      clearTimeout(idleTimer);
      worker = null;
    });

    console.log(`Created worker: ${worker.threadId}`);
    resetIdleTimer();
  };

  const getWorker = () => {
    if (!worker) {
      createWorker();
    }
    return worker;
  };

  return getWorker;
};

module.exports = generateNewWorker;
