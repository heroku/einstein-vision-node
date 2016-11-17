const readFile              = require('./read-file');
const cloudinaryResizeImage = require('./cloudinary-resize-image');
const queryMetamind         = require('./query-metamind');
const Episode7 = require('episode-7');

function* sendImageToMetamind(filePath,fileExt,
                              metamindModelId,
                              metamindAccountId,
                              metamindPrivateKey,
                              metamindJwtToken) {
  let fileData = yield Episode7.call(
    readFile,
    filePath
  );

  let resizedImgUrl = yield Episode7.call(
    cloudinaryResizeImage,
    fileExt,
    fileData,
    500
  );

  let metamindResult = yield Episode7.call(
    queryMetamind,
    resizedImgUrl,
    metamindModelId,
    metamindAccountId,
    metamindPrivateKey,
    metamindJwtToken
  );
  
  return metamindResult;
}

module.exports = sendImageToMetamind;