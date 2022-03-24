const con = require('../library/connection')
const tbl_def = require('../library/table_definitions')
const tbl_fu = require('../library/table_functions')

module.exports = {
  getTableFuncs,
  integrateApp
}


function getTableFuncs() {
  var tablefuncs = {}

  // Do this for all tables
  for (var tb in tbl_def.tables) {
    var table = tbl_def.tables[tb]

    // General GET Function
    var genGET = (req, res) => { tbl_fu.fGET(table, req, res) }

    // Single GET Function
    var sinGET = (req, res) => { tbl_fu.fSGET(table, req, res) }

    // Definition GET Function
    var defGET = (req, res) => { tbl_fu.fDGET(table, req, res) }
    
    // POST Function
    var fPOST = (req, res) => { tbl_fu.fPOST(table, req, res) }
    
    // PUT Function
    var fPUT = (req, res) => { tbl_fu.fPUT(table, req, res) }
    
    // DELETE Function
    var fDELETE = (req, res) => { tbl_fu.fDELETE(table, req, res) }

    tablefuncs[tb] = {
      "sinGET": sinGET,
      "defGET": defGET,
      "GET": genGET,
      "POST": fPOST,
      "PUT": fPUT,
      "DELETE": fDELETE
    };
  }

  return tablefuncs;
}

function integrateApp(app) {
  var tablefuncs = getTableFuncs();
  for (var ti in tablefuncs) {
    var tblName = ti;
    var tblFuncs = tablefuncs[ti];
    var url = "/" + tblName;

    app.get(url, tblFuncs['GET']);
    app.get(url + '/:id', tblFuncs['sinGET']);
    app.get('/defi' + url, tblFuncs['defGET']);
    app.post(url, tblFuncs['POST']);
    app.put(url, tblFuncs['PUT']);
    app.delete(url, tblFuncs['DELETE']);
  }

  console.log("Tables fetched successfully: " + Object.keys(tablefuncs).join(", "))

}