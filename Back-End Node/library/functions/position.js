const con = require('../connection')
const stgs = require('../settings')
const ordcont = require('../internal/order_controller')

const tblUser = stgs.tableModules.user;
const tblPos = stgs.tableModules.position;

const vPos = stgs.viewModules.positionunited;
const vWallet = stgs.viewModules.walletunited;

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


function fPOST(req, res) {
  const body = req.body;
  var token = req.get('Token');
  var userdata = stgs.authTokens[token];

  var reqfields = [
    "walletid", "type", "market", "symbol"
  ];

  for (var ri in reqfields) {
    var rfield = reqfields[ri];
    if (!body.hasOwnProperty(rfield)) { return res.status(400).json({"Success": false, "Error": rfield + " not found in body."}); }
  }

  const walid = body.walletid;

  var waldata = vWallet.SQSelectOne(walid);

  if (waldata.username !== userdata.username) { return res.status(400).json({"Success": false, "Error": "Wallet not found in your account."}); }

  const userallpos = vPos.SQSelectAll({"conditions": "username = '" + userdata.username + "' AND active = true"});

  if (userallpos.length >= userdata.maxposition) { return res.status(400).json({"Success": false, "Error": "Account has reached to the maximum position count."}); }
  
  
  body['createdate'] = (new Date()).stringer();
  body['totalstock'] = 0;
  body['totalusd'] = 0;

  con.pool.query(tblPos.CInsert(body), (error, results) => {
    if (error) { return res.status(500).json({"Success": false, "Error": error}) }
    
    var newpos = vPos.SQSelectAll({
      "conditions": "walletid = "+ walid +" and type = '"+ body.type +"' and symbol = '"+ body.symbol +"'",
      "order": "createdate DESC",
      "limit": 1
    })[0]

    return res.status(200).json({
      "Success": true,
      "Position": newpos
    })

  });


}


function fDELETE(req, res) {
  const body = req.body;
  var token = req.get('Token');
  var userdata = stgs.authTokens[token];

  if (!body.hasOwnProperty('id')) { return res.status(500).json({ "Success": false, "Error": "id not found in body." }); }

  var posdata = vPos.SQSelectOne(body.id);

  if (Object.keys(posdata).length === 0) { return res.status(500).json({ "Success": false, "Error": "position not found in system." }); }
  if (posdata.username !== userdata.username) { return res.status(500).json({ "Success": false, "Error": "position is not yours." }); }

  ordcont.deactivatePosition(body.id, 0);

  return res.status(200).json({"Success": true});
}


const functionModule = {
  "url": "position",
  "name": "position",
  "functions": {
    "GET": {
      "function": fGET,
      "permLevel": 0
    },
    "POST": {
      "function": fPOST,
      "permLevel": 0
    },
    "DELETE": {
      "function": fDELETE,
      "permLevel": 0
    }
  },
  "help": {
    "GET": {
      "info": "Get your positions.",
      "params": ["conditions", "columns", "order", "limit", "offset"],
      "returns": ["Data", "RowCount"]
    },
    "POST": {
      "info": "Create new position.",
      "params": ["*walletid", "*type: LONG, SHORT", "*market: NASDAQ, BINANCE", "*symbol", "isprivate", "explanation"],
      "returns": ["Data", "RowCount"]
    },
    "DELETE": {
      "info": "Deactivate a position.",
      "params": ["*id"],
      "returns": ["info"]
    }
  }
}

module.exports = {
  functionModule
};