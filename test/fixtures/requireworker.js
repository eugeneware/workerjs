var gamma = require('gamma');
self.onmessage = function (msg) {
  postMessage(gamma(msg.data));
};
