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

const securityKey = "&h8=/+&Ne)S)YbCvrG),3X2%G-CxGH";

const functionModules = [
                          "token"
                        ];

module.exports = {
  ip,
  port,
  psql,
  securityKey,
  functionModules
};