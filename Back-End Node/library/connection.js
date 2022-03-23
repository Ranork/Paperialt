const Pool = require('pg').Pool
const stgs = require('./settings')

const pool = new Pool(stgs.psql)

module.exports = {
    pool: pool
}