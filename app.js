require('coffee-script/register');
var express = require('express');
var middleware = require('./middleware');
var path = require("path");
var app = express();
// view engine setup


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

middleware(app);
module.exports = app;

