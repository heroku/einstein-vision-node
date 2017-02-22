const Episode7     = require('episode-7');
const createServer = require('./server');
const oAuthToken   = require('./oauth-token');
const updateToken  = require('./update-token');
const server = createServer();


const PORT = process.env.PORT || 5000;
const pvsUrl = process.env.EINSTEIN_VISION_URL;
const accountId  = process.env.EINSTEIN_VISION_ACCOUNT_ID;
const privateKey = process.env.EINSTEIN_VISION_PRIVATE_KEY;

Episode7.run(updateToken, pvsUrl, accountId, privateKey)
.then(() => {
  server.listen(PORT, function() {
    console.log('Image Identifier is running on port', PORT);
  });
})
.catch(error => {
  console.log(`Failed to start server: ${error.stack}`);
  process.exit(1);
});

