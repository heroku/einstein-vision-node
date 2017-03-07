const pify = require('pify');
const sizeOf = require('image-size');

function fileDimensions(filePath){
  return pify(sizeOf)(filePath);
}

module.exports = fileDimensions;