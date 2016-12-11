const readFile              = require('./read-file');
const analyzeFile           = require('./analyze-file');
const cloudinaryResizeImage = require('./cloudinary-resize-image');
const queryMetamind         = require('./query-metamind');
const Episode7 = require('episode-7');

function* sendImageToMetamind(filePath,
                              fileExt,
                              metamindModelId,
                              metamindAccountId,
                              metamindPrivateKey,
                              metamindJwtToken) {
  
  //get base64 Image Data
  let fileData = yield Episode7.call(
    readFile,
    filePath
  );

  //get the file size
  let fileInfo = yield Episode7.call(
    analyzeFile,
    filePath
  );

  //save image to cloud - resize if needed
  let resizedImgUrl = yield Episode7.call(
    cloudinaryResizeImage,
    fileExt,
    fileData,
    fileInfo
  );

  // send image to MetaMind
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