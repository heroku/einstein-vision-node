const createServer = require('./server');
const oAuthToken   = require('./oauth-token');
const updateToken  = require('./update-token');
const server = createServer();


const PORT = process.env.PORT || 5000;


const accountId  = process.env.PREDICTIVE_SERVICES_ACCOUNT_ID;
const privateKey = process.env.PREDICTIVE_SERVICES_PRIVATE_KEY;

if(accountId == null) {
  throw new Error("PREDICTIVE_SERVICES_ACCOUNT_ID enviornment variable is Required");
}
if(privateKey == null) {
  throw new Error("PREDICTIVE_SERVICES_PRIVATE_KEY enviornment variable is Required");
}

updateToken(accountId,privateKey).then(()=>{
  server.listen(PORT, function() {
    console.log('Image Identifier is running on port', PORT);
  });
});

