const express     = require('express');
const multipart   = require('connect-multiparty');
const fileUpload  = require('./file-upload');
const updateToken = require('./update-token');


function createServer() {
  const app                 = express();
  const multipartMiddleware = multipart();

  app.use(express.static(__dirname + '/../react-ui/build'));

  app.post('/file-upload', multipartMiddleware, fileUpload);

  app.use(logErrors);
  app.use(clientErrorHandler);
  app.use(errorHandler);

  return app;
}

module.exports = createServer;


function logErrors(err, req, res, next) {
  console.error(req.id, err.stack);
  next(err);
}

function clientErrorHandler(err, req, res, next) {
  var isJSON = req.headers['content-type'] === 'application/json';
  if (isJSON) {
    res.status(500);
    res.send({ error: err.message });
  } else {
    next(err);
  }
}

function errorHandler(err, req, res, next) {
  res.status(500);
  res.send(err.message);
}