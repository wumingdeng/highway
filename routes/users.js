var express = require('express');
var router = express.Router();

var rcwi = require('../routes/clclt/repayCapitalWithInterest.js')
var api = require('./clclt/run.js');
var tool = require('../utils/tool.js')

var db_proxy = require('../utils/dbconnectorS');
//api.run();
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.json({
    total:1,
    records:1,
    rows:[
      {id:1,name:'借款1',total:0,b1:1,b2:2,b3:3,b4:4,r1:1,r2:2,r3:3,r4:4,r5:5,r6:6,r7:1,r8:1,r9:9,r10:10}
    ]
  });
});
/* 还本付息表 */
router.post('/hbfx', function(req, res, next) {
    var pageNum = req.body.page;
    var rowNum = req.body.rows;
    var start = rowNum * (pageNum - 1);
    //从数据库取数据
    //var dbHelper = require("../utils/dbHelper.js")
    var db = db_proxy.mongo.collection("hbfx");

    db.find().skip(Number(start)).limit(Number(rowNum)).toArray(
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
