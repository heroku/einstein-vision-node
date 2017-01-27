const Episode7 = require('episode-7');
const jwt     = require('jsonwebtoken');
const rp      = require('request-promise');
const oAuthToken = require('./oauth-token');

function* updateToken(pvsUrl,accountId,privateKey) {

  let argumentError;
  if (pvsUrl == null) {
    argumentError = new Error('updateToken requires Predictive Vision Service base API URL (first arg)');
    return Promise.reject(argumentError);
  }
  if (accountId == null) {
    argumentError = new Error('updateToken requires Predictive Vision Service account ID (second arg)');
    return Promise.reject(argumentError);
  }
  if (privateKey == null) {
    argumentError = new Error('updateToken requires Predictive Vision Service private key (third arg)');
    return Promise.reject(argumentError);
  }

  var reqUrl = `${pvsUrl}v1/oauth2/token`;
  
  var rsa_payload = {
    "sub":accountId,
    "aud":reqUrl
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
    privateKey,
    rsa_options
  );

  var options = {
    url: reqUrl,
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'accept': 'application/json'
    },
    body:`grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${encodeURIComponent(token)}`
  }

  const response = yield Episode7.call(rp.post, options);
  const granted = JSON.parse(response);
  const accessToken = granted.access_token;
  oAuthToken.set(accessToken);
  return accessToken
}

module.exports = updateToken;