/**
 * Created by Fizzo on 16/9/2.
 */

var fa = require("./fixedAssets.js")
var npt = require("./inputTable.js")
var rmc = require("./runManageCost.js")
var tool = require("../../utils/tool.js")
var gvr = require('../../utils/globalVar');
var cst = {}

cst.runCosts = [] //经营成本
cst.interestExpends = [] //利息支出 长期借款利息 + 短期借款利息
cst.loanLongs = [] //长期借款利息 还本付息表
cst.loanShorts = []//短期借款利息 财务计划流量
cst.depreciates = [] // 折旧费
cst.promoteSales = [] //推销费用
//TODO 没有具体数据
cst.irrigationFunds = [] //水利基金
cst.other = []
cst.sumCosts = [] //总成本费用

cst.initVariable = function(){
    cst.runCosts = [] //经营成本
    cst.interestExpends = [] //利息支出 长期借款利息 + 短期借款利息
    cst.loanLongs = [] //长期借款利息 还本付息表
    cst.loanShorts = []//短期借款利息 财务计划流量
    cst.depreciates = [] // 折旧费
    cst.promoteSales = [] //推销费用
    cst.irrigationFunds = [] //水利基金
    cst.sumCosts = [] //总成本费用
    cst.other = []
    cst.sumCosts['sum'] = 0
}
cst.onCalculateRunCost = function() {
    cst.runCosts = rmc.sum.arr.slice(1); //去掉基年的数据
    cst.CalculateIrrigationFund()
    cst.CalculatePs()
    cst.depreciates = fa.depreciates // 折旧费
};

cst.saveData = function(){
    var resArr = []
    resArr.push(tool.getRunningData(rmc.manageCosts.slice(1),"运营管理费",1,1));
    resArr.push(tool.getRunningData(rmc.maintainCosts.slice(1),"养护费",2,2));
    resArr.push(tool.getRunningData(rmc.realityBigFixCosts.slice(1),"大修费",3,3));
    resArr.push(tool.getRunningData(rmc.realityMiddleFixCosts.slice(1),"中修费",4,4));
    resArr.push(tool.getRunningData(rmc.machineFixCosts.slice(1),"机电维护费",5,5));
    resArr.push(tool.getRunningData(rmc.serviceCosts.slice(1),"拆帐、代收服务费",6,6));
    resArr.push(tool.getRunningData(rmc.other.slice(1),"其他",7,7));
    resArr.push(tool.getRunningData(cst.runCosts,"经营成本(1-6)",8,8));
    resArr.push(tool.getRunningData(fa.depreciates,"折旧费",9,9));
    resArr.push(tool.getRunningData(this.promoteSales,"摊销费",10,10));
    resArr.push(tool.getRunningData(this.interestExpends,"利息支出",11,11));
    resArr.push(tool.getRunningData(this.loanLongs,"长期借款利息",12));
    resArr.push(tool.getRunningData(this.loanShorts,"短期借款利息",13));
    resArr.push(tool.getRunningData(this.irrigationFunds,"水利基金",14,12));
    resArr.push(tool.getRunningData(this.other,"其他",15,13));
    resArr.push(tool.getRunningData(this.sumCosts,"总成本费用合计(7-11)",16,14));

    var dbHelper = require("../../utils/dbHelper");
    dbHelper.update("cbb",resArr);
};

cst.onCalculateInterestExpend = function(){
    for(var year = 0 ;year<npt.OLC_YEAR;year++){
        cst.interestExpends.push(cst.loanLongs[year]+cst.loanShorts[year])
    }
}

//TODO 运营管理费用表 49行 什么鬼
cst.CalculateIrrigationFund = function(){
    if(cst.irrigationFunds.length==0) {
        for (var year = 0; year < npt.OLC_YEAR; year++) {
            cst.irrigationFunds.push(0)
        }
    }
}
//推销费用
cst.CalculatePs = function(){
    if(cst.promoteSales.length==0){
        for(var year = 0 ;year<npt.OLC_YEAR;year++) {
            cst.promoteSales.push(0)
        }
    }
}

cst.onCalculateSumCost = function(yr){
    var sum = cst.runCosts[yr] + fa.depreciates[yr]+cst.interestExpends[yr] + cst.irrigationFunds[yr] + (cst.other[yr] || 0)
    cst.sumCosts.push(sum)

}

cst.onSum=function(){
    function onSum(arr){
        for(var it in arr){
            if(Number(it)<=gvr.loanYear) {
                var vb = arr[it]
                arr['sum'] += vb
            }
        }
    }
    onSum(cst.sumCosts)
}
module.exports = cst