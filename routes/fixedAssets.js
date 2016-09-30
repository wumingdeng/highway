/**
 * Created by chenzhaowen on 16-9-26.
 * 固定收益
 *
 */

var express = require('express');
var router = express.Router();

var db_proxy = require('../utils/dbconnectorS');

var npt = require("./clclt/inputTable.js")

router.post('/gdzc', function(req, res, next) {
    var pageNum = req.body.page;
    var rowNum = req.body.rows;
    var start = rowNum * (pageNum - 1);
    //从数据库取数据
    //var dbHelper = require("../utils/dbHelper.js")
    var db = db_proxy.mongo.collection("gdzc");

    db.find().skip(Number(start)).limit(Number(rowNum)).toArray(
        function(err,result){
            if (err) {
                res.json({err:1})
            } else {

                res.json({
                    page:pageNum,
                    total:Math.ceil(2 / rowNum),
                    records:2,
                    rows:result
                })

            }
        }
    )

});




module.exports = router;