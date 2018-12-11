const test = require('ava');
const readFile = require('./read-file');
const mock = require('mock-fs');
const fs = require('fs');

test('readFile returns base64 data',t=>{

  mock({
    'some': {
      'path': {
        "test.png": "test-png-contents"
      }
    }
  });

  var base64regex = /[A-Za-z0-9+/=]/;
  
  return readFile('some/path/test.png').then(data=>{
    t.true(base64regex.test(data));
    t.is(data,'dGVzdC1wbmctY29udGVudHM=');
  });
});

test.afterEach('cleanup', t => {
   mock.restore();
});