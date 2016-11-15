const jwt     = require('jsonwebtoken');
const request = require('request');
const rp      = require('request-promise');
const oAuthToken = require('./oauth-token');

function updateToken(metamindAccountId,metamindPrivateKey) {
  
  var rsa_payload = {
    "iss":metamindAccountId,
    "sub":metamindAccountId,
    "aud":"https://api.metamind.io/v1/oauth2/token"
  }

  var rsa_options = {
    header:{
      "alg":"RS256",
      "typ":"JWT"
     },
     expiresIn: '25h'
  }

  var token = jwt.sign( 
    rsa_payload,
    metamindPrivateKey,
    rsa_options
  );

  var options = {
    url: 'https://api.metamind.io/v1/oauth2/token',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'accept': 'application/json'
    },
    body:`grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${token}`
  }
  return rp.post(options).then((body)=> {
    var data = JSON.parse(body);
    oAuthToken.set(data.access_token);
    return data.access_token;
  });
}

module.exports = updateToken;