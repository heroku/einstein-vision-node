const test = require('ava');
const readFile = require('./read-file');
const mock = require('mock-fs');
const mount = require('mountfs');
const fs = require('fs');


test.before(t => {
  mount.patchInPlace();
});

test('readFile returns base64 data',t=>{
  
  fs.mount("/some/path", mock.fs({
    "/test.png": "test-png-contents",
  }))

  var base64regex = /[A-Za-z0-9+/=]/;
  
  return readFile('/some/path/test.png').then(data=>{
    t.true(base64regex.test(data));
    t.is(data,'dGVzdC1wbmctY29udGVudHM=');
    fs.unmount("/some/path");
  });
});

test.afterEach('cleanup', t => {
   mock.restore();
});