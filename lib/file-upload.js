const path     = require('path');
const sendImageToVisionApi = require('./send-image-to-vision-api');

// Mutable variable to support rewire in tests.
var Episode7 = require('episode-7');

function fileUpload(request, response, next) {
  const filePath = request.files.file.path;
  const fileExt  = path.extname(filePath).replace(/^\./,'');
  const modelId    = process.env.CUSTOM_MODEL_ID;
  const pvsUrl     = process.env.EINSTEIN_VISION_URL;
  const accountId  = process.env.EINSTEIN_VISION_ACCOUNT_ID;
  const privateKey = process.env.EINSTEIN_VISION_PRIVATE_KEY;
  const jwtToken   = process.env.EINSTEIN_VISION_TOKEN;
  return Episode7.run(sendImageToVisionApi,
               pvsUrl,
               filePath,
               fileExt,
               modelId,
               accountId,
               privateKey,
               jwtToken)
    .then(function(predictions) {
        //response.setHeader('Content-Type', 'application/json'); 
        response.status(200).send(predictions); 
    })
    .catch( error => next(error));
}

module.exports = fileUpload;