const con = require('../connection')
const stgs = require('../settings')

const tblUser = stgs.tableModules.user;
const tblOrder = stgs.tableModules.order;
const tblWallet = stgs.tableModules.wallet;
const tblPos = stgs.tableModules.position;

const vOrder = stgs.viewModules.orderunited;
const vWallet = stgs.viewModules.walletunited;
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

  var sql = vOrder.CSelectAll(qu);

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
    "position", "type", "symbol", "targetprice", "amount", "bs"
  ];

  for (var ri in reqfields) {
    var rfield = reqfields[ri];
    if (!body.hasOwnProperty(rfield)) { return res.status(400).json({"Success": false, "Error": rfield + " not found in body."}); }
  }

  var pos = vPos.SQSelectOne(body.position);

  if (Object.keys(pos).length <= 0) { return res.status(500).json({"Success": false, "Error": "Position not found!"}) }
  if (pos.username !== userdata.username) { return res.status(500).json({"Success": false, "Error": "Position is not yours."}); }

  var wldata = vWallet.SQSelectOne(pos.walletid);

  if ((pos.type == 'SHORT' && body.bs == 'SELL') || (pos.type == 'LONG' && body.bs == 'BUY')) {
    if (wldata['availablebalance'] < (body.targetprice * body.amount)) {
      return res.status(500).json({"Success": false, "Error": "Wallet available balance is not enough."})
    }
  }
  else {
    if (pos.totalstock < body.amount) {
      return res.status(500).json({"Success": false, "Error": "Position amount is not enough."})
    }
  }

  body['wallet'] = pos.walletid;
  body['symbol'] = pos.symbol;
  body['startdate'] = (new Date()).stringer();

  con.pool.query(tblOrder.CInsert(body), (error, results) => {
    if (error) { return res.status(500).json({"Success": false, "Error": error}) }

    return res.status(200).json({"Success": true})

  });

}

function fDELETE(req, res) {
  const body = req.body;
  var token = req.get('Token');
  var userdata = stgs.authTokens[token];

  if (!body.hasOwnProperty('id')) { return res.status(500).json({ "Success": false, "Error": "id not found in body." }); }

  const orid = body.id;

  const conds = "username = '" + userdata.username + "' AND id = " + orid;
  var sql = vOrder.CSelectAll({"conditions": conds});

  con.pool.query(sql, (error, results) => {
    if (error) { return res.status(500).json({ "Success": false, "Error": error }) }
    if (results.rowCount <= 0) { return res.status(500).json({ "Success": false, "Error": "order not found in system." }); }

    var sql2 = tblOrder.CUpdate({ "conditions": "id = '" + orid + "'", "values": { "active": "false" } });
    con.pool.query(sql2, (error, results) => {
      if (error) { return res.status(500).json({ "Success": false, "Error": error }) }

      // Remove order controllers

      return res.status(200).json({ "Success": true });
    });

  });

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
      "permLevel": 0
    },
    "DELETE": {
      "function": fDELETE,
      "permLevel": 0
    }
  },
  "help": {
    "GET": {
      "info": "Get your orders",
      "params": ["conditions", "columns", "order", "limit", "offset"],
      "returns": ["Data", "RowCount"]
    },
    "POST": {
      "info": "Create a new order",
      "params": ["*position", "*type: LIMIT, MARKET, TAKEPROFIT, STOPLOSS", "*targetprice", "*amount", "explanation", "*bs: BUY, SELL"],
      "returns": ["info"]
    },
    "DELETE": {
      "info": "Deactivate an order by id",
      "params": ["*id"],
      "returns": ["info"]
    }
  }
}

module.exports = {
  functionModule
};