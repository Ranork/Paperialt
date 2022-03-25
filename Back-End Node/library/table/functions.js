const con = require('../../library/connection')
const tbl_def = require('./definitions')

module.exports = {
  fGET,
  fSGET,
  fDGET,
  fPOST,
  fPUT,
  fDELETE
}

function fGET(table, req, res) {
  var qu = req.query;
  var sql = table.CSelectAll(qu)

  con.pool.query(sql, (error, results) => {
    if (error) { return tbl_def.declareError(res, error); }
    else { return tbl_def.declareGet(res, qu, results.rows, results) }
  })
}

function fSGET(table, req, res) {
  const id = req.params.id;
  var qu = req.query;
  var sql = table.CSelectOne(id, qu['columns']);

  con.pool.query(sql, (error, results) => {
    if (error) { return tbl_def.declareError(res, error); }
    else { return tbl_def.declareGet(res, qu, results.rows[0], results) }
  })
}

function fDGET(table, req, res) {
  con.pool.query("SELECT COUNT(*) FROM " + table.name, (error, results) => {
    if (error) { return tbl_def.declareError(res, error); }
    else {

      var size = results.rows[0]['count'];
      var ans = {
        "Success": true,
        "PrimaryKey": table.primary_key,
        "RowCount": size,
        "Fields": table.fields
      };

      console.log(ans);
      return res.status(200).json(ans)

    }
  })
}

function fPOST(table, req, res) {
  var bdy = req.body;

  if (Object.keys(bdy).length === 0) {
    return res.status(406).json({"Success": false, "Error": "Request body is empty."});
  }
  if (!bdy.hasOwnProperty(table.primary_key)) {
    return res.status(406).json({"Success": false, "Error": "Primary key not found in data.", "PrimaryKey": table.primary_key});
  }

  con.pool.query(table.CInsert(bdy), (error, results) => {
    if (error) { return tbl_def.declareError(res, error); }
    else { return tbl_def.declareGet(res, {}, bdy, results) }
  })
}

function fPUT(table, req, res) {
  var qu = req.body;

  var err = "";
  if (Object.keys(qu).length === 0) { err = "Request body is empty."; }
  else if (!qu.hasOwnProperty('conditions')) { err = "conditions not found in data."; }
  else if (!qu.hasOwnProperty('values')) { err = "values not found in data."; }

  if (err !== "") {
    return res.status(406).json({"Success": false, "Error": err});
  }

  con.pool.query(table.CUpdate(qu), (error, results) => {
    if (error) { return tbl_def.declareError(res, error); }
    else { return tbl_def.declareGet(res, {}, qu, results) }
  })
}

function fDELETE(table, req, res) {
  var qu = req.body;

  if (Object.keys(qu).length === 0) {
    return res.status(406).json({"Success": false, "Error": "Request body is empty."});
  }
  if (!qu.hasOwnProperty('conditions')) {
    return res.status(406).json({"Success": false, "Error": "conditions not found in data."});
  }

  con.pool.query(table.CDelete(qu), (error, results) => {
    if (error) { return tbl_def.declareError(res, error); }
    else { return tbl_def.declareGet(res, {}, qu, results) }
  })
}