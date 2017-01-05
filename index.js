const server                = require('./lib/server');
const fileUpload            = require('./lib/file-upload');
const updateToken           = require('./lib/update-token');
const cloudinaryResizeImage = require('./lib/cloudinary-resize-image');
const readFile              = require('./lib/read-file');
const analyzeFile           = require('./lib/analyze-file');
const oAuthToken            = require('./lib/oauth-token');
const queryVisionApi         = require('./lib/query-vision-api');
const sendImageToVisionApi   = require('./lib/send-image-to-vision-api');

module.exports = {
  server,
  fileUpload,
  analyzeFile,
  updateToken,
  cloudinaryResizeImage,
  readFile,
  oAuthToken,
  queryVisionApi,
  sendImageToVisionApi
}
