console.log('i am in a worker');
self.onmessage = function (msg) {
  self.postMessage('received ' + msg.data);
};
