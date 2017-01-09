const createServer = require('./server');
const oAuthToken   = require('./oauth-token');
const updateToken  = require('./update-token');
const server = createServer();


const PORT = process.env.PORT || 5000;


const accountId  = process.env.PREDICTIVE_SERVICES_ACCOUNT_ID;
const privateKey = process.env.PREDICTIVE_SERVICES_PRIVATE_KEY;

if(accountId == null) {
  throw new Error("PREDICTIVE_SERVICES_ACCOUNT_ID environment variable is required");
}
if(privateKey == null) {
  throw new Error("PREDICTIVE_SERVICES_PRIVATE_KEY environment variable is required");
}

updateToken(accountId,privateKey)
.then(() => {
  server.listen(PORT, function() {
    console.log('Image Identifier is running on port', PORT);
  });
})
.catch(error => {
  console.log(`Failed to start server: ${error.stack}`);
  process.exit(1);
});

