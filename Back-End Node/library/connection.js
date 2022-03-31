const Pool = require('pg').Pool
const stgs = require('./settings')
var Client = require('pg-native')

const pool = new Pool(stgs.psql)

const pgcl_sync = new Client()
pgcl_sync.connectSync(stgs.psqlstr)


module.exports = {
    pool,
    pgcl_sync
}