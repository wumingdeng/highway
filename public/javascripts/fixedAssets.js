/**
 * Created by Fizzo on 16/9/1.
 */

var depreciates = [] //折旧费     (ztz-bbz-fixedAssetsRemain)*chargeIncome/sum(收入)
var assessTotalVolume = 0 //估算总额
var fixedAssetsRemain = 0 //固定资产余值
var chargeIncomes= []//收费收入
var sumChargeIncome = 0

var limitYear = 30 //年限

chargeIncomes.forEach(function(chg){
    sumChargeIncome = sumChargeIncome + chg
})

function onCalculateDepreciate(){
    for(var year=1;year<=limitYear;year++){
        var depreciate=(ztz - blbzcddk - fixedAssetsRemain)*chargeIncomes[year]/sumChargeIncome
        depreciates.push(depreciate)
    }
}