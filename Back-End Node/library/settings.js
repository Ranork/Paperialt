// SERVER SETTINGS
// ----------------

const ip = "127.0.0.1";
const port = 919;

const psql = {
  user: 'ranork',
  host: '45.200.120.138',
  database: 'paperialt',
  password: 'zctaz22xc',
  port: 5432,
}

const cors = [
  ctx => header("Access-Control-Allow-Origin", "*"),
  ctx => header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept"),
  ctx => header("Access-Control-Allow-Methods", "GET, PUT, PATCH, POST, DELETE, HEAD"),
  ctx => ctx.method.toLowerCase() === 'options' ? 200 : false
];

module.exports = {
  ip,
  port,
  cors,
  psql
};