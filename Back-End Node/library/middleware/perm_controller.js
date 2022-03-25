const stgs = require('../settings')

module.exports = {
  controller,
}

function controller(req, res) {
  var url = req.originalUrl;

  var type = "table";
  if (url.includes("/function/")) {type = "function";}

  url = url.replace("/" + type + "/", "");
  if (url.includes("?")) {
    url = url.substring(0, url.indexOf("?"))
  }

  var reqPerm = -1;

  if (type == "function") {
    for (var fi in stgs.functions) {
      var f = stgs.functions[fi];

      if (f['url'] === url) {
        reqPerm = f['functions'][req.method]['permLevel'];

      }
    }
  }

  else if (type == "table") {
    var tbl = stgs.tableModules[url];
    reqPerm = tbl['perms'][req.method];

  }

  if (reqPerm < 0) { return true; }

  var token = stgs.authTokens[req.get('Token')];

  if (token === undefined) { res.status(401).json({"Success": false, "Error": "Token not found in system!"}); return false; }

  if (token['permLevel'] < reqPerm) {
    res.status(401).json({
      "Success": false,
      "Error": "Permission denied for this request!",
      "RequiredPermissionLevel": reqPerm,
      "UserPermissionLevel": token['permLevel']
    });
    return false;
  }

  return true;
}
