const req_logger = require("./request_logger");
const perm_cont = require("./perm_controller");

const midControllers = [req_logger.logRequest, perm_cont.controller];

module.exports = {
  midWare,
};


function midWare(req, res, next) {
  for (var fi in midControllers) {
    if (!midControllers[fi](req, res, next)) {
      return;
    }
  }

  next();
}