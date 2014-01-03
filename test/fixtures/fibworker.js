self.onmessage = function (msg) {
  self.postMessage(fibo(msg.data));
};

function fibo (n) {
  return n > 1 ? fibo(n - 1) + fibo(n - 2) : 1;
}
