const yahooFinance = require('yahoo-finance');
const con = require('../connection')
const stgs = require('../settings')

const tblUser = stgs.tableModules.user;
const tblOrder = stgs.tableModules.order;
const tblPos = stgs.tableModules.position;
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

      yahooFinance.quote({ symbol: order.symbol, modules: ['price'] }, function(err, quote) {

        var stprices = {
          market: quote.price.regularMarketPrice,
          high: quote.price.regularMarketDayHigh,
          low: quote.price.regularMarketDayLow
        }

        console.log(stprices);

        const tPrice = order.targetprice;

        if (order.bs === 'BUY' && stprices.market <= tPrice) {
          // BUY MODE
          triggerOrder(order.id, stprices)
          console.log("[ID: " + order.id +"] Buy Order Triggered. Type: " + order.type + 
                      " Sym: " + order.symbol + 
                      " TargetPrice: " + order.targetprice +
                      " MarketPrice: " + stprices.market);
        }
        else if (order.bs === 'SELL' && stprices.market >= tPrice) {
          // SELL MODE
          triggerOrder(order.id, stprices)
          console.log("[ID: " + order.id +"] Sell Order Triggered. Type: " + order.type + 
                      " Sym: " + order.symbol + 
                      " TargetPrice: " + order.targetprice +
                      " MarketPrice: " + stprices.market);
        }
      });

    }

  });
}


async function triggerOrder(orderid, stockprices) {

  const order = tblOrder.SQSelectOne(orderid);
  const pos = tblPos.SQSelectOne(order.position);
  const wallet = tblWallet.SQSelectOne(order.wallet);

  // deactivateOrder(orderid);

  var occuredPayment = (order.amount * stockprices.market);
  var occuredAmount = order.amount;

  if ((pos.type == 'SHORT' && order.bs == 'BUY') || (pos.type == 'LONG' && order.bs == 'SELL')) {
    // DECREASE BALANCES
    occuredAmount = -1 * occuredAmount;
    occuredPayment = -1 * occuredPayment;
  }

  var posUpQu = {
    "totalstock": pos.totalstock + order.amount,
    "totalusd": pos.totalusd + occuredPayment
  }

  console.log(posUpQu);

}

async function deactivateOrder(orderid) {
  var qu = {
    "values": {
      "finishdate": (new Date()).stringer(),
      "endtype": "COMPLETED"
    },
    "conditions": "id = '" + orderid + "'"
  }

  var sql = tblOrder.CUpdate(qu)
  con.pool.query(sql, (error, results) => {
    if (error) { console.log(error) }
    console.log("Order closed");
  });
}


module.exports = {
  controlOrders
}