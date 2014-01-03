var cp = require('child_process'),
    fs = require('fs'),
    path = require('path');

var bootstrap =
  fs.readFileSync(path.join(__dirname, 'bootstrap.js'), 'utf8');

module.exports = Worker;
function Worker(file, type) {
  if (type === true) {
    type = 'require';
  } else {
    type = 'eval';
  }

  var self = this;
  this.child = cp.fork(path.join(__dirname, type + 'worker.js'));

  if (type === 'eval') {
    file = bootstrap + '\n' + fs.readFileSync(file, 'utf8');
  }
  this.child.send(file);
  this.child.on('message', function (msg) {
    var parsed = JSON.parse(msg);
    self.onmessage && self.onmessage.call(self, parsed);
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
