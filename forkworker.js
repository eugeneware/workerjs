var fs = require('fs');
process.once('message', function (modulePath) {
  var module = require(modulePath);

  var noop = function () { };
  global.self = {
    postMessage: function (msg) {
      process.send(JSON.stringify({ data: msg }));
    },
    onmessage: noop,
    onerror: noop,
    addEventListener: function (eventName, cb) {
      if (eventName === 'message') {
        global.onmessage = global.self.onmessage = cb;
      } else if (eventName === 'error') {
        global.onerror = global.self.onerror = cb;
      }
    }
  };

  Object.keys(global.self).forEach(function (key) {
    global[key] = global.self[key];
  });

  process.on('message', function (msg) {
    global.self.onmessage && global.self.onmessage(msg);
  });
  process.on('error', function (err) {
    global.self.onerror && global.self.onerror(err);
  });
  module();
});
