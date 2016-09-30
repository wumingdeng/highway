var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: '公路系统' });
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




module.exports = router;
