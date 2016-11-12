var oauthToken = null;

function setToken(token) {
  oauthToken=token;
}

module.exports = {
  value:oauthToken,
  set:setToken
}