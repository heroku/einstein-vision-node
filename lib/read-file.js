const fsp      = require('fs-promise');

function readFile(filePath){
  return fsp.readFile(filePath,'base64').then(data => data);
}

module.exports = readFile;