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

  var logstr = "Functions fetched successfully: ";

  for (var f in stgs.functions) {
    const fun = stgs.functions[f];
    mods.push(fun['name'])

    logstr += fun['name'] + " [" + Object.keys(fun['functions']).join(" ") + "], "

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

  console.log(logstr);

}

module.exports = {
  integrateApp
}