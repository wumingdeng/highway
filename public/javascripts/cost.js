/**
 * Created by Fizzo on 16/9/2.
 */
var runCosts = []
var interestExpends = [] //利息支出 长期借款利息 + 短期借款利息
var loanLongs = [] //长期借款利息 还本付息表
var loanShorts = []//短期借款利息 财务计划流量
var promoteSales = [] //推销费用
//TODO 没有具体数据
var irrigationFunds = [] //水利基金
var sumCosts = [] //总成本费用

function onCalculateRunCost() {
    for (var year = 1; year < MAX_YEAR; year++) {
        var sum = realityBigFixCosts[year] + realityMiddleFixCosts[year] + machineFixCosts[year] + manageCosts[year] + maintainCosts[year] + serviceCosts[year]
        runCosts.push(sum)
    }
}

function onCalculateInterestExpend(){
    for(var year = 0 ;year<MAX_YEAR;year++){
        interestExpends.push(loanLongs[year]+loanShorts[year])
    }
}

function onCalculateIrrigationFund(){
    irrigationFunds.push()
}

function onCalculateSumCost(){
    for(var year = 0 ;year<MAX_YEAR;year++){
        var sum = runCosts[year] + depreciates[year]+interestExpends[year] + irrigationFunds[year]
        sumCosts.push(sum)
    }
}
