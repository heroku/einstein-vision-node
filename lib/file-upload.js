const path     = require('path');
const Episode7 = require('episode-7');
const fsp      = require('fs-promise');
const rp       = require('request-promise');
const cloudinaryResizeImage = require('./cloudinary-resize-image');

function fileUpload(request, response, next) {
  var filePath = request.files.file.path;
  var fileExt  = path.extname(filePath);
  Episode7.run(sendImageToMetamind, filePath,fileExt)
    .then( predictions => response.status(200).send(predictions))
    .catch( error => console.error(error));
}

function* sendImageToMetamind(filePath,fileExt){
  // Wrap side-effects with Episode 7's `call`
  let fileData = yield Episode7.call(
    readUserFile,
    filePath
  );

  let cloudinaryResult = yield Episode7.call(
    cloudinaryResizeImage,
    fileExt,
    fileData,
    500
  );

  let resizedImgUrl = cloudinaryResult.eager[0].url;

  let formData = {
    modelId: process.env.METAMIND_MODEL_ID || 'GeneralImageClassifier',
    sampleLocation : resizedImgUrl
  }
  let options = {
      url: 'https://api.metamind.io/v1/vision/predict',
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + process.env.METAMIND_TOKEN,
        'Content-Type': 'multipart/form-data',
        'Connection': 'keep-alive',
        'Cache-Control': 'no-cache'

      },
      formData:formData
  }

  let metamindResult = yield Episode7.call(
    queryMetamind,
    options
  );

  return metamindResult;
}

function readUserFile(filePath){
  return fsp.readFile(filePath,'base64').then(data => data);
}

function queryMetamind(options){
  return rp(options).then(body=>body);
}

module.exports = fileUpload;