/**
 * Created by Fizzo on 16/9/9.
 */


var npt = require("./public/javascripts/inputTable.js")
var income = require("./public/javascripts/incomeTable")
var fa = require("./public/javascripts/fixedAssets")
var pfit = require("./public/javascripts/profit.js")

fa.onChargeIncomes()
fa.onCalculateDepreciate()

//成本表

//利润表
pfit.onCalculateVat()
pfit.onCalculateProfitSums
pfit.onCalculateSelfTaxations
pfit.onCalculateTaxation()

// 财务现金流量表

