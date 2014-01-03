var cp = require('child_process'),
    path = require('path');

module.exports = Worker;
function Worker(file, type) {
  if (type !== 'eval' && type !== 'require') {
    type = 'eval';
  }

  var self = this;
  this.child = cp.fork(path.join(__dirname, type + 'worker.js'));
  this.child.send(file);
  this.child.on('message', function (msg) {
    var parsed = JSON.parse(msg);
    self.onmessage && self.onmessage.call(self, { data: msg });
  });
  this.child.on('error', function (err) {
    self.onerror && self.onerror(err);
  });
}

Worker.prototype.postMessage = function (msg) {
  this.child.send(JSON.stringify({ data: msg }));
};

Worker.prototype.terminate = function() {
  this.child.kill();
};

Worker.prototype.onmessage = function () {
};

Worker.prototype.onerror = function () {
};

Worker.prototype.addEventListener = function (eventName, cb) {
  if (eventName === 'message') {
    this.onmessage = cb;
  } else if (eventName === 'error') {
    this.onerror = cb;
  }
};
