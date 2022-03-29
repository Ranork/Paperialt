const yahooFinance = require('yahoo-finance');
const con = require('../connection')
const stgs = require('../settings')

const tblUser = stgs.tableModules.user;
const tblOrder = stgs.tableModules.order;
const tblWallet = stgs.tableModules.wallet;

async function controlOrders() {
  var sql = tblOrder.CSelectAll({
    "conditions": "active = true"
  })

  var activeOrders = [];

  con.pool.query(sql, (error, results) => {
    if (error) { console.log(error) }

    activeOrders = results.rows;
    console.log(activeOrders);

    for (var oi in activeOrders) {
      var order = activeOrders[oi];

      yahooFinance.quote({
        symbol: order.symbol,
        modules: ['price']       // optional; default modules.
      }, function(err, quote) {
        console.log(quote);
        var stprices = {
          market: quote.price.regularMarketPrice,
          high: quote.price.regularMarketDayHigh,
          low: quote.price.regularMarketDayLow
        }

        console.log(stprices);

      });

    }

  });
}

module.exports = {
  controlOrders
}