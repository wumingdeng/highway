/**
 * Created by Fizzo on 16/9/1.
 */
var npt = require("./inputTable.js");
var income = require("./incomeTable.js");
var YData = require("./YData.js");
var tool = require("./../../utils/tool.js")
var gvr = require('../../utils/globalVar');
var fa = {
    depreciates: [],//折旧费     (ztz-bbz-fixedAssetsRemain)*chargeIncome/sum(收入)
    assessTotalVolume: [],//估算总额
    fixedAssetsRemain: npt.FIXEASSETS_BALANCE,//固定资产余值
    chargeIncomes: [],//收费收入
    sumChargeIncome: 0,
    initVariable: function () {
        this.depreciates = []//折旧费     (ztz-bbz-fixedAssetsRemain)*chargeIncome/sum(收入)
        this.chargeIncomes = []//收费收入
    },
    onCalculateDepreciate: function () {
        var tmpSmDep = 0
        for (var year = 0; year < npt.OLC_YEAR; year++) {
            var depreciate = (npt.invest - npt.blbzcddk_Grant - this.fixedAssetsRemain) * this.chargeIncomes[year] / this.sumChargeIncome
            // console.log(depreciate)
            tmpSmDep = tmpSmDep + depreciate
            this.depreciates.push(depreciate)
        }
        this.depreciates['sum'] = tmpSmDep
        // this.saveData();
    },
    onChargeIncomes: function () {
        // this.chargeIncomes = income.incomeTable.arr
        var temp = new YData(income.incomeTable);
        this.chargeIncomes = temp.getManageArr();
        this.chargeIncomes['sum'] = 0
        // this.sumChargeIncome = income.incomeTable['sum']
        this.sumChargeIncome = temp['sum']
    },
    onSum:function(){
        function onSum(arr){
            for(var it in arr){
                if(Number(it)<=gvr.loanYear) {
                    var vb = arr[it]
                    arr['sum'] += vb
                }
            }
        }
        onSum(this.chargeIncomes)
    },
    saveData: function () {
        var resArr = [];
        resArr.push(tool.getRunningData(this.depreciates, "直线折旧法", 1));
        resArr.push(tool.getRunningData(this.assessTotalVolume,"估算总额(含息)扣除残值直线折旧", 2));
        resArr.push(tool.getFormData(new YData(income.incomeTable), {name: "收费收入", rid: 3}));
        var dbHelper = require("../../utils/dbHelper");
        dbHelper.update("gdzc", resArr);
    }

}

module.exports = fa






