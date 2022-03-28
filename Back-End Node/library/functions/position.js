const con = require('../connection')
const stgs = require('../settings')

const tblUser = stgs.tableModules['user'];

function fGET(req, res) {



}

function fDELETE(req, res) {


}


const functionModule = {
  "url": "position",
  "name": "position",
  "functions": {
    "GET": {
      "function": fGET,
      "permLevel": -1
    },
    "DELETE": {
      "function": fDELETE,
      "permLevel": -1
    }
  },
  "help": {
    "GET": {
      "info": "Get a new token with username and password.",
      "params": ["username*", "password*"],
      "returns": ["username", "permLevel", "token"]
    },
    "DELETE": {
      "info": "Dispose a token from server.",
      "params": ["token*"],
      "returns": ["info"]
    }
  }
}

module.exports = {
  functionModule
};