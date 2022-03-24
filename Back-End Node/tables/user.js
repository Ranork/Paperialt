const con = require('../library/connection')
const tbl_def = require('../library/table_definitions')

const getUsers = (request, response) => {
  con.pool.query(tbl_def.tables['user'].CSelectAll(), (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const getUserById = (request, response) => {
  const id = request.params.id;

  con.pool.query(tbl_def.tables['user'].CSelectAll("*", "username = '" + id + "'"), (error, results) => {
    if (error) {
      response.status(500).json({
        "Success": false,
        "Error": error
      })
      return;
    }
    response.status(200).json(results.rows[0])
  })
}


module.exports = {
  getUsers,
  getUserById
}