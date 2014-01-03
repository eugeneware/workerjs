# workerjs

Server Web Workers for node.js that work.

[![build status](https://secure.travis-ci.org/eugeneware/workerjs.png)](http://travis-ci.org/eugeneware/workerjs)

## Installation

This module is installed via npm:

``` bash
$ npm install workerjs
```

## Background

Web Workers are part of the [HTML 5 spec](http://dev.w3.org/html5/workers/) and:

> defines an API that allows Web application authors to spawn background workers
> running scripts in parallel to their main page. This allows for thread-like
> operation with message-passing as the coordination mechanism

In effect, it allows you to get the benefit of multi-talking and multi-threading
in single-threaded Javascript, as well as the safety of the event loop.

You can achieve this in node.js using the [child_process.fork](http://nodejs.org/api/child_process.html#child_process_child_process_fork_modulepath_args_options) method, but then
you have to use a different API.

This module normalizes the Web Worker API for server-side javascript in node.js
with the hopes that we can build more multi-tasking modules built on the
Web Worker standard that will work on both the server and the client-side
using [browserify](https://github.com/substack/node-browserify).

## Example Usage

By using Web Workers you can do CPU-intensive operations **without** blocking
the event-loop and incoming IO:

``` js
// app.js - run with "node app.js"
var worker = new Worker('/path/to/fibworker.js');
worker.onmessage = function (msg) {
  expect(msg.data).to.equal(1346269);
};
worker.postMessage(30);
```

``` js
// fibworker.js - CPU web worker code
self.onmessage = function (msg) {
  self.postMessage(fibo(msg.data));
};

function fibo (n) {
  return n > 1 ? fibo(n - 1) + fibo(n - 2) : 1;
}
```

## Node Mode - allowing require()

I've also added a "node-friendly" option that allows the Web Worker to use
require() and other node.js conventions. To use this, just pass a boolean
value of `true` through to the second argument of the `Worker` contructor:

``` js
// app.js - run with "node app.js"
var worker = new Worker('/path/to/gammaworker.js', true);
worker.addEventListener('message', function (msg) {
  expect(msg.data).to.equal(87178291200.00021);
  done();
});
worker.postMessage(15);
```

``` js
// gammaworker.js - uses require
var gamma = require('gamma');
self.onmessage = function (msg) {
  postMessage(gamma(msg.data));
};
```

Also, if you provide a ```module.exports``` function it will be executed as
an entry point of the web worker. This emulates the browserify transform
behaviour in [webworkify](https://github.com/substack/webworkify):

``` js
// app.js - run with "node app.js"
var worker = new Worker('/path/to/gammaworker2.js', true);
worker.addEventListener('message', function (msg) {
  expect(msg.data).to.equal(87178291200.00021);
  done();
});
worker.postMessage(15);
```

``` js
// gammaworker2.js - uses require
var gamma = require('gamma');

module.exports = function () {
  postMessage(gamma(msg.data));
};
```
