/**
 * Created by Fizzo on 16/9/9.
 */


var api = {}
var npt = require("./inputTable.js")
var income = require("./incomeTable.js")
var rmc = require("./runManageCost.js")
var fa = require("./fixedAssets.js")
var pfit = require("./profit.js")
var cashFlow = require("./cashFlow.js")
var pcf = require("./plannedCashFlow.js")
var cst = require("./cost.js")
var inf = require("./investFlow.js")
var rcwi = require('./repayCapitalWithInterest.js')
var ctif = require("./CTInvestFlow.js")
var db_proxy = require('../../utils/dbconnectorS');
var gvr = require('../../utils/globalVar');
var tool = require('../../utils/tool');
var YData = require("./YData.js")

api.initEditVariable = function(callbackfun,editItem){
    function onReloadData(cell,noRun){
        var tempArr = []
        var _sum = 0
        for(var idx in cell){
            var value = Number(cell[idx])
            if(idx.indexOf('b')==0 && !noRun){
                _sum += value
                tempArr.push(value)
            }else if(idx.indexOf('r')==0){
                _sum += value
                tempArr.push(value)
            }
        }
        tempArr['sum'] = _sum
        return tempArr
    }
    function findVariable(ln,rn,num,cell){
        switch(ln){
            case "zbjll":
                var tempArr = onReloadData(cell)
                if(rn=="其他"){
                    inf.other = tempArr
                }else{
                    return
                }
                break;
            case "yygl":
                var tempArr = onReloadData(cell)
                if(rn=="其他"){
                    rmc.other = tempArr
                }else{
                    return
                }
                break;
            case "gdzc":
                break;
            case "cbb":
                var tempArr = onReloadData(cell,true)
                if(rn=="水利基金"){
                    cst.irrigationFunds = tempArr
                }else if(rn=="摊销费"){
                    cst.promoteSales = tempArr
                }else if(rn=="其他" && num=="13"){
                    cst.other = tempArr
                }else if(rn=="其他" && num=="7"){
                    rmc.other = tempArr
                }else if(rn=="摊销费"){
                    cst.promoteSales = tempArr
                }else{
                    return
                }
                break;
            case "lrb":
                var tempArr = onReloadData(cell)
                if(rn=="递延收益"){
                    pfit.diyanIncomes = tempArr
                }else if(rn=="其他") {
                    pfit.others = tempArr
                }else{
                    return
                }
                break;
            case "xjll":
                var tempArr = onReloadData(cell)
                if(rn=="水利基金"){
                    tempArr.splice(0,4)
                    cst.irrigationFunds = tempArr
                }else if(rn=="回收资产余值") {
                    cashFlow.hszcyz = tempArr
                }else if(rn=="流动资金") {
                    cashFlow.ldzj = tempArr
                }else if(rn=="其他"&&num=="2.6") {
                    cashFlow.other_2 = tempArr
                }else if(rn=="其他"&&num=="1.3.2") {
                    cashFlow.other.concat(tempArr)
                }else{
                    return
                }
                break;
            case "pcf":
                var tempArr = onReloadData(cell)
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
                }else if(rn=="其他流出" && num == "2.2.4") {
                    pcf.otherOut_2 = tempArr
                }else if(rn=="流动资金借款") {
                    pcf.flowCashLaon = tempArr
                }else if(rn=="债卷") {
                    pcf.bonds = tempArr
                }else if(rn=="应付利润") {
                    pcf.profitPay = tempArr
                }else if(rn=="其他流出" && num == "3.2.5") {
                    pcf.otherOut_3 = tempArr
                }else if(rn=="增值税") {
                    pcf.VAT = tempArr
                }else{
                    return
                }
                break;
            default:
                return;
        }
    }
    var editdb = db_proxy.mongo.collection("edit");
    editdb.find({pn:gvr.projectName},{}).toArray(function(err,items){
        if (err) {
        } else {
            for(var idx in items){
                var item = items[idx]
                var ln = item.rn.split("_")[0]
                var rn = item.rn.split("_")[1]
                var num = item.rn.split("_")[2] || ""
                findVariable(ln,rn,num,item.arg)
            }
            if(callbackfun)
                callbackfun.call()
        }
    })
}

api.init = function(callbackfun,editItem){
    rcwi.init()
    cashFlow.initVariable()
    cst.initVariable()
    fa.initVariable()
    inf.initVariable()
    pcf.initVariable()
    pfit.initVariable()
    rmc.initVariable()
    api.initEditVariable(callbackfun,editItem)
}
api.run = function () {

    npt.onInitClclt()
    
    income.run();
    //运营管理费
    rmc.onCalculate()
    //固定资产
    fa.onChargeIncomes()
    fa.onCalculateDepreciate()

    //利润表
    pfit.onCalculateVat()
    pfit.onCalculateMulm()

    cst.onCalculateRunCost()

    // 财务计划流量
    pcf.onClcltShortLoan()

    pfit.onCalculateSelfTaxations()
    pfit.onCalculateTaxation()
    pfit.onCalculateProfits()


    pfit.onCalculateProfitSums()

    cst.onSum()
    fa.onSum()

    //投资财务现金流量
    cashFlow.init()

    // 财务计划流量
    pcf.onClcltRacf()
    pcf.onClcltIacf()
    pcf.onClcltSm()

    pfit.onCalucltSum()
    rcwi.onCalculateInterestPayRate()
    rcwi.onCalculatePayInterestRate(pcf)

    //资本金流量
    inf.onInit()
    api.jd = rcwi.onOutput()

    // //中交资本金流量
    // ctif.init();

    fa.saveData()
    cst.saveData();
    pfit.saveData();
    pcf.saveData()
    cashFlow.saveData()

    ctif.init();
    npt.saveData(ctif, cashFlow)
}


module.exports = api