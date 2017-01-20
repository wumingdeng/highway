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
var cinf = require('../clclt/CTInvestFlow')
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
    npt.ZYZJ = Number(body.ziyouzijin)/100//自有资金比
    npt.CAPITAL_PT = Number(body.zbjgc)/100 //资本金比
    npt.LOAN_YEAR = 19 //贷款年限
    npt.DF = Number(body.df)/100 //地方
    npt.TZ = Number(body.tz)//投资
    npt.LX = Number(body.lx)//利息
    npt.SR = Number(body.sr)//收入
    npt.BUILD_YEAR = Number(body.buildSel) //建设期
    npt.OLC_YEAR  =  Number(body.yyq) //运营期
    npt.LENGTH = Number(body.qc) //全厂
    npt.INTEREST_RT_1 = Number(body.dklx5y)/100 //贷款五年以上利率
    npt.INTEREST_RT_2 = Number(body.dkll)/100 //短期贷款利率(一年内)
    npt.FIXEASSETS_BALANCE = Number(body.fab)
    npt.PRICE_DIF_PT = Number(body.jcbl)/100 //价差的比例
    npt.PRICE_DIF_TAX_RT = Number(body.jcsl)/100 //价差税率

    // npt.GNLL = npt.INTEREST_RT_1 * npt.LX //国内利率
    npt.BUILD_PROFIT_PT = Number(body.sglrb)/100 //施工利润比例
    npt.BUILD_PROFIT_TAX_RT = Number(body.sglrsl)/100 //施工利润税率
    npt.VAT = Number(body.zzs)/100 //增值税

    npt.CT = Number(body.zj)/100 //中交
    npt.CT_RUN_DIS_PT = Number(body.yyqzjfh)/100 //中交运营期分红比例
    npt.CDB_FUND_INTEREST_RT = Number(body.gkhjjll)/100 //国开行基金利率
    npt.CDB_FUND_PT = Number(body.gkhjjbl)/100 //国开基金比例
    npt.LOCAL_GRANT = Number(body.dfbz) //地方补助
    npt.PART_GRANT_PT = Number(body.bbbbl)/100 //部补助比例
    npt.BASE_DISCOUNT_RT = Number(body.jzzxl)/100 // 基准折现率
    npt.INCONE_TAX = Number(body.sds)/100 //所得税
    npt.TURNOVER_TAX = Number(body.lzs)/100 //流转税
    npt.BUILD_SETTLEMENT_M = Number(body.jaf) // 建安费
    npt.FLOAT_RT = Number(body.xfbl)/100 // 浮动比例
    npt.LOAN_MOUDlE = body.moduleSel //冲减模式

    rmc.manageCostRate = npt.manageCostRate = Number(body.mcf)/100 // 管理费年增长率
    rmc.bigFixCostRate =  npt.bigFixCostRate = Number(body.bfr)/100 // 大维修费的年增长率
    rmc.middleFixCostRate = npt.middleFixCostRate = Number(body.mfr)/100 // 中维修费的年增长率
    rmc.maintainCostRate =npt.maintainCostRate = Number(body.mtcr)/100 // 养护费用增长率
    rmc.machineCostRate = npt.machineCostRate = Number(body.mcr)/100 // 养护费用增长率
    rmc.tunnelMachineCostRate = npt.tunnelMachineCostRate = Number(body.tmct)/100 // 隧道机电维修的年增长率
    rmc.serviceCostRate =npt.serviceCostRate = Number(body.sct)/100 // 服务费的年增长率
    rmc.BIG_FIX_MAX_YEAR = npt.BIG_FIX_MAX_YEAR = Number(body.bfy) // 大修年限
    rmc.MIDDLE_FIX_MAX_YEAR = npt.MIDDLE_FIX_MAX_YEAR = Number(body.mfy) // 中修年限

    rmc.MANAGE_COST = Number(body.yyf) //2000管理费用
    rmc.MAINTAIN_COST = Number(body.yhf)//1605//养护费用
    rmc.MACHINE_COST = Number(body.jdf)//0 //机电维修费
    rmc.TUNNEL_LIGHT_COST = Number(body.sdzmf)//0//隧道照明费用
    rmc.MIDDLE_FIX_COST = Number(body.sjzxf)//0//中修费用
    rmc.BIG_FIX_COST = Number(body.sjdxf)//0//大修费用
    rmc.SERVICE_COST = Number(body.fwf)//0//服务费

    var yt = 0
    while(true){
        if(body['y_'+yt]){
            if(yt==0) income.beginYear = Number(body['y_'+yt])
            income.endYear = Number(body['y_'+yt])
            var arr = [Number(body['k1_'+yt]),Number(body['k2_'+yt]),Number(body['k3_'+yt]),Number(body['k4_'+yt]),Number(body['h1_'+yt]),Number(body['h2_'+yt]),Number(body['h3_'+yt]),Number(body['h4_'+yt]),Number(body['h5_'+yt])]
            npt.ycbl[body['y_'+yt]] = arr
            npt.jtl[body['y_'+yt]] = [Number(body['jtl_'+yt])]
            yt++
        }else{
            break
        }
    }

    var sfy = 0
    while(true){
        if(body['sfy_'+sfy]){
            var arr = [Number(body['sfk1_'+sfy]),Number(body['sfk2_'+sfy]),Number(body['sfk3_'+sfy]),Number(body['sfk4_'+sfy]),Number(body['sfh1_'+sfy]),Number(body['sfh2_'+sfy]),Number(body['sfh3_'+sfy]),Number(body['sfh4_'+sfy]),Number(body['sfh5_'+sfy])]
            npt.sfbz[body['sfy_'+sfy]] = arr
            sfy++
        }else{
            break
        }
    }

    for(var i=0;i<2;i++){
        var tempArr = [Number(body['xsk1_'+i]),Number(body['xsk2_'+i]),Number(body['xsk3_'+i]),Number(body['xsk4_'+i]),Number(body['xsh1_'+i]),Number(body['xsh2_'+i]),Number(body['xsh3_'+i]),Number(body['xsh4_'+i]),Number(body['xsh5_'+i])]
       if(i == 0){
           npt.zsxs = tempArr
       }else if(i==1){
           npt.XSL =  tempArr // 里程折算系数
       }else if(i==2){
           
       }
    }
    var yr = 1
    while(true){
        if(body['jsq'+yr] && body['dktr'+yr]){
            npt.JSTZ[yr-1]=Number(body['jsq'+yr])/100
            npt.DKTRB[yr-1]=Number(body['dktr'+yr])/100
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
                res.json({ok:0})
            } else {
                gvr.d.on('error', function (err) {
                    console.error(err)
                    if(res.finished) return
                    res.json({ok:0})
                });
                if(item.upsertedId){
                    gvr.projectName = item.upsertedId
                    console.log('创建了项目')
                }
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
            inpArg.yyq =  body.yyq //运营期
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
                    onClcltNpt(inpArg)
                    api.init()
                    api.run();
                    var outObj = {}
                    outObj.loanYear = gvr.loanYear
                    outObj.firr30 = cf.irr30
                    outObj.npv30 = cf.npv30
                    outObj.pt = cf.tzhsq
                    outObj.zbj30 = cinf.irr30
                    outObj.localSubSum = npt.localSubSum
                    outObj.projectInvestSums = npt.projectInvestSums
                    outObj.bbbbl = npt.PART_GRANT_PT
                    res.json({ok: 1,out:outObj})
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
    var _rn = cell.ln+'_'+cell.rn

    switch(cell.ln){
        case "gdzc":
            break;
        case "cbb":
            if(cell.rn=="水利基金"){
            }else if(cell.rn=="推销费用"){
            }else{
                res.json({ok:0})
                return
            }
            break;
        case "lrb":
            if(cell.rn=="递延收益"){
            }else if(cell.rn=="其他") {
            }else{
                res.json({ok:0})
                return
            }
            break;
        case "xjll":
            if(cell.rn=="水利基金"){
            }else if(cell.rn=="回收资产余值") {
            }else if(cell.rn=="流动资金") {
            }else{
                res.json({ok:0})
                return
            }
            break;
        case "pcf":
            if(cell.rn=="增值税销项税额"){
            }else if(cell.rn=="其他流出(水利基金)") {
            }else if(cell.rn=="维持运营投资") {
            }else if(cell.rn=="流动资金") {
            }else if(cell.rn=="其他流出" && cell.num == "2.2.4") {
            }else if(cell.rn=="流动资金借款") {
            }else if(cell.rn=="债卷") {
            }else if(cell.rn=="应付利润") {
            }else if(cell.rn=="其他流出" && cell.num == "3.2.5") {
            }else{
                res.json({ok:0})
                return
            }
            break;
        default:
            res.json({ok:0})
            return;
    }

    delete cell.id
    delete cell.rn
    delete cell.num
    delete cell.oper
    delete cell.ln
    
    var editdb = db_proxy.mongo.collection("edit");
    editdb.updateOne({pn:gvr.projectName,rn:_rn},{$set:{arg:cell}},{upsert:true},function(err,item){
        if (err) {
            res.json({err:1})
        } else {
            var projectdb = db_proxy.mongo.collection("project");
            projectdb.findOne({pn:gvr.projectName},null,null,function(err,item){
                if (err) {
                    res.json({err:1})
                } else {
                    onClcltNpt(item.arg)
                    function cbFun(){
                        api.run()
                        res.json({ok:1})
                    }
                    api.init(cbFun)
                }
            })
        }
    })
     
    
   

});

module.exports = router;