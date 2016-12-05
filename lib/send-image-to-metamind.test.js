const test = require('ava');
const sendImageToMetamind = require('./send-image-to-metamind');
const readFile              = require('./read-file');
const analyzeFile           = require('./analyze-file');
const cloudinaryResizeImage = require('./cloudinary-resize-image');
const queryMetamind         = require('./query-metamind');

test('sendImageToMetamind gets result', t=> {
  const filePath = '/test/path';
  const fileExt = 'png';
  const metamindModelId   = 'xxxxxx-model-id';
  const metamindAccountId = 'yyyyy-account-id';
  const metamindPrivateKey = 'asdf-private-key';
  const metamindJwtToken = 'iiiii-jwt-token';
  const testImgUrl = 'test-img-url';

  const subject = sendImageToMetamind(filePath,fileExt,
                              metamindModelId,
                              metamindAccountId,
                              metamindPrivateKey,
                              metamindJwtToken);

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
  t.is(yielded.value.fn,queryMetamind);
  t.deepEqual(yielded.value.args, 
                      [testImgUrl,
                      metamindModelId,
                      metamindAccountId,
                      metamindPrivateKey,
                      metamindJwtToken]);

  yielded = subject.next('{"probabilities":[]}');
  t.true(yielded.done);
  t.is(yielded.value,'{"probabilities":[]}');



});