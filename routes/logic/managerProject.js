/**
 * Created by Fizzo on 16/9/30.
 */

var express = require('express');
var router = express.Router();
var db_proxy = require('../../utils/dbconnectorS');
var gvr = require('../../utils/globalVar');
var npt = require('../clclt/inputTable');
var ob = require('mongodb').ObjectID;
var api = require('../clclt/run')

router.get('/getProject', function(req, res, next) {
    var limit = req.query.limit
    var offset = req.query.offset
    var db = db_proxy.mongo.collection("project");
    db.find({},{pn:1,cn:1,dt:1,_id:1}).skip(Number(offset)).limit(Number(limit)).sort({dt:-1}).toArray(
        function(err,result){
            if (err) {
                res.json({err:1})
            } else {
                db.find().count(function(err,count){
                    if(err){
                        res.json({
                            total:0,
                            rows:result
                        })
                    }else{
                        res.json({
                            total:count,
                            rows:result
                        })
                    }
                })
            }
        }
    )
});

router.get('/getProjectByName', function(req, res, next) {
    //从数据库取数据
    //var dbHelper = require("../utils/dbHelper.js")
    var pn = req.query.pn
    gvr.projectName=pn
    var db = db_proxy.mongo.collection("project");
    db.findOne({pn:pn},null,null,function(err,result){
        if (err) {
            res.json({err:1})
        } else {
            res.json({
                rows:result
            })
        }
    })
});

function onClcltNpt(body){
    npt.ZTZ = Number(body.ztz) //总投资
    npt.GNDKLX = Number(body.gndklx) //国内贷款利息
    // npt.ZYZJ = body. //自有资金比
    npt.CAPITAL_PT = Number(body.zbjgc) //资本金比
    npt.LOAN_YEAR = 19 //贷款年限
    npt.DF = Number(body.df) //地方
    npt.TZ = Number(body.tz)//投资
    npt.LX = Number(body.lx)//利息
    npt.SR = Number(body.sr)//收入
    npt.BUILD_YEAR = Number(body.buildSel) //建设期
    npt.OLC_YEAR  =  Number(body.yyq) //运营期
    npt.LENGTH = Number(body.qc) //全厂
    npt.INTEREST_RT_1 = Number(body.dklx5y) //贷款五年以上利率
    npt.INTEREST_RT_2 = Number(body.dkll) //短期贷款利率(一年内)

    npt.PRICE_DIF_PT = Number(body.jcbl) //价差的比例
    npt.PRICE_DIF_TAX_RT = Number(body.jcsl) //价差税率

    // npt.GNLL = npt.INTEREST_RT_1 * npt.LX //国内利率
    npt.BUILD_PROFIT_PT = Number(body.sglrb) //施工利润比例
    npt.BUILD_PROFIT_TAX_RT = Number(body.sglrsl) //施工利润税率
    npt.VAT = Number(body.zzs) //增值税

    npt.CT = Number(body.zj) //中交
    npt.CT_RUN_DIS_PT = Number(body.yyqzjfh) //中交运营期分红比例
    npt.CDB_FUND_INTEREST_RT = Number(body.gkhjjll) //国开行基金利率
    npt.CDB_FUND_PT = Number(body.gkhjjbl) //国开基金比例
    npt.LOCAL_GRANT = Number(body.dfbz) //地方补助
    npt.PART_GRANT_PT = Number(body.bbbbl) //部补助比例
    npt.BASE_DISCOUNT_RT = Number(body.jzzxl) // 基准折现率
    npt.INCONE_TAX = Number(body.sds) //所得税
    npt.TURNOVER_TAX = Number(body.lzs) //流转税
    npt.BUILD_SETTLEMENT_M = Number(body.jaf) // 建安费
    npt.FLOAT_RT = Number(body.xfbl) // 浮动比例
    npt.LOAN_MOUDlE = body.moduleSel //冲减模式
    var yr = 1
    while(true){
        if(body.hasOwnProperty('jsq'+yr) && body.hasOwnProperty('dktr'+yr)){
            npt.JSTZ.push(Number(body['jsq'+yr]))
            npt.DKTRB.push(Number(body['dktr'+yr]))
            yr++
        }else{
            break
        }
    }
}

router.post('/saveProject', function(req, res, next) {
    var body = req.body;
    var pn = body.pn
    var cn = body.cn

    var nowDt = new Date().getTime()
    delete body.pn
    delete body.cn
    //从数据库取数据
    gvr.projectName = pn
    var db = db_proxy.mongo.collection("project");
    db.updateOne({pn:pn},{arg:body,cn:cn,dt:nowDt,pn:pn},{upsert:true},function(err,item){
            if (err) {
                console.log("数据写入失败")
            } else {
                res.json({ok:1})
                onClcltNpt(body)
                api.run();
            }
        }
    )
});

router.get('/deleteProject', function(req, res, next) {
    var _id = new ob(req.query._id)
    var pn = req.query.pn
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
                var deleteNum = 0
                function deleteCollection(collectionName){
                    var db = db_proxy.mongo.collection(collectionName);
                    db.deleteMany({pn:pn},function(err,d){
                        if(err){
                            res.json({ok:0})
                        }else{
                            deleteNum++
                            if(deleteNum == 11){
                                res.json({ok: 1})
                            }
                        }
                    })
                }
                deleteCollection("car_jds")
                deleteCollection("car_sfsr")
                deleteCollection("car_zss")
                deleteCollection("cbb")
                deleteCollection("gdzc")
                deleteCollection("hbfx")
                deleteCollection("lrb")
                deleteCollection("pcf")
                deleteCollection("xjll")
                deleteCollection("zbjll")
                deleteCollection("zjzbj")
            }
        }
    )
});

router.post('/copyProject', function(req, res, next) {
    var _id = new ob(req.body._id)
    var oldPn = req.body.opn
    var newPn = req.body.pn
    var cn = req.body.cn
    var db = db_proxy.mongo.collection("project");
    db.findOne({pn:oldPn,_id:_id},null,null,function(err,result){
        if (err) {
            res.json({ok: 0})
        }
        else {
            var body = result.arg
            result.pn = newPn
            var nowDt = new Date().getTime()

            db.insertOne({arg:body,cn:cn,dt:nowDt,pn:newPn},null,function (err, item) {
                    if (err) {
                        res.json({ok: 0})
                    }
                    else {
                        gvr.projectName = newPn
                        onClcltNpt(body)
                        api.run();
                        var rsut = item['ops'][0]
                        delete rsut.arg
                        res.json({index:0,row:rsut})
                    }
                }
            )
        }

    })
});

module.exports = router;