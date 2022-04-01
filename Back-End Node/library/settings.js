// SERVER SETTINGS
// ----------------
//

const ip = "127.0.0.1";
const port = 919;

const psql = {
  user: 'ranork',
  host: '45.200.120.138',
  database: 'paperialt',
  password: 'zctaz22xc',
  port: 5432,
}

const psqlstr = "postgresql://ranork:zctaz22xc@45.200.120.138:5432/paperialt";

const securityKey = "&h8=/+&Ne)S)YbCvrG),3X2%G-CxGH";

const functionModules = ["token", "wallet", "order"];
const functions = [];

const tableModules = {};
const viewModules = {};

let authTokens = {
  'PaperialToken_admin': {
    'lastlogindate': 'Thu Mar 24 2022 00:00:00 GMT+0300 (GMT+03:00)',
    'lastloginip': '127.0.0.1',
    'maxposition': 5,
    'maxwallet': 2,
    'password': '41d24f766f9cc9b781c6b7f32ddd6287',
    'permlevel': 100,
    'registerdate': 'Thu Mar 24 2022 00:00:00 GMT+0300 (GMT+03:00)',
    'registerip': '127.0.0.1',
    'token': 'PaperialToken_admin',
    'username': 'ranork',
  }
};

module.exports = {
  ip,
  port,
  psql,
  psqlstr,
  securityKey,
  functionModules,
  functions,
  authTokens,
  tableModules,
  viewModules
};