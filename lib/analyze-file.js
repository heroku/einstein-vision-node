const pify = require('pify');
const fs   = require('fs');

function analyzeFile(filePath){
  return pify(fs.stat)(filePath).then(data => data);
}

module.exports = analyzeFile;