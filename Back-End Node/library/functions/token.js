const tbl_def = require('../table/definitions')
const hsh = require('../hash')
const con = require('../connection')
const fun_cnstr = require('./constructor')

let authTokens = {};

function createToken(username) {
  authTokens[username] = 'PaperialToken_' + hsh.randStr(50);
  return authTokens[username];
}


function fGET(req, res) {
  var qu = req.query;

  var err = "";
  if (!qu.hasOwnProperty('username')) {err = "username not found in parameters.";}
  else if (!qu.hasOwnProperty('password')) {err = "password not found in parameters.";}
  if (err !== "") { return res.status(406).json({"Success": false, "Error": err}); }

  var username = qu['username'];
  var password = qu['password'];
  var tblUser = tbl_def.tables['user'];

  sql = tblUser.CSelectOne(username, "password");
  con.pool.query(sql, (error, results) => {
    if (error) { return false; }

    passfromdb = results.rows[0]['password'];
    if (!password.hashEqual(passfromdb)) {
      return res.status(406).json({"Success": false, "Error": "password not match with user"});
    }

    return res.status(200).json({
      "Success": true,
      "username": username,
      "Token": createToken(username)
    });

  })

}

function fDELETE(req, res) {
  var qu = req.query;

  var err = "";
  if (!qu.hasOwnProperty('token')) {err = "token not found in parameters.";}
  if (err !== "") { return res.status(406).json({"Success": false, "Error": err}); }

  var token = qu['token'];
  var username = "";

  for (var usr in authTokens) {
    if (token === authTokens[usr]) {
      username = usr;
    }
  }

  if (username === "") {
    return res.status(200).json({"Success": false, "info": "Token not found in system."});
  }

  delete authTokens[username];
  return res.status(200).json({"Success": true, "info": "Toke has been removed from system."});

}


const functionModule = {
  "url": "token",
  "name": "token",
  "permLevel": 0,
  "functions": {
    "GET": fGET,
    "DELETE": fDELETE
  },
  "help": {
    "GET": {
      "info": "Get a new token with username and password.",
      "params": ["username", "password"],
      "returns": ["token"]
    },
    "DELETE": {
      "info": "Dispose a token from server.",
      "params": ["token"],
      "returns": []
    }
  }
}
module.exports = {
  functionModule
}