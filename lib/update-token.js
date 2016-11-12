const jwt     = require('jsonwebtoken');
const request = require('request');

function updateToken(request, response, next) {
  
  let rsa_payload = {
    "iss":process.env.METAMIND_ACCOUNT_ID,
    "sub":process.env.METAMIND_ACCOUNT_ID,
    "aud":"https://api.metamind.io/v1/oauth2/token"
  }

  let rsa_options = {
    header:{
      "alg":"RS256",
      "typ":"JWT"
     },
     expiresIn: '25h'
  }

  let token = jwt.sign( 
    rsa_payload,
    process.env.METAMIND_PRIVATE_KEY,
    rsa_options
  );

  let options = {
    url: 'https://api.metamind.io/v1/oauth2/token',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body:`grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${token}`
  }
  request.post(options, function (error, response, body) {
    if (error) {
      return console.error(' failed:', error);
    }
    console.log(' successful!  Server responded with:', body);
  });
}

module.exports = updateToken;