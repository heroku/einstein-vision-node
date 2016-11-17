const test = require('ava');
const queryMetamind = require('./query-metamind');
const rp = require('request-promise');
const rewire = require('rewire');
const updateToken = require('./update-token');

const metamindModelId   = 'xxxxxx-model-id';
const metamindAccountId = 'yyyyy-account-id';
const metamindPrivateKey = 'asdf-private-key';
const metamindJwtToken = 'iiiii-jwt-token';
const resizedImgUrl = 'resized-img-url';
const newlyGeneratedToken = 'asdf123-updated-token';

var formData = {
  modelId: metamindModelId,
  sampleLocation : resizedImgUrl
}
var options = {
    url: 'https://api.metamind.io/v1/vision/predict',
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${metamindJwtToken}`,
      'Content-Type': 'multipart/form-data',
      'Connection': 'keep-alive',
      'Cache-Control': 'no-cache'
    },
    formData:formData
}

test('queryMetamind token expired',t=> {
  const subject = queryMetamind(resizedImgUrl,
                              metamindModelId,
                              metamindAccountId,
                              metamindPrivateKey,
                              metamindJwtToken);

  let yielded = subject.next();
  t.is(yielded.value.args[0].headers.Authorization,'Bearer iiiii-jwt-token');
  
  yielded = subject.next({isUnauthorized: true});
  t.is(yielded.value.fn,updateToken);
  t.deepEqual(yielded.value.args,[metamindAccountId,metamindPrivateKey]);

  yielded = subject.next(newlyGeneratedToken);
  t.is(yielded.value.fn,queryMetamind);
  t.deepEqual(yielded.value.args,[resizedImgUrl,metamindModelId]);

  yielded = subject.next('{"probabilities":[]}');
  t.true(yielded.done);
  t.is(yielded.value,'{"probabilities":[]}');

});

test('queryMetamind token is valid', t=> {
  const subject = queryMetamind(resizedImgUrl,
                              metamindModelId,
                              metamindAccountId,
                              metamindPrivateKey,
                              metamindJwtToken);
  let yielded = subject.next();
  t.is(yielded.value.args[0].headers.Authorization,'Bearer iiiii-jwt-token');

  yielded = subject.next({body:'{"probabilities":[]}'});
  t.true(yielded.done);
  t.is(yielded.value,'{"probabilities":[]}');


});