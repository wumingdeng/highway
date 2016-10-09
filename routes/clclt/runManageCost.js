/**
 * Created by Fizzo on 16/8/31.
 */
var npt = require("./inputTable.js")
var tool = require("../../utils/tool.js")
var gvr = require("../../utils/globalVar.js")
var rmc = {}
rmc.MANAGE_COST = 2000 //管理费用
rmc.MAINTAIN_COST = 1605//养护费用
rmc.MACHINE_COST = 0 //机电维修费
rmc.TUNNEL_LIGHT_COST = 0//隧道照明费用
rmc.MIDDLE_FIX_COST = 0//中修费用
rmc.SERVICE_COST = 0//服务费

rmc.manageCostRate = 0.03 //管理费年增长率
rmc.bigFixCostRate = 0.03 //大维修费的年增长率
rmc.middleFixCostRate = 0.03 //中维修费的年增长率
rmc.maintainCostRate = 0.03 //养护费用增长率
rmc.machineCostRate = 0.03 //机电维修的年增长率
rmc.tunnelMachineCostRate = 0.03 //隧道几点维修的年增长率
rmc.serviceCostRate = 0.03 //服务费的年增长率
rmc.BIG_FIX_MAX_YEAR = 9 // 大修年限
rmc.MIDDLE_FIX_MAX_YEAR = 1 // 中修年限

rmc.bigFixCosts = [] //大修费用
rmc.realityBigFixCosts = [] //实际大修费用
rmc.middleFixCosts = [] //中修费用
rmc.realityMiddleFixCosts = [] //实际中修费用
rmc.machineFixCosts = [] //机电维修费用
rmc.tunnelLightCosts = [] //隧道照明费用
rmc.serviceCosts = [] //服务费
rmc.maintainCosts = [] //养护费
rmc.manageCosts = [] //管理费
rmc.sum = []    //合计

rmc.titles = ["","manageCost","maintainCost","bigFixCost","realityBigFixCost","machineCost","tunnelLightCost","middleFixCost","realityMiddleFixCost","serviceCost"]

rmc.onCalculateFixCost = function(costArr,temp,rate,yearMax,realityCostArr){
    for(var i=0;i<=npt.OLC_YEAR;i++){
        if(i==0) {
            costArr.push(temp)
        }else if(i == 1){
            temp =temp*Math.pow((1+rate),0)
            costArr.push(temp)
        }else{
            temp =temp*(1+rate)
            costArr.push(temp)
        }
        if(yearMax){
            if(i%yearMax == 0){
                realityCostArr.push(temp)
            }else{
                realityCostArr.push(0)
            }
        }
    }
}
rmc.onCalculate = function() {
// 管理费
    var tempManageCost = rmc.MANAGE_COST
    rmc.onCalculateFixCost(rmc.manageCosts, tempManageCost, rmc.manageCostRate)

//养护费
    var tempMaintainCost = rmc.MAINTAIN_COST
    rmc.onCalculateFixCost(rmc.maintainCosts, tempMaintainCost, rmc.maintainCostRate)

//大修费用&&实际大修费用
    var tempBigFixCost = rmc.MAINTAIN_COST * 12
    rmc.onCalculateFixCost(rmc.bigFixCosts, tempBigFixCost, rmc.bigFixCostRate, rmc.BIG_FIX_MAX_YEAR, rmc.realityBigFixCosts)

//机电维修费用
    var tempMachineCost = rmc.MACHINE_COST
    rmc.onCalculateFixCost(rmc.machineFixCosts, tempMachineCost, rmc.machineCostRate)

//隧道照明费用
    var tempTunnelLightCost = rmc.TUNNEL_LIGHT_COST
    rmc.onCalculateFixCost(rmc.tunnelLightCosts, tempTunnelLightCost, rmc.tunnelMachineCostRate)

//中修费用&实际中修费用
    var tempMiddleFixCost = rmc.MIDDLE_FIX_COST
    rmc.onCalculateFixCost(rmc.middleFixCosts, tempMiddleFixCost, rmc.middleFixCostRate, rmc.MIDDLE_FIX_MAX_YEAR, rmc.realityMiddleFixCosts)

//服务费
    var tempServiceCost = rmc.SERVICE_COST
    rmc.onCalculateFixCost(rmc.serviceCosts, tempServiceCost, rmc.serviceCostRate)

    this.sum = tool.mergeData(this.manageCosts,this.maintainCosts,this.realityBigFixCosts,this.realityMiddleFixCosts,this.machineFixCosts,this.tunnelLightCosts,this.serviceCosts);

    this.saveData();
}

//取运营期数据
rmc.getRunningData = function(arr,name,rid,num){
    var formObj = {}
    for(var i = 0; i < arr.length; ++i) {
        formObj["r" + i] = arr[i];
        formObj.name = name;
        formObj.rid = rid;
        formObj.num = num;
        formObj.pn = gvr.projectName
    }
    return formObj;
};

rmc.saveData = function(){
    var resArr = []
    resArr.push(this.getRunningData(this.manageCosts,"运营管理费","rmc1",1));
    resArr.push(this.getRunningData(this.maintainCosts,"养护费","rmc2",2));
    resArr.push(this.getRunningData(this.realityBigFixCosts,"大修费","rmc3",3));
    resArr.push(this.getRunningData(this.realityMiddleFixCosts,"中修费","rmc4"));
    resArr.push(this.getRunningData(this.machineFixCosts,"机电维护费","rmc5",4));
    resArr.push(this.getRunningData(this.tunnelLightCosts,"隧道照明费","rmc6",5));
    resArr.push(this.getRunningData(this.serviceCosts,"拆帐、代收服务费","rmc7"));
    resArr.push(this.getRunningData(this.sum.arr,"合计","rmc8"));
    var dbHelper = require("../../utils/dbHelper");
    dbHelper.update("yygl",resArr);
}


rmc.onDisplay = function(){
    rmc.MANAGE_COST = document.getElementsByName("manageCost")[0].value
    rmc.MAINTAIN_COST = document.getElementsByName("maintainCost")[0].value
    rmc.MACHINE_COST = document.getElementsByName("machineCost")[0].value
    rmc.TUNNEL_LIGHT_COST = document.getElementsByName("tunnelLightCost")[0].value
    rmc.MIDDLE_FIX_COST = document.getElementsByName("middleFixCost")[0].value
    rmc.SERVICE_COST = document.getElementsByName("serviceCost")[0].value
    rmc.MAX_YEAR = document.getElementsByName("year")[0].value
    rmc.onCalculate()


    for(var j = 0;j<=npt.OLC_YEAR;j++){
        var tr = document.createElement('tr');
        var td = document.createElement('td');
        for(var i = 0;i<rmc.titles.length;i++) {
            var input = document.createElement('input');
            input.setAttribute('type', 'text');
            input.setAttribute('readOnly', 'true');
            if(i == 0){
                if(j == 0){
                    input.setAttribute('value', '基年');
                }else {
                    input.setAttribute('value', '第' + j + '年');
                }
            }else{
                input.setAttribute('id', rmc.titles[i] + j);
                input.setAttribute('name', rmc.titles[i] + j);
            }
            td.appendChild(input)
        }
        tr.appendChild(td)
        document.getElementById('tbl').appendChild(tr );
    }

    for(var j = 0;j<=npt.OLC_YEAR;j++){
        for(var i = 1;i<rmc.titles.length;i++) {
            var tempCosts = []
            switch(rmc.titles[i]) {
                case "manageCost":
                    tempCosts = rmc.manageCosts
                    break;
                case "maintainCost":
                    tempCosts = rmc.maintainCosts
                    break;
                case "bigFixCost":
                    tempCosts = rmc.bigFixCosts
                    break;
                case "realityBigFixCost":
                    tempCosts = rmc.realityBigFixCosts
                    break;
                case "machineCost":
                    tempCosts = rmc.machineFixCosts
                    break;
                case "tunnelLightCost":
                    tempCosts = rmc.tunnelLightCosts
                    break;
                case "middleFixCost":
                    tempCosts = rmc.middleFixCosts
                    break;
                case "realityMiddleFixCost":
                    tempCosts = rmc.realityMiddleFixCosts
                    break;
                case "serviceCost":
                    tempCosts = rmc.serviceCosts
                    break;
                default:
                    break;
            }
            document.getElementsByName(rmc.titles[i]+j)[0].value = tempCosts[j]
        }
    }
}

module.exports = rmc