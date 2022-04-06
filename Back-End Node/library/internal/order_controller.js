const yahooFinance = require('yahoo-finance');
const con = require('../connection')
const stgs = require('../settings')

const tblUser = stgs.tableModules.user;
const tblOrder = stgs.tableModules.order;
const tblPos = stgs.tableModules.position;
const tblWallet = stgs.tableModules.wallet;

var lastControl = new Date();

async function mainController() {
  controlOrders();
  while (true) {
    var now = new Date();
    if (Math.abs(now - lastControl) >= stgs.orderControlInterval) {
      lastControl = now;
      controlOrders();
    }
    await sleep(100);
  }
}

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function controlOrders() {
  var sql = tblOrder.CSelectAll({
    "conditions": "active = true"
  })

  var activeOrders = [];

  con.pool.query(sql, (error, results) => {
    if (error) { console.log(error) }

    activeOrders = results.rows;

    if (results.rowCount > 0) {
      console.log("[" + (new Date()).stringer() + "] Order controller. Active Order Count: " + results.rowCount);
    }

    for (var oi in activeOrders) {
      const order = activeOrders[oi];

      yahooFinance.quote({ symbol: order.symbol, modules: ['price'] }, function(err, quote) {
        
        const stprices = {
          market: quote.price.regularMarketPrice,
          high: quote.price.regularMarketDayHigh,
          low: quote.price.regularMarketDayLow
        }
        const tPrice = order.targetprice;

        if (order.bs === 'BUY' && stprices.market <= tPrice) {
          // BUY MODE
          console.log("[ORD " + order.id + " POS " + order.position + "] Buy Order Triggered. Type: " + order.type + 
                      " Sym: " + order.symbol + 
                      " TargetPrice: " + order.targetprice +
                      " MarketPrice: " + stprices.market);
          triggerOrder(order.id, stprices)
        }
        else if (order.bs === 'SELL' && stprices.market >= tPrice) {
          // SELL MODE
          console.log("[ORD " + order.id + " POS " + order.position + "] Sell Order Triggered. Type: " + order.type + 
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
      case "SHORT": newWalBalance +=  (posAvgUsd - stockprices.market) * order.amount; break;
      case "LONG": newWalBalance += (stockprices.market - posAvgUsd) * order.amount; break;
    }

    occuredAmount = -1 * occuredAmount;
    occuredPayment = -1 * occuredPayment;
  }
  
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

  tblPos.SQUpdate(posUpQu);
  tblWallet.SQUpdate(walUpQu);

  if (posUpQu.values.totalstock <= 0) {
    console.log("[POS " + pos.id + "] Completed. PnL: " + (newWalBalance - wallet.currentbalance).toFixed(4));
    deactivatePosition(pos.id, (newWalBalance - wallet.currentbalance));
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

async function deactivatePosition(posid, pnl) {
  const orders = tblOrder.SQSelectAll({"conditions": "position = '" + posid + "' AND active = true"});
  for (var oid in orders) {
    var order = orders[oid];
    var upqu = {
      "conditions": "id = '" + order.id + "'",
      "values": { "active": 'false', "endtype": "CANCELLED", "finishdate": (new Date()).stringer(), }
    }
    tblOrder.SQUpdate(upqu);
  }
  var posupqu = {
    "conditions": "id = '" + posid + "'",
    "values": { "active": 'false', "finishpnl": pnl}
  }
  tblPos.SQUpdate(posupqu);
}

module.exports = {
  controlOrders,
  mainController,
  deactivatePosition,
  deactivateOrder
}