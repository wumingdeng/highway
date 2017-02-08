/**
 * Created by chenzhaowen on 16-9-30.
 */
var express = require('express');
var router = express.Router();

var db_proxy = require('../utils/dbconnectorS');

var npt = require("./clclt/inputTable.js")
router.get('/query', function(req, res, next) {
    var uid = req.query.uid;
    //根据权限返回用户数据
    var db = db_proxy.mongo.collection("users");

    db.findOne({"uid":uid},{_id:0,pwd:0},null,function(err,item){
        if (err) {
            res.json({err:0});
        } else {
            if(item) {
                if (Number(item.right) == 1) { //管理员返回所有数据
                    db.find().toArray(function(err2,result){
                        if (err2) {

                        } else {
                            res.json({arr:result});
                        }

                    })
                } else {
                    res.json({arr:[item]}); //如果普通权限 只返回自己的数据
                }
            } else {
                res.json({err:1})
            }
        }

    })

});

//添加用户
router.post('/add', function(req, res, next) {
    var data = req.body;

    var db = db_proxy.mongo.collection("users");

    db.findOne({uid:data.uid},function(err,result){
        if (err) {

        } else {
            if (result) {
                res.json({err:2})   //用户已存在
            } else {
                db.save(data,null,function(err,result){
                    if (err) {

                    } else {
                        res.json(data)
                    }

                })

            }
        }

    })


});

//删除用户
router.post('/delete', function(req, res, next) {
    var uid = req.body.uid;

    var db = db_proxy.mongo.collection("users");

    db.deleteOne({uid:uid},null,function(err,result){
        if (err) {

        } else {
            res.json({ok:1});
        }

    })


});

//修改
router.post('/edit', function(req, res, next) {
    var data = req.body;

    var db = db_proxy.mongo.collection("users");

    db.updateOne({uid:data.uid},
        {$set:{pwd:data.pwd,right:data.right}},
        function(err,result){
            if (err) {

            } else {
                res.json(data);
            }

        }
    )
});

router.post('/signOn',function(req,res,next){
    var password = req.body.pwd
    var userName = req.body.uid
    var db = db_proxy.mongo.collection("users");
    db.findOne({uid:userName},
        null,
        null,
        function(err,item){
            if (err) {
                res.json({ok:0});
            } else {
                if(item){
                    db.findOne({uid:userName,pwd:password},null,null,function(err,item){
                        if(err){
                            res.json({ok:0});
                        }else{
                            if(item){
                                res.json({ok:1,d:item});
                            }else{
                                res.json({ok:3}); //密码错误
                            }
                        }
                    })
                }else{
                    res.json({ok:2}); //用户名无效
                }

            }

        }
    )
})

module.exports = router;