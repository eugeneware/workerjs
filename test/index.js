var expect = require('expect.js'),
    path = require('path'),
    Worker = require('..');

describe('workerjs', function() {
  it('should be able to do simple web workers', function(done) {
    var worker = new Worker(path.join(__dirname, 'fixtures', 'testworker.js'));
    worker.postMessage('world');
    done();
  });
});
