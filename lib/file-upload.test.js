const test = require('ava');
const rewire = require('rewire');
const sendImageToMetamind = require('./send-image-to-metamind');

test('fileUpload', t=>{
  t.plan(9);

  const predictions = '{"predictions":[]}';

  const filePath = 'test-path.png';
  const fileExt = '.png';
  const request = {
    files:{
      file:{
        path:filePath
      }
    }
  };
  const response = {
    status:function(statusCode){
      t.is(statusCode,200);
      return {
        send:function(v){
          t.is(v,predictions);
        }
      }
    }
  }
  const metamindModelId = 
    process.env.METAMIND_MODEL_ID = 
    'xxxxxx-model-id';
  const metamindAccountId = 
    process.env.METAMIND_ACCOUNT_ID = 
    'yyyyy-account-id';
  const metamindPrivateKey =
    process.env.METAMIND_PRIVATE_KEY = 
    'asdf-private-key';
  const metamindJwtToken = 
    process.env.METAMIND_TOKEN = 
    'iiiii-jwt-token';

  const fileUpload = rewire('./file-upload');
  fileUpload.__set__('Episode7',{
    run: function(...args) {
      t.is(args[0],sendImageToMetamind);
      t.is(args[1],filePath);
      t.is(args[2],'png');
      t.is(args[3],metamindModelId);
      t.is(args[4],metamindAccountId);
      t.is(args[5],metamindPrivateKey);
      t.is(args[6],metamindJwtToken);
      return Promise.resolve(predictions);
    }
  });

  return fileUpload(request, response, function(error) { t.true(false, 'Error should not occur') });
});