const stgs = require('../settings')
const midw = require('../middleware/constructor').midWare

function importModules() {
  for (var i in stgs.functionModules) {
    var mod = require('./' + stgs.functionModules[i]).functionModule;
    stgs.functions.push(mod);
  }
}


function integrateApp(app) {
  importModules();

  var mods = [];

  for (var f in stgs.functions) {
    var fun = stgs.functions[f];
    mods.push(fun['name'])

    for (var fkey in fun['functions']) {
      var funct = fun['functions'][fkey]['function'];
      var url = '/function/' + fun['url']

      switch (fkey) {
        case 'GET': app.get(url, midw, funct); break;
        case 'POST': app.post(url, midw, funct); break;
        case 'PUT': app.put(url, midw, funct); break;
        case 'DELETE': app.delete(url, midw, funct); break;
      }

    }

    var defiurl = '/function/defi/' + fun['url'];
    app.get(defiurl, midw, (req, res) => {
      res.status(200).json({
        "Name": fun['name'],
        "Requests": fun['help']
      })
    })

  }

  console.log("Functions fetched successfully: " + mods.join(", "));

}

module.exports = {
  integrateApp
}