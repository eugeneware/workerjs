var x = 42;
importScripts('./test/fixtures/imported.js');
myfunc();
console.log('import');
self.postMessage('hello from eval');
self.onmessage = function (msg) {
  console.log('gama onmessage', msg.data);
};
