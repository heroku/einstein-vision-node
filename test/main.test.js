const test          = require('ava');
const fileUpload    = require('../lib/file-upload');
const oAuthToken    = require('../lib/oauth-token');
const queryVisionApi = require('../lib/query-vision-api');
const readFile      = require('../lib/read-file');
const analyzeFile   = require('../lib/analyze-file');
const server        = require('../lib/server');
const updateToken   = require('../lib/update-token');
const cloudinaryResizeImage   = require('../lib/cloudinary-resize-image');
const sendImageToVisionApi   = require('../lib/send-image-to-vision-api');

const mainModule    = require('../');

test('Exports `cloudinaryResizeImage`', t => {
  t.is(mainModule.cloudinaryResizeImage, cloudinaryResizeImage);
});

test('Exports `fileUpload`', t => {
  t.is(mainModule.fileUpload, fileUpload);
});

test('Exports `oAuthToken`', t => {
  t.is(mainModule.oAuthToken, oAuthToken);
});

test('Exports `queryVisionApi`', t => {
  t.is(mainModule.queryVisionApi, queryVisionApi);
});

test('Exports `readFile`', t => {
  t.is(mainModule.readFile, readFile);
});

test('Exports `analyzeFile`', t => {
  t.is(mainModule.analyzeFile, analyzeFile);
});

test('Exports `server`', t => {
  t.is(mainModule.server, server);
});

test('Exports `updateToken`', t => {
  t.is(mainModule.updateToken, updateToken);
});

test('Exports `sendImageToVisionApi`', t => {
  t.is(mainModule.sendImageToVisionApi, sendImageToVisionApi);
});