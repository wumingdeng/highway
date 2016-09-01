/**
 * Created by Fizzo on 16/8/31.
 */
var MAX_YEAR = 30
var MANAGE_COST = 2000 //管理费用
var MAINTAIN_COST = 1605//养护费用
var MACHINE_COST = 0 //机电维修费
var TUNNEL_LIGHT_COST = 0//隧道照明费用
var MIDDLE_FIX_COST = 0//中修费用
var SERVICE_COST = 0//服务费

var manageCostRate = 0.03 //管理费年增长率
var bigFixCostRate = 0.03 //大维修费的年增长率
var middleFixCostRate = 0.03 //中维修费的年增长率
var maintainCostRate = 0.03 //养护费用增长率
var machineCostRate = 0.03 //机电维修的年增长率
var tunnelMachineCostRate = 0.03 //隧道几点维修的年增长率
var serviceCostRate = 0.03 //服务费的年增长率
var BIG_FIX_MAX_YEAR = 9 // 大修年限
var MIDDLE_FIX_MAX_YEAR = 1 // 中修年限

var bigFixCosts = [] //大修费用
var realityBigFixCosts = [] //实际大修费用
var middleFixCosts = [] //中修费用
var realityMiddleFixCosts = [] //实际中修费用
var machineFixCosts = [] //机电维修费用
var tunnelLightCosts = [] //隧道照明费用
var serviceCosts = [] //服务费
var maintainCosts = [] //养护费
var manageCosts = [] //管理费

var titles = ["","manageCost","maintainCost","bigFixCost","realityBigFixCost","machineCost","tunnelLightCost","middleFixCost","realityMiddleFixCost","serviceCost"]

function onCalculateFixCost(costArr,temp,rate,yearMax,realityCostArr){
    for(var i=0;i<=MAX_YEAR;i++){
        if(i==0) {
            costArr.push(temp)
        }else if(i == 1){
            temp =temp*Math.pow((1+rate),0)
            costArr.push(temp)
        }else{
            temp =temp*(1+rate)
            temp = Number(temp.toFixed(0))
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
function onCalculate() {
// 管理费
    var tempManageCost = MANAGE_COST
    onCalculateFixCost(manageCosts, tempManageCost, manageCostRate)

//养护费
    var tempMaintainCost = MAINTAIN_COST
    onCalculateFixCost(maintainCosts, tempMaintainCost, maintainCostRate)

//大修费用&&实际大修费用
    var tempBigFixCost = MAINTAIN_COST * 12
    onCalculateFixCost(bigFixCosts, tempBigFixCost, bigFixCostRate, BIG_FIX_MAX_YEAR, realityBigFixCosts)

//机电维修费用
    var tempMachineCost = MACHINE_COST
    onCalculateFixCost(machineFixCosts, tempMachineCost, machineCostRate)

//隧道照明费用
    var tempTunnelLightCost = TUNNEL_LIGHT_COST
    onCalculateFixCost(tunnelLightCosts, tempTunnelLightCost, tunnelMachineCostRate)

//中修费用&实际中修费用
    var tempMiddleFixCost = MIDDLE_FIX_COST
    onCalculateFixCost(middleFixCosts, tempMiddleFixCost, middleFixCostRate, MIDDLE_FIX_MAX_YEAR, realityMiddleFixCosts)

//服务费
    var tempServiceCost = SERVICE_COST
    onCalculateFixCost(serviceCosts, tempServiceCost, serviceCostRate)
}

function onDisplay(){
    MANAGE_COST = document.getElementsByName("manageCost")[0].value
    MAINTAIN_COST = document.getElementsByName("maintainCost")[0].value
    MACHINE_COST = document.getElementsByName("machineCost")[0].value
    TUNNEL_LIGHT_COST = document.getElementsByName("tunnelLightCost")[0].value
    MIDDLE_FIX_COST = document.getElementsByName("middleFixCost")[0].value
    SERVICE_COST = document.getElementsByName("serviceCost")[0].value
    MAX_YEAR = document.getElementsByName("year")[0].value
    onCalculate()


    for(var j = 0;j<=MAX_YEAR;j++){
        var tr = document.createElement('tr');
        var td = document.createElement('td');
        for(var i = 0;i<titles.length;i++) {
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
                input.setAttribute('id', titles[i] + j);
                input.setAttribute('name', titles[i] + j);
            }
            td.appendChild(input)
        }
        tr.appendChild(td)
        document.getElementById('tbl').appendChild(tr );
    }

    for(var j = 0;j<=MAX_YEAR;j++){
        for(var i = 1;i<titles.length;i++) {
            var tempCosts = []
            switch(titles[i]) {
                case "manageCost":
                    tempCosts = manageCosts
                    break;
                case "maintainCost":
                    tempCosts = maintainCosts
                    break;
                case "bigFixCost":
                    tempCosts = bigFixCosts
                    break;
                case "realityBigFixCost":
                    tempCosts = realityBigFixCosts
                    break;
                case "machineCost":
                    tempCosts = machineFixCosts
                    break;
                case "tunnelLightCost":
                    tempCosts = tunnelLightCosts
                    break;
                case "middleFixCost":
                    tempCosts = middleFixCosts
                    break;
                case "realityMiddleFixCost":
                    tempCosts = realityMiddleFixCosts
                    break;
                case "serviceCost":
                    tempCosts = serviceCosts
                    break;
                default:
                    break;
            }
            document.getElementsByName(titles[i]+j)[0].value = tempCosts[j]
        }
    }
}