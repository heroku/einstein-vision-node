const pify = require('pify');
const fs   = require('fs');

function readFile(filePath){
  return pify(fs.readFile)(filePath,'base64').then(data => data);
}

module.exports = readFile;