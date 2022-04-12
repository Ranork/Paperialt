const stgs = require('../settings')

module.exports = {
  logRequest,
}

function logRequest(req, res, next) {
  var date = (new Date()).stringer();

  var username = "";
  if (stgs.authTokens[req.get('Token')] !== undefined) {
    username = stgs.authTokens[req.get('Token')]['username'];
  }

  console.info("[" + date + "] [" + username + "] " + req.method + " " + req.originalUrl);

  return true;
}


Date.prototype.stringer = function() {
  var mm = this.getMonth() + 1; // getMonth() is zero-based
  var dd = this.getDate();

  var h = this.getHours();
  var m = this.getMinutes();
  var s = this.getSeconds();

  return [
          this.getFullYear(),
          (mm>9 ? '' : '0') + mm,
          (dd>9 ? '' : '0') + dd
         ].join('-') + " " +
         [
          (h>9 ? '' : '0') + h,
          (m>9 ? '' : '0') + m,
          (s>9 ? '' : '0') + s
         ].join(':');
};

Date.prototype.stringer2 = function() {
  var mm = this.getMonth() + 1; // getMonth() is zero-based
  var dd = this.getDate();

  var h = this.getHours();
  var m = this.getMinutes();
  var s = this.getSeconds();

  return [
          this.getFullYear(),
          (mm>9 ? '' : '0') + mm,
          (dd>9 ? '' : '0') + dd
         ].join('-') + " ";
};