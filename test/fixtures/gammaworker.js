var gamma = require('gamma');
importScripts('./test/fixtures/imported.js');
myfunc();

module.exports = function () {
  console.log('import');
  console.log(self);
  self.postMessage('hello from gamma');
  self.onmessage = function (msg) {
    console.log('gama onmessage', msg.data);
  };
  setInterval(function () {
    var r = 1 / Math.random() - 1;
    postMessage([ r, gamma(r) ]);
  }, 500);
};

