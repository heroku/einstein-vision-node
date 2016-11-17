const test = require('ava');
const oAuthToken = require('./oauth-token');

test('oAuthToken is null before set', t=> {
  t.is(null,oAuthToken.get());
})

test('oAuthToken returns correct token', t=>{
  const token = 'abc-test-token';
  oAuthToken.set(token);
  t.is(token,oAuthToken.get());
});

