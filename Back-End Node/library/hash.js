const cryp = require('crypto');
const stgs = require('./settings')

function hash(str) {
  return cryp.createHash('md5').update(str + stgs.securityKey).digest('hex');
}

function hashControl(hashed, str) {
  return (hash(str) === hashed);
}

function randStr(length) {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}


String.prototype.hashStr = function() {
  return hash(this);
}

String.prototype.hashEqual = function(str) {
  return hashControl(str, this);
}

module.exports = {
  hash,
  hashControl,
  randStr
}