const test = require('ava');
const sendImageToVisionApi = require('./send-image-to-vision-api');
const readFile              = require('./read-file');
const analyzeFile           = require('./analyze-file');
const cloudinaryResizeImage = require('./cloudinary-resize-image');
const queryVisionApi         = require('./query-vision-api');

test('sendImageToVisionApi gets result', t=> {
  const pvsUrl = 'http://pvs.example.com/';
  const filePath = '/test/path';
  const fileExt = 'png';
  const modelId   = 'xxxxxx-model-id';
  const accountId = 'yyyyy-account-id';
  const privateKey = 'asdf-private-key';
  const jwtToken = 'iiiii-jwt-token';
  const testImgUrl = 'test-img-url';

  const subject = sendImageToVisionApi(pvsUrl,
                              filePath,
                              fileExt,
                              modelId,
                              accountId,
                              privateKey,
                              jwtToken);

  let yielded = subject.next();
  t.is(yielded.value.fn, readFile);
  t.deepEqual(yielded.value.args, [filePath]);

  yielded = subject.next('base-64-contents');
  t.is(yielded.value.fn,analyzeFile);
  t.deepEqual(yielded.value.args, [filePath]);

  yielded = subject.next('file-info');
  t.is(yielded.value.fn,cloudinaryResizeImage);
  t.deepEqual(yielded.value.args, [fileExt,'base-64-contents','file-info']);

  yielded = subject.next(testImgUrl);
  t.is(yielded.value.fn,queryVisionApi);
  t.deepEqual(yielded.value.args, 
                      [pvsUrl,
                      testImgUrl,
                      modelId,
                      accountId,
                      privateKey,
                      jwtToken]);

  yielded = subject.next('{"probabilities":[]}');
  t.true(yielded.done);
  t.is(yielded.value,'{"probabilities":[]}');



});