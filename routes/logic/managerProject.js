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
var cst = require('../clclt/cost')
var pft = require('../clclt/profit')
var pcf = require('../clclt/plannedCashFlow')
var inf = require('../clclt/investFlow')
var cf = require('../clclt/cashFlow')
var rmc = require('../clclt/runManageCost')
var income = require('../clclt/incomeTable')

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

    rmc.manageCostRate = npt.manageCostRate = Number(body.mcf) // 管理费年增长率
    rmc.bigFixCostRate =  npt.bigFixCostRate = Number(body.bfr) // 大维修费的年增长率
    rmc.middleFixCostRate = npt.middleFixCostRate = Number(body.mfr) // 中维修费的年增长率
    rmc.maintainCostRate =npt.maintainCostRate = Number(body.mtcr) // 养护费用增长率
    rmc.machineCostRate = npt.machineCostRate = Number(body.mcr) // 养护费用增长率
    rmc.tunnelMachineCostRate = npt.tunnelMachineCostRate = Number(body.tmct) // 隧道机电维修的年增长率
    rmc.serviceCostRate =npt.serviceCostRate = Number(body.sct) // 服务费的年增长率
    rmc.BIG_FIX_MAX_YEAR = npt.BIG_FIX_MAX_YEAR = Number(body.bfy) // 大修年限
    rmc.MIDDLE_FIX_MAX_YEAR =npt.MIDDLE_FIX_MAX_YEAR = Number(body.mfy) // 中修年限
    npt.XLS = Number(body.xls) // 里程折算系数

    var yt = 0
    while(true){
        if(body['y_'+yt]){
            if(yt==0) income.beginYear = body['y_'+yt]
            var arr = [Number(body['k1_'+yt]),Number(body['k2_'+yt]),Number(body['k3_'+yt]),Number(body['k4_'+yt]),Number(body['h1_'+yt]),Number(body['h2_'+yt]),Number(body['h3_'+yt]),Number(body['h4_'+yt]),Number(body['h5_'+yt])]
            npt.ycbl[body['y_'+yt]] = arr
            npt.jtl[body['y_'+yt]] = [Number(body['jtl_'+yt])]
            yt++
        }else{
            break
        }
    }
    for(var i=0;i<3;i++){
        var tempArr = [Number(body['xsk1_'+i]),Number(body['xsk2_'+i]),Number(body['xsk3_'+i]),Number(body['xsk4_'+i]),Number(body['xsh1_'+i]),Number(body['xsh2_'+i]),Number(body['xsh3_'+i]),Number(body['xsh4_'+i]),Number(body['xsh5_'+i])]
       if(i == 0){
           npt.zsxs = tempArr
       }else if(i==1){
           npt.XSL =  tempArr
       }else if(i==2){
           npt.sfbz = tempArr
       }
    }
    var yr = 1
    while(true){
        if(body['jsq'+yr] && body['dktr'+yr]){
            npt.JSTZ[yr-1]=Number(body['jsq'+yr])
            npt.DKTRB[yr-1]=Number(body['dktr'+yr])
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
                // gvr.d.on('error', function (err) {
                //     console.error(err)
                //     if(res.finished) return
                //     res.json({ok:0})
                // });
                onClcltNpt(body)
                api.init()
                api.run()
                res.json({ok:1})
            }
        }
    )
});

router.post('/updateProject', function(req, res, next) {
    var body = req.body;
    var modifyName = req.cookies.cn
    var nowDt = new Date().getTime()

    //从数据库取数据
    gvr.projectName = body.pn
    var db = db_proxy.mongo.collection("project");
    db.findOne({pn:body.pn},null,null,function(err,result) {
        if (err) {
            res.json({err: 1})
        } else {
            var inpArg =  result.arg
            inpArg.ztz =  body.invest //总投资
            inpArg.gndklx = body.gndklx //国内贷款利息

            inpArg.dklx5y = body.dklx5y //贷款五年以上利率
            inpArg.dkll = body.dkll  //短期贷款利率(一年内)

            inpArg.jcbl = body.jcbl //价差的比例
            inpArg.jcsl = body.jcsl //价差税率

            inpArg.sglrb = body.sglrbl //施工利润比例
            inpArg.sglrsl = body.sglrsl //施工利润税率
            inpArg.dfbz = body.dfbz //地方补助
            inpArg.bbbbl = body.bbzbl //部补助比例
            inpArg.jzzxl = body.jzzxl // 基准折现率
            inpArg.jaf = body.jaf // 建安费
            inpArg.xfbl = body.xfbl // 浮动比例

            db.updateOne({pn: body.pn}, {$set:{arg: inpArg, cn: modifyName, dt: nowDt}}, null, function (err, item) {
                if (err) {
                    console.log("数据写入失败")
                } else {
                    res.json({ok: 1})
                    onClcltNpt(inpArg)
                    api.init()
                    api.run();
                }
            })
        }
    })
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
                        api.init()
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

router.post('/saveGlobal', function(req, res, next) {
    var body = req.body;

    var db = db_proxy.mongo.collection("global");
    db.updateOne({},body,{upsert:true},function(err,item){
        if (err) {
            res.json({ok: 0})
        }
        else {
            res.json({ok: 1,d:item})
        }

    })
});

router.get('/getGlobal', function(req, res, next) {
    var db = db_proxy.mongo.collection("global");
    db.find({},{}).toArray(function(err,result){
        if (err) {
            res.json({ok: 0})
        }
        else {
            res.json(result[0])
        }

    })
});


/**
 * (成本表): 水利基金
 * (利润表): 递延收益,其他
 * (融资前投资财务现金流量): 回收资产余值,  流动资金,水利基金
 * (财务计划表): 增值税销项税额,其他流出(水利基金）,维持运营投资,流动资金,其他流出,流动资金借款,债券,应付利润（股利分配）,其他流出
 */
router.post('/updateWithCell', function(req, res, next) {
    var cell = req.body
    var ln = cell.ln
    var rn = cell.rn
    api.init()
    function onReloadData(){
        var tempArr = []
        for(var idx in cell){
            if(idx.indexOf('b')==0){
                tempArr.push(Number(cell[idx]))
            }else if(idx.indexOf('r')==0){
                tempArr.push(Number(cell[idx]))
            }
        }
        return tempArr
    }
    switch(ln){
        case "gdzc":
            break;
        case "cbb":
            var tempArr = onReloadData()
            if(rn=="水利基金"){
                cst.irrigationFunds = tempArr
            }else if(rn=="推销费用"){
                cst.promoteSales = tempArr
            }else{
                res.json({ok:0})
                return
            }
            break;
        case "lrb":
            var tempArr = onReloadData()
            if(rn=="递延收益"){
                pft.diyanIncomes = tempArr
            }else if(rn=="其他") {
                pft.others = tempArr
            }else{
                res.json({ok:0})
                return
            }
            break;
        case "xjll":
            var tempArr = onReloadData()
            if(rn=="水利基金"){
                tempArr.splice(0,4)
                cst.irrigationFunds = tempArr
            }else if(rn=="回收资产余值") {
                cf.hszcyz = tempArr
            }else if(rn=="流动资金") {
                cf.ldzj = tempArr
            }else{
                res.json({ok:0})
                return
            }
            break;
        case "pcf":
            var tempArr = onReloadData()
            if(rn=="增值税销项税额"){
                pcf.inputVAT = tempArr
            }else if(rn=="其他流出(水利基金)") {
                tempArr.splice(0,4)
                console.log(tempArr)
                cst.irrigationFunds = tempArr
            }else if(rn=="维持运营投资") {
                pcf.keepRunInvest = tempArr
            }else if(rn=="流动资金") {

                pcf.operatingFunds = tempArr
            }else if(rn=="其他流出" && cell.num == "2.2.4") {
                pcf.otherOut_2 = tempArr
            }else if(rn=="流动资金借款") {
                pcf.flowCashLaon = tempArr
            }else if(rn=="债卷") {
                pcf.bonds = tempArr
            }else if(rn=="应付利润") {
                pcf.profitPay = tempArr
            }else if(rn=="其他流出" && cell.num == "3.2.5") {
                pcf.otherOut_3 = tempArr
            }else{
                res.json({ok:0})
                return
            }
            break;
        default:
            res.json({ok:0})
            return;
    }
    var db = db_proxy.mongo.collection("project");
    db.findOne({pn:gvr.projectName},null,null,function(err,item){
        if (err) {
            res.json({err:1})
        } else {
            onClcltNpt(item.arg)
            api.run()
            res.json({ok:1})
        }
    })

});

module.exports = router;