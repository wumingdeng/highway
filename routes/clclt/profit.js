/**
 * Created by Fizzo on 16/9/2.
 */

var fa = require("./fixedAssets.js")
var npt = require("./inputTable.js")
var cst = require("./cost.js")
// var pcf = require("./plannedCashFlow.js")
var pfit = {}
pfit.taxationRate = 0.05 //税率
pfit.selfTaxationRate = 0.25 //所得税税率

pfit.vats = [] //增值税
pfit.diyanIncomes = [] // 递延收益
pfit.others = [] //其他
pfit.profitSums = [] //利润总额
//TODO
pfit.makeUpLoseMoneys = [] //弥补亏损
pfit.selfTaxations = [] //应缴纳所得税
pfit.incomeTax = [] //所得税
pfit.profits = [] //净利润
pfit.intstBfPrfits = [] //息税签利润
pfit.intstDpcitBfPrfits = [] //息税折旧前利润
pfit.totalCostExpenses = [] // 总成本费用


//增值税
//TODO 算合计按照20年统计
pfit.onCalculateMulm = function(){
    var sum = 0
    for(var year=0;year<npt.OLC_YEAR;year++){
        pfit.makeUpLoseMoneys.push(0)
        pfit.diyanIncomes.push(0)
        pfit.others.push(0)
    }
    pfit.makeUpLoseMoneys['sum'] = sum
    pfit.diyanIncomes['sum'] = sum
    pfit.others['sum'] = sum
}
//增值税
//TODO 算合计按照20年统计
pfit.onCalculateVat = function(){
    var vatSum = 0
    for(var year=0;year<npt.OLC_YEAR;year++){
        var tempVat = fa.chargeIncomes[year] * pfit.taxationRate
        if(year < 20) {
            vatSum = vatSum + tempVat
        }
        pfit.vats.push(tempVat)
    }
    pfit.vats['sum'] = vatSum
}

//利润总额
var tempSum = 0
pfit.onCalculateProfitSums = function(yr){
    var temp = fa.chargeIncomes[yr] - pfit.vats[yr] - cst.sumCosts[yr] + pfit.diyanIncomes[yr] - pfit.others[yr]
    if(yr < 20) {
        tempSum = tempSum + temp
    }
    pfit.profitSums.push(temp)
    pfit.profitSums['sum'] = tempSum
}

//应缴纳所得税
var tempSum = 0
pfit.onCalculateSelfTaxations = function(yr){
    var temp = 0
    if(pfit.profitSums[yr] - pfit.makeUpLoseMoneys[yr]>0){
        temp = pfit.profitSums[yr] - pfit.makeUpLoseMoneys[yr]
    }
    if(yr < 20) {
        tempSum = tempSum + temp
    }

    pfit.selfTaxations.push(temp)
    pfit.selfTaxations['sum'] = tempSum
}
//所得税
var tempSum = 0
pfit.onCalculateTaxation = function(yr){

    // for(var year=0;year<npt.OLC_YEAR;year++){
        var temp = pfit.selfTaxations[yr] * pfit.selfTaxationRate
        if(yr < 20) {
            tempSum = tempSum + temp
        }
        pfit.incomeTax.push(temp)
    // }

    pfit.incomeTax['sum'] = tempSum
}
//profits
pfit.onCalculateProfits = function(){

    var tempSum = 0
    for(var year=0;year<npt.OLC_YEAR;year++){
        var temp = pfit.profitSums[year] - pfit.incomeTax[year]
        if(year < 20) {
            tempSum = tempSum + temp
        }
        pfit.profits.push(temp)
    }
    pfit.profits['sum'] = tempSum
}
//interestBeforeProfits
pfit.onCalcluateInterestBeforeProfits = function(){
    var tempSum = 0
    for(var year=0;year<npt.OLC_YEAR;year++){
        var temp = pfit.profits[year] + cst.interestExpends[year] - pfit.diyanIncomes[year]
        if(year < 20) {
            tempSum = tempSum + temp
        }
        pfit.intstBfPrfits.push(temp)
    }
    pfit.intstBfPrfits['sum'] = tempSum
}

module.exports = pfit