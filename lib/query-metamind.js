const rp = require('request-promise');
var Episode7 = require('episode-7');
const updateToken = require('./update-token');
const oAuthToken = require('./oauth-token');

let loopPreventor = false;

function* queryMetamind(resizedImgUrl,
                       metamindModelId='GeneralImageClassifier',
                       metamindAccountId,
                       metamindPrivateKey,
                       metamindJwtToken){
  var token = metamindJwtToken || oAuthToken.get();

  var formData = {
    modelId: metamindModelId,
    sampleLocation : resizedImgUrl
  }
  var options = {
      url: 'https://api.metamind.io/v1/vision/predict',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
        'Connection': 'keep-alive',
        'Cache-Control': 'no-cache'

      },
      formData:formData
  }
  let { body, isUnauthorized } = yield Episode7.call((options) => {
    return rp(options)
      .then( body => ({ body }) )
      .catch( error => {
        if(error.statusCode === 401) {
          return { isUnauthorized: true };
        } else {
          throw error;
        }
      })
  },options);
  
  if(!loopPreventor && isUnauthorized) {
    loopPreventor = true;
    let updatedToken = yield Episode7.call(
      updateToken,
      metamindAccountId,
      metamindPrivateKey
    );

    let metamindResult = yield Episode7.call( 
      queryMetamind,
      resizedImgUrl,
      metamindModelId
    );
    setTimeout(()=>{loopPreventor = false},1000);
    return metamindResult;
  } else {
    return body;
  }
}

module.exports = queryMetamind;