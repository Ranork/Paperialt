const yahooFinance = require('yahoo-finance');
const con = require('../connection')
const stgs = require('../settings')


function fGET(req, res) {
  let qu = req.query;
  var token = req.get('Token');
  var userdata = stgs.authTokens[token];

  if (!qu.hasOwnProperty('symbol')) {
    return res.status(500).json({"Success": false, "Error": "symbol parameter not found."})
  }

  if (!qu.hasOwnProperty('from')) {
    var today = new Date()
    today.setMonth((today.getMonth() - 3));
    qu['from'] = (today).stringer2();
  }

  if (!qu.hasOwnProperty('to')) {
    qu['to'] = (new Date()).stringer2();
  }

  yahooFinance.historical({ symbol: qu.symbol, from: qu.from, to: qu.to }, function(err, quote) {
    if (err) {return res.status(500).json({"Success": false, "Error": err})}

    return res.status(200).json({
      "Success": true,
      "Symbol": qu.symbol,
      "Quotes": quote
    });

  });
}


const functionModule = {
  "url": "stock_history",
  "name": "stock_history",
  "functions": {
    "GET": {
      "function": fGET,
      "permLevel": 0
    }
  },
  "help": {
    "GET": {
      "info": "Get a stock prices history",
      "params": ["*symbol", "from", "to"],
      "returns": ["Data"]
    }
  }
}

module.exports = {
  functionModule
};