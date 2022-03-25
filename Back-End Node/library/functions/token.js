const tbl_def = require('../table/definitions')
const hsh = require('../hash')
const con = require('../connection')
const stgs = require('../settings')
const fun_cnstr = require('./constructor')

function createToken(username, permLevel) {

  for (var n in stgs.authTokens) {
    if (stgs.authTokens[n]['username'] === username) {
      delete stgs.authTokens[n];
    }
  }

  var token = 'PaperialToken_' + hsh.randStr(50);

  stgs.authTokens[token] = {
    "token": token,
    "username": username,
    "permLevel": permLevel
  }

  return token;
}


function fGET(req, res) {
  var qu = req.query;

  var err = "";
  if (!qu.hasOwnProperty('username')) {err = "username not found in parameters.";}
  else if (!qu.hasOwnProperty('password')) {err = "password not found in parameters.";}
  if (err !== "") { return res.status(406).json({"Success": false, "Error": err}); }

  var username = qu['username'];
  var password = qu['password'];
  var tblUser = stgs.tableModules['user'];

  sql = tblUser.CSelectOne(username, "password, permlevel");
  con.pool.query(sql, (error, results) => {
    if (error) { return false; }

    passfromdb = results.rows[0]['password'];
    if (!password.hashEqual(passfromdb)) {
      return res.status(406).json({"Success": false, "Error": "password not match with user"});
    }

    var permLevel = results.rows[0]['permlevel'];

    return res.status(200).json({
      "Success": true,
      "username": username,
      "permLevel": permLevel,
      "token": createToken(username, permLevel)
    });

  })

}

function fDELETE(req, res) {
  var qu = req.query;

  var err = "";
  if (!qu.hasOwnProperty('token')) {err = "token not found in parameters.";}
  if (err !== "") { return res.status(406).json({"Success": false, "Error": err}); }

  var token = qu['token'];

  if (!stgs.authTokens.hasOwnProperty(token)) {
    return res.status(200).json({"Success": false, "info": "Token not found in system."});
  }
  else {
    delete stgs.authTokens[token];
    return res.status(200).json({"Success": true, "info": "Token has been removed from system."});
  }

}


const functionModule = {
  "url": "token",
  "name": "token",
  "permLevel": 0,
  "functions": {
    "GET": {
      "function": fGET,
      "permLevel": -1
    },
    "DELETE": {
      "function": fDELETE,
      "permLevel": -1
    }
  },
  "help": {
    "GET": {
      "info": "Get a new token with username and password.",
      "params": ["username", "password"],
      "returns": ["username", "permLevel", "token"]
    },
    "DELETE": {
      "info": "Dispose a token from server.",
      "params": ["token"],
      "returns": ["info"]
    }
  }
}

module.exports = {
  functionModule
}