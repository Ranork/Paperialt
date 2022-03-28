const con = require('../connection')
const stgs = require('../settings')

const tblUser = stgs.tableModules.user;
const tblOrder = stgs.tableModules.order;
const vOrder = stgs.viewModules.orderunited;

function fGET(req, res) {
  let qu = req.query;
  var token = req.get('Token');
  var userdata = stgs.authTokens[token];

  if (qu.hasOwnProperty('conditions')) {
    if (qu.conditions.includes('username')) { res.status(406).json({"Success": false, "Error": "You cannot include username in conditions."})}
    qu.conditions += " AND username = '" + userdata.username + "'";
  }
  else {
    qu.conditions = "username = '" + userdata.username + "'";
  }

  var sql = vOrder.CSelectAll(qu);

  con.pool.query(sql, (error, results) => {
    if (error) { res.status(400).json({"Success": false, "Error": error}); }
    res.status(200).json({
      "Success": true,
      "RowCount": results.rowCount,
      "Data": results.rows
    })
  })

}

function fPOST(req, res) {
  const body = req.body;


}


const functionModule = {
  "url": "order",
  "name": "order",
  "functions": {
    "GET": {
      "function": fGET,
      "permLevel": 0
    },
    "POST": {
      "function": fPOST,
      "permLevel": -1
    }
  },
  "help": {
    "GET": {
      "info": "Get a new token with username and password.",
      "params": ["conditions", "columns", "order", "limit", "offset"],
      "returns": ["Data", "RowCount"]
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