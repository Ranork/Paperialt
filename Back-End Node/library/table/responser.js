const con = require('../connection')
const tbl_def = require('../../library/table/definitions')
const tbl_fu = require('../../library/table//functions')
const req_log = require('../middleware/request_logger')
const mid_const = require('../middleware/constructor').midWare
const stgs = require('../settings')

module.exports = {
  getTableFuncs,
  integrateApp
}


function getTableFuncs() {
  var tablefuncs = {}

  // Do this for all tables
  for (var tb in stgs.tableModules) {
    const table = Object.assign(Object.create(Object.getPrototypeOf(stgs.tableModules[tb])), stgs.tableModules[tb])

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

var tablefuncs = getTableFuncs();

function integrateApp(app) {

  for (var ti in tablefuncs) {
    var tblName = ti;
    var tblFuncs = tablefuncs[ti];
    var url = "/table/" + tblName;

    app.get(url, mid_const, tblFuncs['GET']);
    app.get(url + '/:id', mid_const, tblFuncs['sinGET']);
    app.get("/table/defi/" + tblName, mid_const, tblFuncs['defGET']);
    app.post(url, mid_const, tblFuncs['POST']);
    app.put(url, mid_const, tblFuncs['PUT']);
    app.delete(url, mid_const, tblFuncs['DELETE']);
  }

  app.get('/', (request, response) => {
    response.json({
      Info: 'Paperialt Back-End Node',
      Owner: 'Akatron Network',
      Table_Modules: Object.keys(tablefuncs),
      View_Modules: Object.keys(stgs.viewModules),
      Function_Modules: stgs.functionModules
    });
  })
  console.log("Tables fetched successfully: " + Object.keys(tablefuncs).join(", "))

}