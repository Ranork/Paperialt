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

  yahooFinance.quote({ symbol: qu.symbol, modules: ['price'] }, function(err, quote) {
    if (err) {return res.status(500).json({"Success": false, "Error": err})}

    res.status(200).json({
      "Success": true,
      "Symbol": qu.symbol,
      "ShortName": quote.price.shortName,
      "LongName": quote.price.longName,
      "MarketPrice": quote.price.regularMarketPrice,
      "Source": quote.price.quoteSourceName,
      "ChangePercent": quote.price.regularMarketChangePercent * 100,
      "Change": quote.price.regularMarketChange,
      "Details": quote.price
    })

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