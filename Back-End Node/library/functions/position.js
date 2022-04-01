const con = require('../connection')
const stgs = require('../settings')

const tblUser = stgs.tableModules.user;
const vPos = stgs.viewModules.positionunited;

function fGET(req, res) {
  let qu = req.query;
  var token = req.get('Token');
  var userdata = stgs.authTokens[token];

  var filterstrings = ['username'];
  var regex = new RegExp( filterstrings.join( "|" ), "i");

  if (qu.hasOwnProperty('conditions')) {
    if (regex.test(qu.conditions)) { return res.status(406).json({"Success": false, "Error": "You cannot include username in conditions."})}
    if (qu.conditions.length > 0) {
      qu.conditions += " AND username = '" + userdata.username + "'";
    }
    else {
      qu.conditions = "username = '" + userdata.username + "'";
    }
  }
  else {
    qu.conditions = "username = '" + userdata.username + "'";
  }

  var sql = vPos.CSelectAll(qu);

  con.pool.query(sql, (error, results) => {
    if (error) { return res.status(400).json({"Success": false, "Error": error}); }
    res.status(200).json({
      "Success": true,
      "RowCount": results.rowCount,
      "Data": results.rows
    })
  })


}

function fDELETE(req, res) {


}


const functionModule = {
  "url": "position",
  "name": "position",
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
      "params": ["username*", "password*"],
      "returns": ["username", "permLevel", "token"]
    },
    "DELETE": {
      "info": "Dispose a token from server.",
      "params": ["token*"],
      "returns": ["info"]
    }
  }
}

module.exports = {
  functionModule
};