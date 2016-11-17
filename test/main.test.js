const test          = require('ava');
const cloudinaryResizeImage   = require('../lib/cloudinary-resize-image');
const fileUpload    = require('../lib/file-upload');
const oAuthToken    = require('../lib/oauth-token');
const queryMetamind = require('../lib/query-metamind');
const readFile      = require('../lib/read-file');
const server        = require('../lib/server');
const updateToken   = require('../lib/update-token');
const sendImageToMetamind   = require('../lib/send-image-to-metamind');
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

test('Exports `queryMetamind`', t => {
  t.is(mainModule.queryMetamind, queryMetamind);
});

test('Exports `readFile`', t => {
  t.is(mainModule.readFile, readFile);
});

test('Exports `server`', t => {
  t.is(mainModule.server, server);
});

test('Exports `updateToken`', t => {
  t.is(mainModule.updateToken, updateToken);
});

test('Exports `sendImageToMetamind`', t => {
  t.is(mainModule.sendImageToMetamind, sendImageToMetamind);
});