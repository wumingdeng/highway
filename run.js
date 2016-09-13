/**
 * Created by Fizzo on 16/9/9.
 */



require("./public/javascripts/incomeTable.js")
require("./public/javascripts/runManageCost.js")
var fa = require("./public/javascripts/fixedAssets.js")
var pfit = require("./public/javascripts/profit.js")
var cashFlow = require("./public/javascripts/cashFlow.js")
var pcf = require("./public/javascripts/plannedCashFlow.js")
var cst = require("./public/javascripts/cost.js")
var inf = require("./public/javascripts/investFlow.js")


//固定资产
fa.onChargeIncomes()
fa.onCalculateDepreciate()

//利润表
pfit.onCalculateVat()
pfit.onCalculateMulm()
// pfit.onCalculateProfitSums()

cst.onCalculateRunCost()

// 财务计划流量
pcf.onClcltShortLoan()


pfit.onCalculateSelfTaxations()
pfit.onCalculateTaxation()
pfit.onCalculateProfits()

// pfit.onCalcluateInterestBeforeProfits()
// pfit.onCalculateInterestDepreciateBeforeProfits()





//还本付息表
// rcwi.onCalculateBorrowMoneyBalanceBefore_1()
// rcwi.onCalculateBorrowMoneyBalance()

//投资财务现金流量
cashFlow.init()


pfit.onCalculateProfitSums()

// 财务计划流量
pcf.onClcltRacf()
pcf.onClcltIacf()
pcf.onClcltFacf()
pcf.onClcltSm()

//资本金流量
inf.onInit()