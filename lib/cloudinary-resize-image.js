const cloudinary  = require('cloudinary');

function cloudinaryResizeImage(fileExt,data,fileInfo){
  let eagerOptions = null;
  if(fileInfo.size > 1000000) {
    eagerOptions = {
      eager: {
        width: 580, 
        length: 580, 
        crop: "limit"
      }
    }
  }

  return new Promise(function (resolve,reject) {
    try {
      cloudinary.uploader.upload(
        'data:image/'+fileExt+';base64,'+data, 
        function(result){
          try{
            if(result.error) {
              console.error('upload to cloudinary failed',result.error);
              reject(new Error(result.error));
            }else {
              if(eagerOptions == null && result.url) {
                resolve(result.url);
              }else if (result
                    && result.eager 
                    && result.eager[0]
                    && result.eager[0].url) {
                resolve(result.eager[0].url);
              } else {
                reject(new Error('Cloudinary response was missing data.'));
              }
            }
          }catch(err){
            reject(err);
          }
        },
        eagerOptions
      );
    }catch(err){
      reject(err);
    }
  });
}

module.exports = cloudinaryResizeImage;