/**
 * Created by Fizzo on 16/9/2.
 */
var pfit = {}
var fa = require("./fixedAssets.js")
var npt = require("./inputTable.js")
var cst = require("./cost.js")
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
pfit.onCalculateProfitSums = function(){
    var tempSum = 0
    for(var year=0;year<npt.OLC_YEAR;year++){
        var temp = fa.chargeIncomes[year] - pfit.vats[year] - cst.sumCosts[year] + pfit.diyanIncomes[year] - pfit.others[year]
        if(year < 20) {
            tempSum = tempSum + temp
        }
        pfit.profitSums.push(temp)
    }
    pfit.profitSums['sum'] = tempSum
}

//应缴纳所得税
pfit.onCalculateSelfTaxations = function(){
    var tempSum = 0
    for(var year=0;year<npt.OLC_YEAR;year++){
        var temp = 0
        if(pfit.profitSums[year] - pfit.makeUpLoseMoneys[year]>0){
            temp = pfit.profitSums[year] - pfit.makeUpLoseMoneys[year]
        }
        if(year < 20) {
            tempSum = tempSum + temp
        }
        pfit.selfTaxations.push(temp)
    }
    pfit.selfTaxations['sum'] = tempSum
}
//所得税
pfit.onCalculateTaxation = function(){
    var tempSum = 0
    for(var year=0;year<npt.OLC_YEAR;year++){
        var temp = pfit.selfTaxations[year] * pfit.selfTaxationRate
        if(year < 20) {
            tempSum = tempSum + temp
        }
        pfit.incomeTax.push(temp)
    }
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
//interestDepreciateBeforeProfits\
pfit.onCalculateInterestDepreciateBeforeProfits = function(){
    var tempSum = 0
    for(var year=0;year<npt.OLC_YEAR;year++){
        var temp = pfit.intstBfPrfits[year] + fa.depreciates[year] + cst.promoteSales[year]
        if(year < 20) {
            tempSum = tempSum + temp
        }
        pfit.intstDpcitBfPrfits.push(temp)
    }
    pfit.intstDpcitBfPrfits['sum'] = tempSum
}

module.exports = pfit