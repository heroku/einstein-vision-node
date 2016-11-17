const createServer = require('./server');
const oAuthToken   = require('./oauth-token');
const updateToken  = require('./update-token');
const server = createServer();


const PORT = process.env.PORT || 5000;


const metamindAccountId  = process.env.METAMIND_ACCOUNT_ID;
const metamindPrivateKey = process.env.METAMIND_PRIVATE_KEY;

if(metamindAccountId == null) {
  throw new Error("METAMIND_ACCOUNT_ID enviornment variable is Required");
}
if(metamindPrivateKey == null) {
  throw new Error("METAMIND_PRIVATE_KEY enviornment variable is Required");
}

updateToken(metamindAccountId,metamindPrivateKey).then(()=>{
  server.listen(PORT, function() {
    console.log('Image Identifier is running on port', PORT);
  });
});

