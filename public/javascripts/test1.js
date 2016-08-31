/**
 * Created by Fizzo on 16/8/31.
 */
var MAX_YEAR = 30
var MANAGE_COST = 2000 //管理费用
var MAINTAIN_COST = 1605//养护费用
var MACHINE_COST = 0 //机电维修费
var TUNNEL_LIGHT_COST = 0//隧道照明费用

var manageCostRate = 0.03 //管理费年增长率
var bigFixCostRate = 0.03 //大维修费的年增长率
var middleFixCostRate = 0.03 //中维修费的年增长率
var maintainCostRate = 0.03 //养护费用增长率
var machineCostRate = 0.03 //机电维修的年增长率
var tunnelMachineCostRate = 0.03 //隧道几点维修的年增长率
var BIG_FIX_MAX_YEAR = 9 // 大修年限

var bigFixCosts = [] //大修费用
var realityBigFixCosts = [] //实际大修费用
var middleFixCosts = [] //中修费用
var realityMiddleFixCosts = [] //实际中修费用
var machineFixCosts = [] //机电维修费用
var tunnelLightCosts = [] //隧道照明费用
var serviceCosts = [] //服务费
var maintainCosts = [] //养护费

function onCalculateFixCost(temp,yearMax){

}

var tempMaintainCost = MAINTAIN_COST
for(var i=0;i<MAX_YEAR;i++){
    if(i==0){
        maintainCosts.push(tempMaintainCost)
        console.log(tempMaintainCost)
    }else{
        tempMaintainCost =tempMaintainCost*(1+maintainCostRate)
        tempMaintainCost = Number(tempMaintainCost.toFixed(0))
        // tempMaintainCost = Number(tempMaintainCost.toFixed(1))
        // tempMaintainCost = Math.floor(tempMaintainCost + 0.5)
        maintainCosts.push(tempMaintainCost)
        console.log(tempMaintainCost)
    }

}

var tempBigFixCost = MAINTAIN_COST*12
for(var i=0;i<MAX_YEAR;i++){
    if(i==0){
        bigFixCosts.push(tempBigFixCost)
        console.log(tempBigFixCost)
    }else{
        tempBigFixCost =tempBigFixCost*(1+bigFixCostRate)
        tempBigFixCost = Number(tempBigFixCost.toFixed(0))
        bigFixCosts.push(tempBigFixCost)
        if(i%BIG_FIX_MAX_YEAR == 0){
            realityBigFixCosts.push(tempBigFixCost)
        }else{
            realityBigFixCosts.push(0)
        }
        console.log(tempBigFixCost)
    }
}

var tempMachineCost = MACHINE_COST


function onDisplay(){
    var un = document.getElementsByName("username")
    var dSun = document.getElementsByName("displayUserName")
    dSun[0].value = un[0].value
}