var express     = require('express');
var fs          = require('fs');
var multipart   = require('connect-multiparty');
var fs          = require('fs');
var https       = require('https');
var request     = require('request');
var querystring = require('querystring');
var cloudinary  = require('cloudinary');

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
  //console.log(req.files);
  // don't forget to delete all req.files when done 

  fs.readFile(req.files.file.path,'base64', function (err, data) {
    if (err) {
      return console.log(err);
    }
    // console.log(data);
    var formData = {
      modelId: process.env.METAMIND_MODELID || 'GeneralImageClassifier',
      sampleBase64Content : data
    }
    var options = {
        uri: 'https://api.metamind.io/v1/vision/predict',
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + process.env.METAMIND_TOKEN,
          'Content-Type': 'multipart/form-data',
          'Connection': 'keep-alive',
          'Cache-Control': 'no-cache'

        },
        formData:formData
    }
    
    request.post(options, function optionalCallback(err, httpResponse, body) {
      if (err) {
        return console.error('upload failed:', err);
      }
      console.log('status code', httpResponse.statusCode);
      console.log('headers', httpResponse.headers);
      console.log('Server Response:', body);
      if(httpResponse.statusCode == 200){
        res.status(200).send(body);
      }else{
        res.status(httpResponse.statusCode).send(body);
      }
    });

  });
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


