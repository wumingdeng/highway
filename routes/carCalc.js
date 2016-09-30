/**
 * Created by chenzhaowen on 16-9-22.
 * 车型比例计算
 *
 */

var express = require('express');
var router = express.Router();

var db_proxy = require('../utils/dbconnectorS');

var npt = require("./clclt/inputTable.js")

router.post('/car_zss', function(req, res, next) {
    var pageNum = req.body.page;
    var rowNum = req.body.rows;
    var start = rowNum * (pageNum - 1);
    //从数据库取数据
    //var dbHelper = require("../utils/dbHelper.js")
    var db = db_proxy.mongo.collection("car_zss");

    db.find().skip(Number(start)).limit(Number(rowNum)).toArray(
        function(err,result){
            if (err) {
                res.json({err:1})
            } else {

                res.json({
                    page:pageNum,
                    total:Math.ceil(npt.OLC_YEAR / rowNum),
                    records:npt.OLC_YEAR,
                    rows:result
                })

            }
        }
    )

});

router.post('/car_jds', function(req, res, next) {
    var pageNum = req.body.page;
    var rowNum = req.body.rows;
    var start = rowNum * (pageNum - 1);
    //从数据库取数据
    //var dbHelper = require("../utils/dbHelper.js")
    var db = db_proxy.mongo.collection("car_jds");

    db.find().skip(Number(start)).limit(Number(rowNum)).toArray(
        function(err,result){
            if (err) {
                res.json({err:1})
            } else {

                res.json({
                    page:pageNum,
                    total:Math.ceil(npt.OLC_YEAR / rowNum),
                    records:npt.OLC_YEAR,
                    rows:result
                })

            }
        }
    )

});

router.post('/car_sfsr', function(req, res, next) {
    var pageNum = req.body.page;
    var rowNum = req.body.rows;
    var start = rowNum * (pageNum - 1);
    //从数据库取数据
    //var dbHelper = require("../utils/dbHelper.js")
    var db = db_proxy.mongo.collection("car_sfsr");

    db.find().skip(Number(start)).limit(Number(rowNum)).toArray(
        function(err,result){
            if (err) {
                res.json({err:1})
            } else {

                res.json({
                    page:pageNum,
                    total:Math.ceil(npt.OLC_YEAR / rowNum),
                    records:npt.OLC_YEAR,
                    rows:result
                })

            }
        }
    )

});

module.exports = router;