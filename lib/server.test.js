const test = require('ava');
const createServer = require('./server');

test('Creates an Express app', t => {
  t.plan(1);

  let server = createServer();

  t.is(typeof server.listen, 'function');
});