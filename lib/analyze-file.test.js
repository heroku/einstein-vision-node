const test = require('ava');
const analyzeFile = require('./analyze-file');
const mock = require('mock-fs');
const fs = require('fs');

test('analyzeFile returns file size in bytes',t=>{
  
  mock({
    'some': {
      'path': {
        "test.png": "test-png-contents"
      }
    }
  });
  
  return analyzeFile('some/path/test.png').then(data=>{
    t.true(data.size > 0);
    t.true(data.size === 17);
  });
});

test.afterEach('cleanup', t => {
   mock.restore();
});