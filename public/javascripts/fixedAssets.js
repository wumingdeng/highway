/**
 * Created by Fizzo on 16/9/1.
 */
var npt = require("./inputTable.js");
var income = require("./incomeTable.js");
var YData = require("./YData.js");
var fa = {
    depreciates:[],//折旧费     (ztz-bbz-fixedAssetsRemain)*chargeIncome/sum(收入)
    assessTotalVolume:0,//估算总额
    fixedAssetsRemain:0,//固定资产余值
    chargeIncomes:[],//收费收入
    sumChargeIncome:0,
    onCalculateDepreciate:function(){
        for(var year=0;year<npt.OLC_YEAR;year++){
            var depreciate=(npt.invest - npt.blbzcddk_Grant - this.fixedAssetsRemain)*this.chargeIncomes[year]/this.sumChargeIncome
            console.log(depreciate)
            this.depreciates.push(depreciate)
        }
    },
    onChargeIncomes:function(){
        // this.chargeIncomes = income.incomeTable.arr
        var temp = new YData(income.incomeTable);
        this.chargeIncomes = temp.arr
        // this.sumChargeIncome = income.incomeTable['sum']
        this.sumChargeIncome = temp['sum']
    }
}

module.exports = fa






