const test = require('ava');
const cloudinaryResizeImage = require('./cloudinary-resize-image');


const redPng = 'iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAAnElEQVR42u3RAQ0AAAgDoJvc6FrDOahATdLhjBIiBCFCECIEIUIQIkSIEIQIQYgQhAhBiBCEIEQIQoQgRAhChCAEIUIQIgQhQhAiBCEIEYIQIQgRghAhCEGIEIQIQYgQhAhBCEKEIEQIQoQgRAhCECIEIUIQIgQhQhCCECEIEYIQIQgRghCECEGIEIQIQYgQhAgRIgQhQhAiBCHfLcjClZ2EzWBMAAAAAElFTkSuQmCC';

test('no Cloudinary API key ', t=> {
  t.plan(1)

  return cloudinaryResizeImage('png',redPng,500)
  .then(results => {
    t.fail('should not succeed without API key')
  })
  .catch(error => {
    t.truthy(error.message.match(/Must supply api_key/))
  });

});