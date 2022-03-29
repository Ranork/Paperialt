const yahooFinance = require('yahoo-finance');



async function getQuote(symbol) {
  const res = await yahooFinance.quote(symbol);
  console.log(res);
}

getQuote('TSLA');






  // {
  //   summaryDetail: {
  //     maxAge: 1,
  //     priceHint: 2,
  //     previousClose: 174.72,
  //     open: 172.17,
  //     dayLow: 172,
  //     dayHigh: 175.73,
  //     regularMarketPreviousClose: 174.72,
  //     regularMarketOpen: 172.17,
  //     regularMarketDayLow: 172,
  //     regularMarketDayHigh: 175.73,
  //     dividendRate: 0.88,
  //     dividendYield: 0.0050999997,
  //     exDividendDate: 2022-02-04T00:00:00.000Z,
  //     payoutRatio: 0.1434,
  //     fiveYearAvgDividendYield: 1.13,
  //     beta: 1.185531,
  //     trailingPE: 29.193684,
  //     forwardPE: 26.768293,
  //     volume: 87891770,
  //     regularMarketVolume: 87891770,
  //     averageVolume: 93700745,
  //     averageVolume10days: 94897140,
  //     averageDailyVolume10Day: 94897140,
  //     bid: 175.33,
  //     ask: 175.49,
  //     bidSize: 2900,
  //     askSize: 800,
  //     marketCap: 2865686642688,
  //     fiftyTwoWeekLow: 118.86,
  //     fiftyTwoWeekHigh: 182.94,
  //     priceToSalesTrailing12Months: 7.574709,
  //     fiftyDayAverage: 166.312,
  //     twoHundredDayAverage: 155.5514,
  //     trailingAnnualDividendRate: 0.865,
  //     trailingAnnualDividendYield: 0.0049507786,
  //     currency: 'USD',
  //     fromCurrency: null,
  //     toCurrency: null,
  //     lastMarket: null,
  //     algorithm: null,
  //     tradeable: false
  //   },
  //   price: {
  //     maxAge: 1,
  //     preMarketChangePercent: -0.014852299,
  //     preMarketChange: -2.595,
  //     preMarketTime: 2022-03-28T13:29:59.000Z,
  //     preMarketPrice: 172.125,
  //     preMarketSource: 'FREE_REALTIME',
  //     postMarketChangePercent: -0.00091118255,
  //     postMarketChange: -0.16000366,
  //     postMarketTime: 2022-03-28T23:31:33.000Z,
  //     postMarketPrice: 175.44,
  //     postMarketSource: 'FREE_REALTIME',
  //     regularMarketChangePercent: 0.005036658,
  //     regularMarketChange: 0.8800049,
  //     regularMarketTime: 2022-03-28T20:00:03.000Z,
  //     priceHint: 2,
  //     regularMarketPrice: 175.6,
  //     regularMarketDayHigh: 175.73,
  //     regularMarketDayLow: 172,
  //     regularMarketVolume: 87891770,
  //     averageDailyVolume10Day: 94897140,
  //     averageDailyVolume3Month: 93700745,
  //     regularMarketPreviousClose: 174.72,
  //     regularMarketSource: 'FREE_REALTIME',
  //     regularMarketOpen: 172.17,
  //     exchange: 'NMS',
  //     exchangeName: 'NasdaqGS',
  //     exchangeDataDelayedBy: 0,
  //     marketState: 'POST',
  //     quoteType: 'EQUITY',
  //     symbol: 'AAPL',
  //     underlyingSymbol: null,
  //     shortName: 'Apple Inc.',
  //     longName: 'Apple Inc.',
  //     currency: 'USD',
  //     quoteSourceName: 'Nasdaq Real Time Price',
  //     currencySymbol: '$',
  //     fromCurrency: null,
  //     toCurrency: null,
  //     lastMarket: null,
  //     marketCap: 2865686642688
  //   }
  // }