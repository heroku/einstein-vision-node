const test = require('ava');
const rewire = require('rewire');
const sendImageToVisionApi = require('./send-image-to-vision-api');

test('fileUpload', t=>{
  t.plan(10);

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
  const modelId = 
    process.env.PREDICTIVE_VISION_MODEL_ID = 
    'xxxxxx-model-id';
  const pvsUrl = 
    process.env.PREDICTIVE_SERVICES_URL = 
    'http://pvs.example.com/';
  const accountId = 
    process.env.PREDICTIVE_SERVICES_ACCOUNT_ID = 
    'yyyyy-account-id';
  const privateKey =
    process.env.PREDICTIVE_SERVICES_PRIVATE_KEY = 
    'asdf-private-key';
  const jwtToken = 
    process.env.PREDICTIVE_SERVICES_TOKEN = 
    'iiiii-jwt-token';

  const fileUpload = rewire('./file-upload');
  fileUpload.__set__('Episode7',{
    run: function(...args) {
      t.is(args[0],sendImageToVisionApi);
      t.is(args[1],pvsUrl);
      t.is(args[2],filePath);
      t.is(args[3],'png');
      t.is(args[4],modelId);
      t.is(args[5],accountId);
      t.is(args[6],privateKey);
      t.is(args[7],jwtToken);
      return Promise.resolve(predictions);
    }
  });

  return fileUpload(request, response, function(error) { t.true(false, 'Error should not occur') });
});