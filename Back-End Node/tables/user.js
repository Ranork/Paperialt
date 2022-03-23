const con = require('../library/connection')

const getUsers = (request, response) => {
  con.pool.query('SELECT * FROM tbl_user ORDER BY username ASC', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const getUserById = (request, response) => {
  const id = request.params.id;

  con.pool.query('SELECT * FROM tbl_usera WHERE username = $1', [id], (error, results) => {
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