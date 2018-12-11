const cloudinary  = require('cloudinary');
const shouldResizeImage = require('./should-resize-image');

function cloudinaryResizeImage(fileExt,data,fileSize,imgWidth,imgHeight){
  let eagerOptions = null;
  const newDimensions = shouldResizeImage(fileSize,imgWidth,imgHeight);
  if(newDimensions != null) {
    eagerOptions = {
      eager: {
        width: newDimensions.width, 
        length: newDimensions.height, 
        crop: "limit"
      }
    }
  }
  
  return new Promise(function (resolve,reject) {
    try {
      cloudinary.v2.uploader.upload(
        'data:image/'+fileExt+';base64,'+data,
        eagerOptions ? eagerOptions : {}, 
        function(error, result){
          try{
            if(error) {
              console.error('upload to cloudinary failed',error);
              reject(new Error(error));
            } else {
              if (eagerOptions == null && result.url) {
                resolve(result.url);
              } else if (result
                    && result.eager 
                    && result.eager[0]
                    && result.eager[0].status === 'failed') {
                reject(new Error(`Cloudinary image processing failed: ${result.eager[0].reason}`));
              } else if (result
                    && result.eager 
                    && result.eager[0]
                    && result.eager[0].url) {
                resolve(result.eager[0].url);
              } else {
                reject(new Error(`Cloudinary response was unexpected: ${JSON.stringify(result)}`));
              }
            }
          } catch(err) {
            err instanceof Error
              ? reject(err)
              : reject(new Error(err));
          }
        }
      );
    } catch(err) {
      err instanceof Error
        ? reject(err)
        : reject(new Error(err));
    }
  });
}

module.exports = cloudinaryResizeImage;