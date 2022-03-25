const con = require('../connection')
const cryp = require('crypto');
const hsh = require('../hash')

class Table {
  constructor(name, primary_key, permlevel) {

    this.name = name;
    this.primary_key = primary_key;
    this.permlevel = permlevel;

    con.pool.query("SELECT * FROM " + name, (error, results) => {
      if (error) { return console.error("Table Construct Error in " + name + ": " + error); }
      else { this.fields = results.fields; }
    })
  }

  getSize() {
    var size = 0;
    con.pool.query("SELECT COUNT(*) FROM " + this.name, (error, results) => {
      if (error) { console.error("Table Construct Error in " + name + ": " + error); return undefined; }
      else { size = results.rows[0]['count']; }
    })
    return size;
  }

  CSelectAll(query) {

    if (query === undefined) {
      query = {};
    }

    var sql = "SELECT ";

    if (query.columns !== undefined) {
      sql += query.columns;
    }
    else {
      sql += "*";
    }

    sql += " FROM " + this.name;

    if (query.conditions !== undefined) {
      sql += " WHERE " + query.conditions;
    }
    if (query.order !== undefined) {
      sql += " ORDER BY " + query.order
    }
    if (query.limit !== undefined) {
      sql += " LIMIT " + query.limit.toString();
      if (query.offset !== undefined) {
        sql += " OFFSET " + query.offset.toString();
      }
    }
    return sql;
  }

  CSelectOne(primaryValue, columns) {
    var cols = "*";
    if (columns !== undefined) {
      cols = columns;
    }

    var cond = this.primary_key + " = '" + primaryValue + "'";

    return this.CSelectAll({
      "columns": cols,
      "conditions": cond,
      "limit": 1
    });
  }

  CInsert(values) {

    var cols = [];
    var vals = [];

    for (var key in values) {
      var val = values[key];

      if (key === "password") { val = val.hashStr(); }

      cols.push(key);
      vals.push("'" + val + "'");
    }

    var valstr = " (" + vals.join(", ") + ")";
    var colstr = " (" + cols.join(", ") + ")";

    var sql = "INSERT INTO " + this.name + colstr + " VALUES" + valstr

    return sql;
  }

  CDelete(query) {
    return "DELETE FROM " + this.name + " WHERE " +  query.conditions
  }

  CUpdate(query) {
    var vals = [];

    for (var key in query.values) {
      var val = query.values[key];

      if (key === "password") { val = val.hashStr(); }

      vals.push(key + " = '" + val + "'");
    }

    return "UPDATE " + this.name + " SET " + vals.join(", ") + " WHERE " + query.conditions
  }
}


function declareError(res, error) {
  return res.status(500).json({"Success": false, "Error": error});
}

function declareGet(res, query, rows, results, extra) {
  if (rows === undefined) {
    return res.status(404).json({
      "Success": false,
      "Error": "Data not found"
    });
  }

  if (Object.keys(query).length === 0) {
    query = undefined;
  }

  var ans = {
    "Success": true,
    "RowCount": rows.length,
    "Query": query,
    "Data": rows
  }

  for (var k in extra) {
    ans[k] = extra[k];
  }

  // console.log(ans);
  return res.status(200).json(ans);
}


const tables = {
  "user": new Table("tbl_user", "username", 100)
}

module.exports = {
  tables,
  declareError,
  declareGet
}