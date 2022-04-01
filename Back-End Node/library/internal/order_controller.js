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
          console.log("[ORD " + order.id +"] Buy Order Triggered. Type: " + order.type + 
                      " Sym: " + order.symbol + 
                      " TargetPrice: " + order.targetprice +
                      " MarketPrice: " + stprices.market);
          triggerOrder(order.id, stprices)
        }
        else if (order.bs === 'SELL' && stprices.market >= tPrice) {
          // SELL MODE
          console.log("[ORD " + order.id +"] Sell Order Triggered. Type: " + order.type + 
                      " Sym: " + order.symbol + 
                      " TargetPrice: " + order.targetprice +
                      " MarketPrice: " + stprices.market);
          triggerOrder(order.id, stprices)
        }
      });

    }

  });
}


async function triggerOrder(orderid, stockprices) {

  const order = tblOrder.SQSelectOne(orderid);
  const pos = tblPos.SQSelectOne(order.position);
  const wallet = tblWallet.SQSelectOne(order.wallet);

  deactivateOrder(orderid);

  var occuredPayment = (order.amount * stockprices.market);
  var occuredAmount = order.amount;

  var newWalBalance = wallet.currentbalance;

  var posAvgUsd = pos.totalusd / pos.totalstock;

  if ((pos.type == 'SHORT' && order.bs == 'BUY') || (pos.type == 'LONG' && order.bs == 'SELL')) {
    // DECREASE BALANCES

    switch (pos.type) {
      case "SHORT": newWalBalance +=  posAvgUsd - occuredPayment; break;
      case "LONG": newWalBalance += occuredPayment - posAvgUsd; break;
    }

    occuredAmount = -1 * occuredAmount;
    occuredPayment = -1 * occuredPayment;
  }

  // position total usd is goin wrong
  
  var posUpQu = {
    "conditions": "id = '" + pos.id + "'",
    "values": {
      "totalstock": pos.totalstock + occuredAmount,
      "totalusd": pos.totalusd + occuredPayment,
    }
  }

  var walUpQu = {
    "conditions": "id = '" + wallet.id + "'",
    "values": {
      "currentbalance": newWalBalance
    }
  }

  console.log(posUpQu);
  console.log(walUpQu);

  tblPos.SQUpdate(posUpQu);
  tblWallet.SQUpdate(walUpQu);

  if (posUpQu.values.totalstock <= 0) {
    console.log("[POS " + pos.id + "] Completed. PnL: " + (newWalBalance - wallet.currentbalance).toFixed(4));
    deactivatePosition(pos.id);
  }

}

async function deactivateOrder(orderid) {
  var qu = {
    "values": {
      "finishdate": (new Date()).stringer(),
      "endtype": "COMPLETED",
      "active": "false",
    },
    "conditions": "id = '" + orderid + "'"
  }

  tblOrder.SQUpdate(qu);
}

async function deactivatePosition(posid) {
  const orders = tblOrder.SQSelectAll({"conditions": "position = '" + posid + "'"});
  for (var oid in orders) {
    var order = orders[oid];
    var upqu = {
      "conditions": "id = '" + order.id + "'",
      "values": { "active": 'false' }
    }
    tblOrder.SQUpdate(upqu);
  }
  var posupqu = {
    "conditions": "id = '" + posid + "'",
    "values": { "active": 'false'}
  }
  tblPos.SQUpdate(posupqu);
}

module.exports = {
  controlOrders
}