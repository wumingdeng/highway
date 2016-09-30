/**
 * Created by Fizzo on 16/9/30.
 */

var express = require('express');
var router = express.Router();
var db_proxy = require('../../utils/dbconnectorS');
var ob = require('mongodb').ObjectID;

router.get('/getProject', function(req, res, next) {
    //从数据库取数据
    //var dbHelper = require("../utils/dbHelper.js")
    var db = db_proxy.mongo.collection("project");
    db.find().toArray(
        function(err,result){
            if (err) {
                res.json({err:1})
            } else {
                res.json({
                    total:result.length,
                    rows:result
                })

            }
        }
    )
});

router.post('/addProject', function(req, res, next) {
    var body = req.body;
    var pn = body.pn
    var cn = body.cn
    var isCreate = body.isc

    delete body.pn
    delete body.cn
    delete body.isc
    //从数据库取数据
    var db = db_proxy.mongo.collection("project");
    var nowDt = new Date().getTime()
    if (isCreate){
        db.insertOne({arg:body,cn:cn,dt:nowDt,pn:pn},null,function(err,rc){
            if(err){
                res.json({ok:0})
            }else{
                res.render('defaul-project', {name: req.name});
                // res.json({ok:rc.result.ok})
            }
        })
    }else{
        db.updateOne({pn:pn},{arg:body,dt:nowDt},function(err,rc){
            if(err){
                res.json({ok:0})
            }else{
                res.json({ok:rc.result.ok})
            }
        })
    }

});

router.get('/deleteProject', function(req, res, next) {
    var _id = new ob(req.query._id)
    //从数据库取数据
    //var dbHelper = require("../utils/dbHelper.js")
    var db = db_proxy.mongo.collection("project");
    db.deleteOne(
        {_id: _id},
        function (err, r) {
            if (err) {
                res.json({ok: 0})
            }
            else {
                res.json({ok: 1})
            }

        }
    )
});

module.exports = router;