const express = require('express');
const bodyParser = require('body-parser')
const fs = require("fs");
const stgs = require('./library/settings')
const con = require('./library/connection')
const user = require('./tables/user')
const tbl_resp = require('./library/table/responser')


const app = express();
const router = express.Router()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true, }))

tbl_resp.integrateApp(app);

router.use(function (req, res, next) {
  console.log('Time:', Date.now())
  next()
});
app.use('/', router);

var server = app.listen(stgs.port, function () {
   console.log("Back-End Node listening at http://127.0.0.1:%s", stgs.port)
})
