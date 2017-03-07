var math = require('mathjs');

const maxSize = 5000000;

function shouldResizeImage(imgSize,imgWidth,imgHeight){
  if(imgSize > maxSize) {
    var newArea   = (imgHeight * imgWidth * maxSize) / imgSize;
    var newWidth  = math.floor(math.sqrt((imgWidth * newArea)/imgHeight));
    var newHeight = math.floor(newArea / newWidth);
    return {width:newWidth,height:newHeight}
  } else {
    return;
  }
}

module.exports = shouldResizeImage;