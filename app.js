var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');
var repay = require('./routes/repay');
var carCalc = require("./routes/carCalc");
var cashFlow = require("./routes/cashFlow");
var runManage = require("./routes/runManage");
var fixedAssets = require("./routes/fixedAssets");
var cost = require("./routes/cost");
var profit = require("./routes/profit");
var investFlow = require("./routes/investFlow");
var CTInvestFlow = require("./routes/CTInvestFlow");
var planCashFlow = require("./routes/planCashFlow");
var manageProject = require("./routes/logic/managerProject");


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');
var ejs = require('ejs');
app.engine('html',ejs.__express);
app.set('view engine', 'html');
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);
app.use('/repay', repay);
app.use("/carCalc",carCalc);
app.use("/cashFlow",cashFlow);
app.use("/runManage",runManage);
app.use("/fixedAssets",fixedAssets);
app.use("/cost",cost);
app.use("/profit",profit);
app.use("/investFlow",investFlow);
app.use("/CTInvestFlow",CTInvestFlow);
app.use("/planCashFlow",planCashFlow);
app.use("/manageProject",manageProject);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
   message: err.message,
   error: {}
  });
});


var dbmgr = require('./utils/dbconnectorS');
var MongoClient = require('mongodb').MongoClient;

var ip_mongo = 'localhost';
var url = 'mongodb://'+ip_mongo+':27017/fizzo';
MongoClient.connect(url,function(err,db){
  if(err){
    console.log(err);
    server.stop();
  }else{
    // 授权
    dbmgr.mongo = db;
    console.log("连接数据库")

    // var api = require('./routes/clclt/run.js');
    // api.run();
  }
});
module.exports = app;
