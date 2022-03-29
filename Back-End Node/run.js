const express = require('express');
const bodyParser = require('body-parser')
const fs = require("fs");
const stgs = require('./library/settings')
const tbl_resp = require('./library/table/responser')
const fun_cnstr = require('./library/functions/constructor')
const con = require('./library/connection')
const tbl_def = require('./library/table/definitions')
const or_cont = require('./library/internal/order_controller')


const app = express();
const router = express.Router()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true, }))


tbl_resp.integrateApp(app);
fun_cnstr.integrateApp(app);

var server = app.listen(stgs.port, function () {
   console.log("Back-End Node listening at http://127.0.0.1:%s", stgs.port)
})

or_cont.controlOrders();