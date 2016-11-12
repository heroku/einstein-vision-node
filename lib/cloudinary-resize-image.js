const cloudinary  = require('cloudinary');

function cloudinaryResizeImage(fileExt,data,width){
  return new Promise(function (resolve,reject) {
    try {
      cloudinary.uploader.upload(
        'data:image/'+fileExt+';base64,'+data, 
        function(result){
          try{
            if(result.error) {
              console.error('upload to cloudinary failed',result.error);
              reject(result.error);
            }else {
              resolve(result);
            }
          }catch(err){
            reject(err);
          }
        },
        {
          eager: {
            width: 500, 
            crop: "limit"
          }
        }
      );
    }catch(err){
      reject(err);
    }
  });
}

module.exports = cloudinaryResizeImage;