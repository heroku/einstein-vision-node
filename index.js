const express     = require('express');
const fs          = require('fs');
const multipart   = require('connect-multiparty');
const https       = require('https');
const request     = require('request');
const rp          = require('request-promise');
const querystring = require('querystring');
const cloudinary  = require('cloudinary');
const path        = require('path')
const Episode7    = require('episode-7');
const fsp         = require('fs-promise');

var app                 = express();
var multipartMiddleware = multipart();

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('pages/index');
});

app.post('/file-upload', multipartMiddleware, function(req, res) {
  var filePath = req.files.file.path;
  var fileExt  = path.extname(filePath);
  Episode7.run(sendImageToMetamind, filePath,fileExt)
    .then( predictions => res.status(200).send(predictions))
    .catch( error => console.error(error))
});

var server = app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

if(!process.env.METAMIND_TOKEN) {
  console.log("No Metamind Token provided. Shutting down.")
  server.close();
}

function* sendImageToMetamind(filePath,fileExt){
  // Wrap side-effects with Episode 7's `call`
  let data = yield Episode7.call(
    readUserFile,
    filePath
  );

  let cloudinaryResult = yield Episode7.call(
    cloudinaryResizeImage,
    fileExt,
    data,
    500
  );

  let resizedImgUrl = cloudinaryResult.eager[0].url;

  let formData = {
    modelId: process.env.METAMIND_MODELID || 'GeneralImageClassifier',
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


function cloudinaryResizeImage(fileExt,data,width){
  return new Promise(function (fulfill,reject) {
    cloudinary.uploader.upload(
      'data:image/'+fileExt+';base64,'+data, 
      function(result){
        if(result.error) {
          console.error('upload to cloudinary failed',result.error);
          reject(result.error);
        }else {
          fulfill(result);
        }
      },
      {
        eager: {
          width: 500, 
          crop: "limit"
        }
      }
    );
  });
}

function queryMetamind(options){
  return rp(options).then(body=>body);
}


