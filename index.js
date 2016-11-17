const server                = require('./lib/server');
const fileUpload            = require('./lib/file-upload');
const updateToken           = require('./lib/update-token');
const cloudinaryResizeImage = require('./lib/cloudinary-resize-image');
const readFile              = require('./lib/read-file');
const oAuthToken            = require('./lib/oauth-token');
const queryMetamind         = require('./lib/query-metamind');
const sendImageToMetamind   = require('./lib/send-image-to-metamind');

module.exports = {
  server,
  fileUpload,
  updateToken,
  cloudinaryResizeImage,
  readFile,
  oAuthToken,
  queryMetamind,
  sendImageToMetamind
}
