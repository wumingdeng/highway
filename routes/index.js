var express = require('express');
var router = express.Router();
var db_proxy = require('../utils/dbconnectorS');

/* GET home page. */
router.get('/', function(req, res, next) {
  var uid = req.cookies.uid;
  var pwd = req.cookies.pwd;
  var right = req.cookies.right;
  var cn = req.cookies.cn;
  var clear = req.query.clear
  if(clear == "0"){
    res.render('login', {title :'登陆'});
  }else {
    if (uid && pwd && right && cn) {
      var db = db_proxy.mongo.collection("users");
      db.findOne({uid: uid, pwd: pwd, name: cn, right: right},
          null,
          null,
          function (err, item) {
            if (err) {
              res.render('login', {title: '登陆'});
            } else {
              res.render('index', {title: "首页"});
            }
          }
      )
    } else {
      res.render('login', {title: '登陆'});
    }
  }
});

router.get('/repay', function(req, res, next) {
  res.render('repay', { title: '公路系统' });
});

router.get('/cashFlow', function(req, res, next) {
  res.render('cashFlow', { title: '公路系统' });
});

router.get('/car', function(req, res, next) {
  res.render('carCalc', { title: '公路系统' });
});

router.get('/cost', function(req, res, next) {
  res.render('cost', { title: '公路系统' });
});

router.get('/fixedAssets', function(req, res, next) {
  res.render('fixedAssets', { title: '公路系统' });
});

router.get('/investFlow', function(req, res, next) {
  res.render('investFlow', { title: '公路系统' });
});

router.get('/profit', function(req, res, next) {
  res.render('profit', { title: '公路系统' });
});

router.get('/runManage', function(req, res, next) {
  res.render('runManage', { title: '公路系统' });
});

router.get('/CTInvestFlow', function(req, res, next) {
  res.render('CTInvestFlow', { title: '公路系统' });
});

router.get('/defaul-project', function(req, res, next) {
  res.render('defaul-project', { title: '项目明细' });
});

router.get('/modify-project', function(req, res, next) {
  res.render('modify-project', {name: req.name});
});

router.get('/manage-project', function(req, res, next) {
  res.render('manage-project', {name: req.name});
});

router.get('/manage-users', function(req, res, next) {
  res.render('manage-users', {name: req.name});
});

router.get('/home',function(req,res,next){
  var uid = req.cookies.uid;
  var pwd = req.cookies.pwd;
  var right = req.cookies.right;
  var cn = req.cookies.cn;
  if(uid && pwd && right && cn){
    var db = db_proxy.mongo.collection("users");
    db.findOne({uid:uid,pwd:pwd,name:cn,right:right},
        null,
        null,
        function(err,item){
          if (err) {
            res.render('login', {title :'登陆'});
          } else {
            res.render('index', {title :"首页"});
          }
        }
    )
  }else{
    res.render('login', {title :'登陆'});
  }
});

router.get('/setGlobal',function(req,res,next){
  res.render('setGlobal', {title: '设置全局变量'});
});



module.exports = router;
