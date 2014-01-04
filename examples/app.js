var Worker = require('..');
var w = new Worker('worker.js');
w.onmessage = function (msg) {
  console.log('from worker: ', msg.data);
};
w.postMessage('Hello from web page');
