const express = require('express');
const bodyParser = require('body-parser')
const fs = require("fs");

const stgs = require('./library/settings')
const con = require('./library/connection')
const user = require('./tables/user')

const tbl_resp = require('./library/table_responser')

const app = express();

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true, }))

tbl_resp.integrateApp(app);

app.get('/', (request, response) => {
  response.json({
    info: 'Akatron Network Back-End Node',
    tables: Object.keys(tablefuncs)
  });
})

var server = app.listen(stgs.port, function () {
   console.log("Back-End Node listening at http://127.0.0.1:%s", stgs.port)
})
