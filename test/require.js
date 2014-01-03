var expect = require('expect.js'),
    path = require('path'),
    Worker = require('..');

function fixturePath(file) {
  return path.join(__dirname, 'fixtures', file);
}

describe('workerjs', function() {
  describe('require worker', function() {
    it('should be able to do simple web workers', function(done) {
      var worker = new Worker(fixturePath('evalworker.js'), true);
      worker.onmessage = function (msg) {
        expect(msg).to.eql({ data: { msg: 'hello', y: 84,
          received: 'another message' } });
        done();
      };
      worker.postMessage('another message');
    });

    it('should spawn in a different pid', function(done) {
      var pid = process.pid;
      var worker = new Worker(fixturePath('pidworker.js'), true);
      worker.onmessage = function (msg) {
        expect(msg.data).to.not.equal(pid);
        done();
      };
    });

    it('should be able to offload CPU intensive activity', function(done) {
      var start = Date.now();
      var worker = new Worker(fixturePath('fibworker.js'), true);
      worker.onmessage = function (msg) {
        expect(msg.data).to.equal(1346269);
        done();
      };
      worker.postMessage(30);
      expect(Date.now() - start).to.be.below(20);
    });

    it('should be able to use addEventListener', function(done) {
      var worker = new Worker(fixturePath('addEventListenerWorker.js'), true);
      worker.addEventListener('message', function (msg) {
        expect(msg).to.eql({ data: { msg: 'hello', y: 84,
          received: 'another message' } });
        done();
      });
      worker.postMessage('another message');
    });

    it('should be able to require other modules', function(done) {
      var worker = new Worker(fixturePath('requireworker.js'), true);
      worker.addEventListener('message', function (msg) {
        expect(msg.data).to.equal(87178291200.00021);
        done();
      });
      worker.postMessage(15);
    });

    it('should run the module.exports function', function(done) {
      var worker = new Worker(fixturePath('exportsworker.js'), true);
      worker.addEventListener('message', function (msg) {
        expect(msg.data).to.equal(42);
        done();
      });
    });
  });
});
