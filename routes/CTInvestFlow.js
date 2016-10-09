/**
 * Created by chenzhaowen on 16-9-26.
 * 中交资本金流量表
 *
 */

var express = require('express');
var router = express.Router();

var db_proxy = require('../utils/dbconnectorS');

var npt = require("./clclt/inputTable.js")

router.post('/zjzbj', function(req, res, next) {
    var pageNum = req.body.page;
    var rowNum = req.body.rows;
    var pn = req.body.pn
    var start = rowNum * (pageNum - 1);
    //从数据库取数据
    //var dbHelper = require("../utils/dbHelper.js")
    var db = db_proxy.mongo.collection("zjzbj");

    db.find({pn:pn}).skip(Number(start)).limit(Number(rowNum)).sort({"rid":1}).toArray(
        function(err,result){
            if (err) {
                res.json({err:1})
            } else {

                res.json({
                    page:pageNum,
                    total:Math.ceil(11 / rowNum),
                    records:11,
                    rows:result
                })

            }
        }
    )

});




module.exports = router;