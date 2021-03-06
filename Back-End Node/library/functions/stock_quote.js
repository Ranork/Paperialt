const yahooFinance = require('yahoo-finance');
const con = require('../connection')
const stgs = require('../settings')

let quoteChache = {};

function fGET(req, res) {
  let qu = req.query;
  var token = req.get('Token');
  var userdata = stgs.authTokens[token];

  if (!qu.hasOwnProperty('symbol')) {
    return res.status(500).json({"Success": false, "Error": "symbol parameter not found."})
  }

  if (quoteChache.hasOwnProperty(qu.symbol)) {
    var now = new Date();
    if (Math.abs(now - quoteChache[qu.symbol].date) < stgs.quoteChacheLifeTime) {
      var quote = quoteChache[qu.symbol];
      return res.status(200).json({
        "Success": true,
        "Symbol": qu.symbol,
        "ShortName": quote.price.shortName,
        "LongName": quote.price.longName,
        "MarketPrice": quote.price.regularMarketPrice,
        "Source": quote.price.quoteSourceName,
        "ChangePercent": quote.price.regularMarketChangePercent * 100,
        "Change": quote.price.regularMarketChange,
        "Details": quote.price
      });
    }
  }

  yahooFinance.quote({ symbol: qu.symbol, modules: ['price'] }, function(err, quote) {
    if (err) {return res.status(500).json({"Success": false, "Error": err})}

    var chquot = {
      "price": quote.price,
      "date": new Date()
    }
    quoteChache[qu.symbol] = chquot;

    return res.status(200).json({
      "Success": true,
      "Symbol": qu.symbol,
      "ShortName": quote.price.shortName,
      "LongName": quote.price.longName,
      "MarketPrice": quote.price.regularMarketPrice,
      "Source": quote.price.quoteSourceName,
      "ChangePercent": quote.price.regularMarketChangePercent * 100,
      "Change": quote.price.regularMarketChange,
      "Details": quote.price
    });

  });
}




const functionModule = {
  "url": "stock_quote",
  "name": "stock_quote",
  "functions": {
    "GET": {
      "function": fGET,
      "permLevel": 0
    }
  },
  "help": {
    "GET": {
      "info": "Get a stock prices",
      "params": ["symbol"],
      "returns": ["Data"]
    }
  }
}

module.exports = {
  functionModule
};