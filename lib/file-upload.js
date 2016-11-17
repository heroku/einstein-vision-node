const path     = require('path');
const sendImageToMetamind = require('./send-image-to-metamind');

// Mutable variable to support rewire in tests.
var Episode7 = require('episode-7');

function fileUpload(request, response, next) {
  const filePath = request.files.file.path;
  const fileExt  = path.extname(filePath).replace(/^\./,'');
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

module.exports = fileUpload;