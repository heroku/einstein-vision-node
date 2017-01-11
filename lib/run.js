const createServer = require('./server');
const oAuthToken   = require('./oauth-token');
const updateToken  = require('./update-token');
const server = createServer();


const PORT = process.env.PORT || 5000;
const pvsUrl = process.env.PREDICTIVE_SERVICES_URL;
const accountId  = process.env.PREDICTIVE_SERVICES_ACCOUNT_ID;
const privateKey = process.env.PREDICTIVE_SERVICES_PRIVATE_KEY;

updateToken(pvsUrl,accountId,privateKey)
.then(() => {
  server.listen(PORT, function() {
    console.log('Image Identifier is running on port', PORT);
  });
})
.catch(error => {
  console.log(`Failed to start server: ${error.stack}`);
  process.exit(1);
});

