/**
 * Created by Fizzo on 16/9/2.
 */

var fa = require("./fixedAssets.js")
var npt = require("./inputTable.js")
var rmc = require("./runManageCost.js")
var cst = {}

cst.runCosts = [] //经营成本
cst.interestExpends = [] //利息支出 长期借款利息 + 短期借款利息
cst.loanLongs = [] //长期借款利息 还本付息表
cst.loanShorts = []//短期借款利息 财务计划流量
cst.promoteSales = [] //推销费用
//TODO 没有具体数据
cst.irrigationFunds = [] //水利基金
cst.sumCosts = [] //总成本费用

cst.onCalculateRunCost = function() {
    for (var year = 0; year < npt.OLC_YEAR; year++) {
        var sum = rmc.realityBigFixCosts[year] + rmc.realityMiddleFixCosts[year] + rmc.machineFixCosts[year] + rmc.manageCosts[year] + rmc.maintainCosts[year] + rmc.serviceCosts[year]
        cst.runCosts.push(sum)
    }
}

cst.onCalculateInterestExpend = function(){
    for(var year = 0 ;year<npt.OLC_YEAR;year++){
        cst.interestExpends.push(cst.loanLongs[year]+cst.loanShorts[year])
    }
}

//TODO 运营管理费用表 49行 什么鬼
cst.CalculateIrrigationFund = function(){
    cst.irrigationFunds.push()
}

cst.onCalculateSumCost = function(){
    for(var year = 0 ;year<npt.OLC_YEAR;year++){
        var sum = cst.runCosts[year] + fa.depreciates[year]+cst.interestExpends[year] + cst.irrigationFunds[year]
        cst.sumCosts.push(sum)
    }
}

cst.clclt = function(){
    cst.onCalculateRunCost()
    cst.onCalculateInterestExpend()
    cst.CalculateIrrigationFund()
    cst.onCalculateSumCost()
}
module.exports = cst