var express     = require('express');
var fs          = require('fs');
var multipart   = require('connect-multiparty');
var fs          = require('fs');
var https       = require('https');
var request     = require('request');
var querystring = require('querystring');

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
      modelId: 'GeneralImageClassifier',
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
      console.log('Upload successful!  Server responded with:', body);
    });
    // console.log(data);
    // 'sampleBase64Content' : data,
    // 'sampleLocation' : 'https://upload.wikimedia.org/wikipedia/commons/4/4f/Matterhorn_Riffelsee_2005-06-11.jpg',
    /*
    var post_data = querystring.stringify({
      'sampleBase64Content' : data,
      'modelId': 'GeneralImageClassifier'
    });

    var options = {
        hostname: 'api.metamind.io',
        path: '/v1/vision/predict',
        port: 443,
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + process.env.METAMIND_TOKEN,
          'Content-Type': 'multipart/form-data',
          'Content-Length': Buffer.byteLength(post_data),
          'Cache-Control': 'no-cache'
        }
    };

    var req = https.request(options, function(res) {
        console.log("statusCode: ", res.statusCode);
        console.log("headers: ", res.headers);

        res.on('data', function(d) {
            console.log('Response: ' + d);
        });
    });

    req.write(post_data);
    console.log('new image uploaded! Sending to metamind...',req);
    req.end();
    */

  });
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


