const stgs = require('../settings')
const con = require('../connection')

const tblwal = stgs.tableModules['wallet'];

function fPOST(req, res) {
  var token = req.get('Token');
  var userdata = stgs.authTokens[token];

  var body = req.body;

  var contQuery = {
    "conditions": "username = '" + userdata['username'] + "'",
    "columns": "COUNT(*)"
  }

  con.pool.query(tblwal.CSelectAll(contQuery), (error, results) => {
    if (error) { return res.status(500).json({"Success": false, "Error": error}) }

    const wlcount = results.rows[0]['count']

    if (userdata['maxwallet'] <= wlcount) {
      return res.status(406).json({"Success": false, "Error": "Account has reached to the maximum wallet count."});
    }

    const wlname = body['name'];
    const wlstbal = body['startbalance'];
    const wlpriv = body['isprivate'];

    const values = {
      "name": wlname,
      "username": userdata['username'],
      "startbalance": wlstbal,
      "currentbalance": wlstbal,
      "isprivate": wlpriv,
      "createdate": (new Date()).stringer()
    }

    console.log(values);

    con.pool.query(tblwal.CInsert(values), (error, results) => {
      if (error) { return res.status(500).json({"Success": false, "Error": error}) }

      var contQuery = {
        "conditions": "username = '" + userdata['username'] + "'",
        "order": "createdate DESC",
        "limit": 1
      }
      con.pool.query(tblwal.CSelectAll(contQuery), (error, results) => {
        if (error) { return res.status(500).json({"Success": false, "Error": error}) }

        return res.status(200).json({
          "Success": true,
          "Data": results.rows[0]
        })

      })

    });

  });

}

function fGET(req, res) {
  var token = req.get('Token');
  var userdata = stgs.authTokens[token];
  var qu = req.query;

  qu['conditions'] = "username = '" + userdata['username'] + "'";

  con.pool.query(tblwal.CSelectAll(qu), (error, results) => {
    if (error) { return res.status(500).json({"Success": false, "Error": error}) }

    delete qu['conditions'];

    return res.status(200).json({
      "Success": true,
      "RowCount": results.rowCount,
      "Query": qu,
      "Data": results.rows
    })

  });
}

function fDELETE(req, res) {
  var token = req.get('Token');
  var userdata = stgs.authTokens[token];
  var qu = req.body;

  if (qu['id'] === undefined) {
    return res.status(406).json({"Success": false, "Error": "id not found in body."});
  }

  var wlid = parseInt(qu['id']);

  var cond = "id = '" + wlid + "' AND username = '" + userdata['username'] + "'";

  con.pool.query(tblwal.CDelete({"conditions":cond}), (error, results) => {
    if (error) { return res.status(500).json({"Success": false, "Error": error}) }

    return res.status(200).json({
      "Success": true,
      "wallet_id": wlid
    })

  });

}

function fPUT(req, res) {
  var token = req.get('Token');
  var userdata = stgs.authTokens[token];

  var body = req.body;

  const wlid = body['id'];
  const wlname = body['name'];
  let wlstbal = body['startbalance'];
  const wlpriv = body['isprivate'];

  con.pool.query(tblwal.CSelectOne(wlid), (error, results) => {
    if (error) { return res.status(500).json({"Success": false, "Error": error}) }

    if (results.rowCount === 0) { return res.status(400).json({"Success": false, "Error": "Wallet not found in the system."}) }

    const wldata = results.rows[0];

    if (wldata['username'] !== userdata['username']) { return res.status(400).json({"Success": false, "Error": "Wallet owner is not you."}); }

    if (wlstbal === undefined) {wlstbal = wldata['startbalance']}

    var balRate = wldata['currentbalance'] / wldata['startbalance']
    var newCurrBal = wlstbal * balRate

    if (newCurrBal < 0) {
      return res.status(400).json({"Success": false, "Error": "Wallet current balance is cannot be lower than zero."});
    }

    var upQu = {
      "conditions": "id = '" + wlid + "'",
      "values": {
        "name": wlname,
        "startbalance": wlstbal,
        "currentbalance": newCurrBal,
        "isprivate": wlpriv
      }
    }

    con.pool.query(tblwal.CUpdate(upQu), (error, results) => {
      if (error) { return res.status(500).json({"Success": false, "Error": error}) }

      return res.status(200).json({
        "Success": true,
        "wallet_id": wlid,
        "Data": upQu['values']
      })

    });

  });

}

const functionModule = {
  "url": "wallet",
  "name": "wallet",
  "functions": {
    "GET": {
      "function": fGET,
      "permLevel": 0
    },
    "POST": {
      "function": fPOST,
      "permLevel": 0
    },
    "PUT": {
      "function": fPUT,
      "permLevel": 0
    },
    "DELETE": {
      "function": fDELETE,
      "permLevel": 0
    }
  },
  "help": {
    "GET": {
      "info": "Get your wallets",
      "params": ["order", "limit", "offset"],
      "returns": ["info"]
    },
    "POST": {
      "info": "Create a wallet",
      "params": ["name", "startbalance", "isprivate"],
      "returns": ["info"]
    },
    "PUT": {
      "info": "Update a wallet",
      "params": ["id*", "name", "startbalance", "isprivate"],
      "returns": ["info"]
    },
    "DELETE": {
      "info": "Remove a wallet from system",
      "params": ["id"],
      "returns": ["info"]
    }
  }
}

module.exports = {
  functionModule
}