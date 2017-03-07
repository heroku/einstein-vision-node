const test = require('ava');
const shouldResizeImage = require('./should-resize-image');

test('shouldResizeImage returns null for small image',t=>{
  const result = shouldResizeImage(500,1,1);
  t.is(result,undefined);
});

test('shouldResizeImage calculates correct values',t=>{
  const result = shouldResizeImage(10000000,3264,2448);
  t.is(result.width,2307);
  t.is(result.height,1731);
});
