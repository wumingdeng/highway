var express = require('express');
var router = express.Router();

var rcwi = require('../routes/clclt/repayCapitalWithInterest.js')
var api = require('./clclt/run.js');
var tool = require('../utils/tool.js')

var db_proxy = require('../utils/dbconnectorS');
/* 还本付息表 */
router.post('/hbfx', function(req, res, next) {
    var pageNum = req.body.page;
    var rowNum = req.body.rows;
    var pn = req.body.pn
    var start = rowNum * (pageNum - 1);
    //从数据库取数据
    //var dbHelper = require("../utils/dbHelper.js")
    var db = db_proxy.mongo.collection("hbfx");

    db.find({pn:pn}).skip(Number(start)).limit(Number(rowNum)).sort({"rid":1}).toArray(
        function(err,result){
            if (err) {
                res.json({err:1})
            } else {
                res.json({
                    page:pageNum,
                    total:Math.ceil(28 / rowNum),
                    records:28,
                    rows:result
                })
            }
        }
    )

});
module.exports = router;
