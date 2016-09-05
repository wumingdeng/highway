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
//TODO 算合计按照20年统计
function onCalculateVat(){
    var vatSum = 0
    for(var year=0;year<MAX_YEAR;year++){
        var tempVat = chargeIncomes[year] * taxationRate
        if(year < 20) {
            vatSum = vatSum + tempVat
        }
        vats.push(tempVat)
    }
    vats['sum'] = vatSum
}

//利润总额
function onCalculateProfitSums(){
    var tempSum = 0
    for(var year=0;year<MAX_YEAR;year++){
        var temp = chargeIncomes[year] - vats[year] - sumCosts[year] + diyanIncomes[year] - others[year]
        if(year < 20) {
            tempSum = tempSum + temp
        }
        profitSums.push(temp)
    }
    profitSums['sum'] = tempSum
}

//应缴纳所得税
function onCalculateSelfTaxations(){
    var tempSum = 0
    for(var year=0;year<MAX_YEAR;year++){
        var temp = 0
        if(profitSums[year] - makeUpLoseMoneys[year]>0){
            temp = profitSums[year] - makeUpLoseMoneys[year]
        }
        if(year < 20) {
            tempSum = tempSum + temp
        }
        selfTaxations.push(temp)
    }
    selfTaxations['sum'] = tempSum
}
//所得税
function onCalculateTaxation(){
    var tempSum = 0
    for(var year=0;year<MAX_YEAR;year++){
        var temp = selfTaxations[year] * selfTaxationRate
        if(year < 20) {
            tempSum = tempSum + temp
        }
        Taxations.push(temp)
    }
    Taxations['sum'] = tempSum
}
//profits
function onCalculateProfits(){
    var tempSum = 0
    for(var year=0;year<MAX_YEAR;year++){
        var temp = profitSums[year] - Taxations[year]
        if(year < 20) {
            tempSum = tempSum + temp
        }
        profits.push(temp)
    }
    profits['sum'] = tempSum
}
//interestBeforeProfits
function onCalcluateInterestBeforeProfits(){
    var tempSum = 0
    for(var year=0;year<MAX_YEAR;year++){
        var temp = profits[year] + interestExpends[year] - diyanIncomes[year]
        if(year < 20) {
            tempSum = tempSum + temp
        }
        interestBeforeProfits.push(temp)
    }
    interestBeforeProfits['sum'] = tempSum
}
//interestDepreciateBeforeProfits
function onCalculateInterestDepreciateBeforeProfits(){
    var tempSum = 0
    for(var year=0;year<MAX_YEAR;year++){
        var temp = interestBeforeProfits[year] + depreciates[year] + promoteSales[year]
        if(year < 20) {
            tempSum = tempSum + temp
        }
        interestDepreciateBeforeProfits.push(temp)
    }
    interestDepreciateBeforeProfits['sum'] = tempSum
}