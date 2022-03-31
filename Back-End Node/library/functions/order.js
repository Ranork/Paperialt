const con = require('../connection')
const stgs = require('../settings')

const tblUser = stgs.tableModules.user;
const tblOrder = stgs.tableModules.order;
const tblWallet = stgs.tableModules.wallet;
const vOrder = stgs.viewModules.orderunited;

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

  // control all amount decreaser orders if this order chan change the position amount to subzero then block request

  var reqfields = [
    "wallet", "position", "type", "symbol", "targetprice", "amount", "bs"
  ];

  for (var ri in reqfields) {
    var rfield = reqfields[ri];
    if (!body.hasOwnProperty(rfield)) { return res.status(400).json({"Success": false, "Error": rfield + " not found in body."}); }
  }

  const wlid = body.wallet;

  sql = tblWallet.CSelectAll({"conditions": "id = '" + wlid + "'"})

  con.pool.query(sql, (error, results) => {
    if (error) { return res.status(500).json({"Success": false, "Error": error}) }

    if (results.rowCount <= 0) { return res.status(500).json({"Success": false, "Error": "Wallet not found in the system."}); }

    const wldata = results.rows[0];
    const wluser = wldata['username'];

    if (userdata.username !== wluser) {
      return res.status(500).json({"Success": false, "Error": "Wallet is not yours."})
    }

    body['startdate'] = (new Date()).stringer();

    con.pool.query(tblOrder.CInsert(body), (error, results) => {
      if (error) { return res.status(500).json({"Success": false, "Error": error}) }

      // Add internal chasing for order

      return res.status(200).json({"Success": true})

    });

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
      "params": ["*wallet", "*position", "*type: LIMIT, MARKET, TAKEPROFIT, STOPLOSS", "*symbol", "*targetprice", "*amount", "explanation", "*bs: BUY, SELL"],
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