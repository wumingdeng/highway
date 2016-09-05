/**
 * Created by Fizzo on 16/9/2.
 */
var taxationRate = 0.05 //税率
var selfTaxationRate = 0.25 //所得税税率
var vats = [] //增值税
var diyanIncomes = [] // 递延收益
var others = [] //其他
var profitSums = [] //利润总额
//TODO
var makeUpLoseMoneys = [] //弥补亏损
var selfTaxations = [] //应缴纳所得税
var Taxations = [] //所得税
var profits = [] //净利润
var interestBeforeProfits = [] //息税签利润
var interestDepreciateBeforeProfits = [] //息税折旧前利润


//增值税
function onCalculateVat(){
    for(var year=0;year<MAX_YEAR;year++){
        vats.push(chargeIncomes[year] * taxationRate)
    }
}

//利润总额
function onCalculateProfitSums(){
    for(var year=0;year<MAX_YEAR;year++){
        var temp = chargeIncomes[year] - vats[year] - sumCosts[year] + diyanIncomes[year] - others[year]
        profitSums.push(temp)
    }
}

//应缴纳所得税
function onCalculateSelfTaxations(){
    for(var year=0;year<MAX_YEAR;year++){
        var temp = 0
        if(profitSums[year] - makeUpLoseMoneys[year]>0){
            temp = profitSums[year] - makeUpLoseMoneys[year]
        }
        selfTaxations.push(temp)
    }
}
//所得税
function onCalculateTaxation(){
    for(var year=0;year<MAX_YEAR;year++){
        var temp = selfTaxations[year] * selfTaxationRate
        Taxations.push(temp)
    }

}
//profits
function onCalculateProfits(){
    for(var year=0;year<MAX_YEAR;year++){
        var temp = profitSums[year] - Taxations[year]
        profits.push(temp)
    }
}
//interestBeforeProfits
function onCalcluateInterestBeforeProfits(){
    for(var year=0;year<MAX_YEAR;year++){
        var temp = profits[year] + interestExpends[year] - diyanIncomes[year]
        interestBeforeProfits.push(temp)
    }
}
//interestDepreciateBeforeProfits
function onCalculateInterestDepreciateBeforeProfits(){
    for(var year=0;year<MAX_YEAR;year++){
        var temp = interestBeforeProfits[year] + depreciates[year] + promoteSales[year]
        interestDepreciateBeforeProfits.push(temp)
    }
}