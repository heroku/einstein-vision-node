var oauthToken = null;

function setToken(token) {
  oauthToken=token;
}

function getToken() {
  return oauthToken;
}

module.exports = {
  get:getToken,
  set:setToken
}