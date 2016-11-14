const rp = require('request-promise');
const updateToken = require('./update-token');
const oAuthToken = require('./oauth-token');

let loopPreventor = false;

function queryMetamind(resizedImgUrl,
                       metamindModelId='GeneralImageClassifier',
                       metamindAccountId,
                       metamindPrivateKey){
  var formData = {
    modelId: metamindModelId,
    sampleLocation : resizedImgUrl
  }
  var options = {
      url: 'https://api.metamind.io/v1/vision/predict',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${oAuthToken.get()}`,
        'Content-Type': 'multipart/form-data',
        'Connection': 'keep-alive',
        'Cache-Control': 'no-cache'

      },
      formData:formData
  }
  console.log(options);

  return rp(options).then(body=>body)
  .catch((error)=>{
    if(!loopPreventor && error.statusCode === 401) {
      loopPreventor = true;
      return updateToken(metamindAccountId,metamindPrivateKey).then((token)=>{
        const metamindResult = queryMetamind(resizedImgUrl,metamindModelId);
        setTimeout(()=>{loopPreventor = false},1000);
        return metamindResult;
      });
    } else {
      throw error;
    }
  });
}

module.exports = queryMetamind;