const stgs = require('../settings')
const req_log = require('../middleware/request_logger')

function importModules() {
  for (var i in stgs.functionModules) {
    var mod = require('./' + stgs.functionModules[i]).functionModule;
    functions.push(mod);
  }
}

let functions = [];

function integrateApp(app) {
  importModules();

  for (var f in functions) {
    var fun = functions[f];

    console.log(fun);

    for (var fkey in fun['functions']) {
      var funct = fun['functions'][fkey];
      var url = '/function/' + fun['url']

      switch (fkey) {
        case 'GET': app.get(url, req_log.logRequest, funct); break;
        case 'POST': app.post(url, req_log.logRequest, funct); break;
        case 'PUT': app.put(url, req_log.logRequest, funct); break;
        case 'DELETE': app.delete(url, req_log.logRequest, funct); break;
      }

    }

    var defiurl = '/function/defi/' + fun['url'];
    app.get(defiurl, req_log.logRequest, (req, res) => {
      res.status(200).json({
        "Name": fun['name'],
        "Requests": fun['help']
      })
    })

  }
}

module.exports = {
  functions,
  integrateApp
}