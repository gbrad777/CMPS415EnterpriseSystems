var express = require("express");
var bodyParser = require('body-parser');
var app = express();
var js2xmlparser = require('js2xmlparser');

var routes = require('./routes.js');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/rest', routes);

app.listen(3000);