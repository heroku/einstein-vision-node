const path     = require('path');
const Episode7 = require('episode-7');
const queryMetamind = require('./query-metamind');
const readFile = require('./read-file');

const cloudinaryResizeImage = require('./cloudinary-resize-image');

function fileUpload(request, response, next) {
  const filePath = request.files.file.path;
  const fileExt  = path.extname(filePath);
  const metamindModelId = process.env.METAMIND_MODEL_ID;
  const metamindAccountId = process.env.METAMIND_ACCOUNT_ID;
  const metamindPrivateKey = process.env.METAMIND_PRIVATE_KEY;
  const metamindJwtToken = process.env.METAMIND_TOKEN;
  return Episode7.run(sendImageToMetamind,
               filePath,
               fileExt,
               metamindModelId,
               metamindAccountId,
               metamindPrivateKey,
               metamindJwtToken)
    .then(function(predictions) {
        //response.setHeader('Content-Type', 'application/json'); 
        response.status(200).send(predictions); 
    })
    .catch( error => next(error));
}

function* sendImageToMetamind(filePath,fileExt,
                              metamindModelId,
                              metamindAccountId,
                              metamindPrivateKey,
                              metamindJwtToken){
  let fileData = yield Episode7.call(
    readFile,
    filePath
  );

  let cloudinaryResult = yield Episode7.call(
    cloudinaryResizeImage,
    fileExt,
    fileData,
    500
  );

  let resizedImgUrl = cloudinaryResult.eager[0].url;

  let metamindResult = yield Episode7.call(
    queryMetamind,
    resizedImgUrl,
    metamindModelId,
    metamindAccountId,
    metamindPrivateKey,
    metamindJwtToken
  );
  
  console.log(metamindResult);
  return metamindResult;
}

module.exports = fileUpload;