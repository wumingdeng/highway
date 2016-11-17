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

api.run = function () {
    // cst.init()
    // fa.init()
    // pcf.init()
    // pfit.init()
    rcwi.init()

    npt.onInitClclt()
    // try {
    // } catch (e) {
    //     console.log('error..');
    // }


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

    //投资财务现金流量
    cashFlow.init()

    pfit.onCalculateProfitSums()

    // 财务计划流量
    pcf.onClcltRacf()
    pcf.onClcltIacf()
    pcf.onClcltSm()

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
    income.run();
    ctif.init();
    npt.saveData(ctif, cashFlow)
}


module.exports = api