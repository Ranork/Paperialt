const con = require('../connection')
const tbl_def = require('../../library/table/definitions')
const tbl_fu = require('../../library/table//functions')
const req_log = require('../middleware/request_logger')

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

var tablefuncs = getTableFuncs();

function integrateApp(app) {
  tablefuncs = getTableFuncs();
  for (var ti in tablefuncs) {
    var tblName = ti;
    var tblFuncs = tablefuncs[ti];
    var url = "/table/" + tblName;

    app.get(url, req_log.logRequest, tblFuncs['GET']);
    app.get(url + '/:id', req_log.logRequest, tblFuncs['sinGET']);
    app.get("/table/defi/" + tblName, req_log.logRequest, tblFuncs['defGET']);
    app.post(url, req_log.logRequest, tblFuncs['POST']);
    app.put(url, req_log.logRequest, tblFuncs['PUT']);
    app.delete(url, req_log.logRequest, tblFuncs['DELETE']);
  }

  app.get('/', (request, response) => {
    response.json({
      info: 'Paperialt Back-End Node',
      owner: 'Akatron Network',
      tables: Object.keys(tablefuncs)
    });
  })
  console.log("Tables fetched successfully: " + Object.keys(tablefuncs).join(", "))

}