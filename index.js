var express     = require('express');
var fs          = require('fs');
var multipart   = require('connect-multiparty');
var fs          = require('fs');
var https       = require('https');
var request     = require('request');
var querystring = require('querystring');
var cloudinary  = require('cloudinary');
var path        = require('path')

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
  var filePath = req.files.file.path;
  var fileExt = path.extname(filePath);

  fs.readFile(filePath,'base64', function (err, data) {
    if (err) {
      return console.log(err);
    }

    cloudinary.uploader.upload(
      'data:image/'+fileExt+';base64,'+data,
      function(result) { 
        if(result.error) {
          console.error('upload to cloudinary failed',result.error);
          res.status(500).send(JSON.stringify(result.error));
          return;
        }
        console.log('cloudinary result: ', result)
        var resizedImgUrl = result.eager[0].url;
        // console.log(data);
        // sampleBase64Content : data,
        var formData = {
          modelId: process.env.METAMIND_MODELID || 'GeneralImageClassifier',
          sampleLocation : resizedImgUrl
        }
        var options = {
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
        request.post(options, function optionalCallback(err, httpResponse, body) {
          if (err) {
            console.error('upload to metamind failed:', err);
            res.status(err.statusCode).send(err);
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
      },{
        //cloudinary options for image resizing on first req
        eager: {
          width: 500, 
          crop: "limit"
        }
      }
    );
  });
    return;
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


