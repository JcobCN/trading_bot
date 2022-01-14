var express = require('express');
var app = express();
var bodyParser = require('body-parser');
const cors = require('cors');
const expressWs = require('express-ws');
const http = require('http');

var port = process.env.PORT || 9080;

// models
var models = require("./models");

// routes
var botRoute = require('./routes/bots');
var settingRoute = require('./routes/setting');
var transactionRoute = require('./routes/transactions');

//Sync Database
models.sequelize.sync().then(function () {
  console.log('connected to database')
}).catch(function (err) {
  console.log(err)
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(cors());

// register routes
app.use('/settings', settingRoute);
app.use('/bots', botRoute);
app.use('/transactions', transactionRoute);

// index path
app.get('/', function (req, res) {
  console.log('app listening on port: ' + port);
  res.send('tes express nodejs sqlite')
});

const server = http.createServer(app);

server.listen(port, function () {
  console.log('app listening on port: ' + port);
});

module.exports.wss = expressWs(app, server);

app.ws('/connect', function (ws, req) {
  ws.on('message', async function (msg) {
    console.log(msg);
  });
})

module.exports = app;