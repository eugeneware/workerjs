var path = require('path');
var Worker = require('..');
var worker = new Worker(path.join(__dirname, '..', 'test', 'fixtures', 'evalworker.js'), 'eval');
worker.onmessage = function (msg) {
  console.log('received: ' + msg.data);
  worker.terminate();
};
worker.postMessage('another message');
