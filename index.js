const server                = require('./lib/server');
const fileUpload            = require('./lib/file-upload');
const updateToken           = require('./lib/update-token');
const cloudinaryResizeImage = require('./lib/cloudinary-resize-image');

module.exports = {
  server,
  fileUpload,
  updateToken,
  cloudinaryResizeImage
}
