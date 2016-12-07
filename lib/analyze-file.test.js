const test = require('ava');
const analyzeFile = require('./analyze-file');
const mock = require('mock-fs');
const mount = require('mountfs');
const fs = require('fs');


test.before(t => {
  mount.patchInPlace();
});

test('analyzeFile returns file size in bytes',t=>{
  
  fs.mount("/some/path", mock.fs({
    "/test.png": "test-png-contents",
  }))
  
  return analyzeFile('/some/path/test.png').then(data=>{
    console.log(data.size);
    t.true(data.size > 0);
    t.true(data.size === 17);
    fs.unmount("/some/path");
  });
});

test.afterEach('cleanup', t => {
   mock.restore();
});