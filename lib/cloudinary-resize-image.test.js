const test = require('ava');
const cloudinaryResizeImage = require('./cloudinary-resize-image');


const redPng = 'iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAAnElEQVR42u3RAQ0AAAgDoJvc6FrDOahATdLhjBIiBCFCECIEIUIQIkSIEIQIQYgQhAhBiBCEIEQIQoQgRAhChCAEIUIQIgQhQhAiBCEIEYIQIQgRghAhCEGIEIQIQYgQhAhBCEKEIEQIQoQgRAhCECIEIUIQIgQhQhCCECEIEYIQIQgRghCECEGIEIQIQYgQhAgRIgQhQhAiBCHfLcjClZ2EzWBMAAAAAElFTkSuQmCC';


process.env.CLOUDINARY_URL = 'cloudinary://217294312372193:kuqy9xTQ5cmO4TRRNVuZi0VrczU@hw6a7yvxu';

const cloudinary  = require('cloudinary');

test('no cloudinary api key ', t=> {

  return cloudinaryResizeImage('png',redPng,500).then(result=>{
    //console.log(result);


  });

});