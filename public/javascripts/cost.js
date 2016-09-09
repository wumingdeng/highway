/**
 * Created by Fizzo on 16/9/2.
 */
var cst = {}

cst.runCosts = [] //经营成本
cst.interestExpends = [] //利息支出 长期借款利息 + 短期借款利息
cst.loanLongs = [] //长期借款利息 还本付息表
cst.loanShorts = []//短期借款利息 财务计划流量
cst.promoteSales = [] //推销费用
//TODO 没有具体数据
cst.irrigationFunds = [] //水利基金
cst.sumCosts = [] //总成本费用

function onCalculateRunCost() {
    for (var year = 1; year < MAX_YEAR; year++) {
        var sum = realityBigFixCosts[year] + realityMiddleFixCosts[year] + machineFixCosts[year] + manageCosts[year] + maintainCosts[year] + serviceCosts[year]
        cst.runCosts.push(sum)
    }
}

function onCalculateInterestExpend(){
    for(var year = 0 ;year<MAX_YEAR;year++){
        cst.interestExpends.push(cst.loanLongs[year]+cst.loanShorts[year])
    }
}

//TODO 运营管理费用表 49行 什么鬼
function onCalculateIrrigationFund(){
    cst.irrigationFunds.push()
}

function onCalculateSumCost(){
    for(var year = 0 ;year<MAX_YEAR;year++){
        var sum = cst.runCosts[year] + fa.depreciates[year]+cst.interestExpends[year] + cst.irrigationFunds[year]
        cst.sumCosts.push(sum)
    }
}
