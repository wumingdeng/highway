/**
 * Created by chenzhaowen on 16-9-26.
 * 成本表
 *
 */

var express = require('express');
var router = express.Router();

var db_proxy = require('../utils/dbconnectorS');

var npt = require("./clclt/inputTable.js")

router.post('/cbb', function(req, res, next) {
    var pageNum = req.body.page;
    var rowNum = req.body.rows;
    var pn = req.body.pn
    var start = rowNum * (pageNum - 1);
    //从数据库取数据
    //var dbHelper = require("../utils/dbHelper.js")
    var db = db_proxy.mongo.collection("cbb");

    db.find({pn:pn}).sort({rid:1}).toArray(
        function(err,result){
            if (err) {
                res.json({err:1})
            } else {

                res.json({
                    page:pageNum,
                    total:Math.ceil(14 / rowNum),
                    records:14,
                    rows:result
                })

            }
        }
    )

});




module.exports = router;