const express = require('express');
const bodyParser = require('body-parser')
const fs = require("fs");

const stgs = require('./library/settings')
const con = require('./library/connection')
const user = require('./tables/user')

const app = express();

app.use(bodyParser.json())

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

app.get('/', (request, response) => {
   console.log("a");
   response.json({ info: 'Node.js, Express, and Postgres API' });
 })

app.get('/users', user.getUsers)
app.get('/users/:id', user.getUserById)

var server = app.listen(stgs.port, function () {
   console.log("Back-End Node listening at http://127.0.0.1:%s", stgs.port)
})