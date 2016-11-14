const express     = require('express');
const multipart   = require('connect-multiparty');
const fileUpload  = require('./file-upload');
const updateToken = require('./update-token');


function createServer() {
  const app                 = express();
  const multipartMiddleware = multipart();

  app.use(express.static(__dirname + '/../public'));

  app.set('views', __dirname + '/../views');
  app.set('view engine', 'ejs');

  app.get('/', function(request, response) {
    response.render('pages/index');
  });

  app.post('/file-upload', multipartMiddleware, fileUpload);

  return app;
}

module.exports = createServer;