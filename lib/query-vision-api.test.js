const test = require('ava');
const queryVisionApi = require('./query-vision-api');
const rp = require('request-promise');
const rewire = require('rewire');
const updateToken = require('./update-token');

const pvsUrl = 'http://pvs.example.com/';
const modelId   = 'xxxxxx-model-id';
const accountId = 'yyyyy-account-id';
const privateKey = 'asdf-private-key';
const jwtToken = 'iiiii-jwt-token';
const resizedImgUrl = 'resized-img-url';
const newlyGeneratedToken = 'asdf123-updated-token';

var formData = {
  modelId: modelId,
  sampleLocation : resizedImgUrl
}
var options = {
    url: pvsUrl,
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${jwtToken}`,
      'Content-Type': 'multipart/form-data',
      'Connection': 'keep-alive',
      'Cache-Control': 'no-cache'
    },
    formData:formData
}

test('queryVisionApi token expired',t=> {
  const subject = queryVisionApi(pvsUrl,
                              resizedImgUrl,
                              modelId,
                              accountId,
                              privateKey,
                              jwtToken);

  let yielded = subject.next();
  t.is(yielded.value.args[0].url,'http://pvs.example.com/v1/vision/predict');
  t.is(yielded.value.args[0].headers.Authorization,'Bearer iiiii-jwt-token');
  
  yielded = subject.next({isUnauthorized: true});
  t.is(yielded.value.fn,updateToken);
  t.deepEqual(yielded.value.args,[pvsUrl,accountId,privateKey]);

  yielded = subject.next(newlyGeneratedToken);
  t.is(yielded.value.fn,queryVisionApi);
  t.deepEqual(yielded.value.args,[pvsUrl,resizedImgUrl,modelId]);

  yielded = subject.next('{"probabilities":[]}');
  t.true(yielded.done);
  t.is(yielded.value,'{"probabilities":[]}');

});

test('queryVisionApi token is valid', t=> {
  const subject = queryVisionApi(pvsUrl,
                              resizedImgUrl,
                              modelId,
                              accountId,
                              privateKey,
                              jwtToken);
  let yielded = subject.next();
  t.is(yielded.value.args[0].url,'http://pvs.example.com/v1/vision/predict');
  t.is(yielded.value.args[0].headers.Authorization,'Bearer iiiii-jwt-token');

  yielded = subject.next({body:'{"probabilities":[]}'});
  t.true(yielded.done);
  t.is(yielded.value,'{"probabilities":[]}');


});