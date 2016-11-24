/**
 * Created by Fizzo on 16/9/7.
 */
var npt = require('./inputTable.js')
var tool = require("./../../utils/tool.js")
var pfit = require('./profit.js')
var rcwi = require('./repayCapitalWithInterest.js')
var cst = require('./cost.js')
var income = require('./incomeTable.js')
var cashFlow = require('./cashFlow.js')
var inf = {
    cashIn: [], //现金流入
    income: [], //收入收费
    rcyclFixdAsstsBlncs: [],//回收固定资产余额
    otherIncome: [],//其他收入
    picDifInvst: [], //投资价差

    cashOut: [], // 现金流出
    projectCapital: [],//项目资本金
    bwPrincipal: [],//借款本金偿还
    bwInterest: [],//借款利息支付
    runCost: [],//经营成本
    vat: [],//增值税
    incomeTax: [],//所得税
    waterFunds: [],//水利基金 TODO 没有数据
    cashFlow: [],//净现金流量
    cashFlowSum: [],//净现金流量统计
    initVariable: function () {
        this.cashIn = [] //现金流入
        this.income = [] //收入收费
        this.rcyclFixdAsstsBlncs = []//回收固定资产余额
        this.otherIncome = []//其他收入
        this.picDifInvst = [] //投资价差
        this.cashOut = [] // 现金流出
        this.projectCapital = []//项目资本金
        this.bwPrincipal = []//借款本金偿还
        this.bwInterest = []//借款利息支付
        this.runCost = []//经营成本
        this.vat = []//增值税
        this.incomeTax = []//所得税
        this.waterFunds = []//水利基金 TODO 没有数据
        this.cashFlow = []//净现金流量
        this.cashFlowSum = []//净现金流量统计
    },
    onInit: function () {
        this.onClcltCi()
        this.onClcltCo()
        this.onClcltSum()
        this.saveData()
    },
    onClcltCi: function () {
        this.picDifInvst = npt.picDifIncm
        this.otherIncome = npt.picDifIncm
        var tmpSmRfab = 0
        var tmpSmi = 0
        for (var yr = 0; yr < npt.BUILD_YEAR + npt.OLC_YEAR; yr++) {
            var tmpi = 0
            var tmpRfab = 0
            if (yr < npt.BUILD_YEAR) {
                this.rcyclFixdAsstsBlncs.push(0)
                this.income.push(0)
            } else {
                this.picDifInvst.push(0)
                this.otherIncome.push(0)

                tmpi = income.incomeTable[yr]
                tmpSmi = tmpSmi + tmpi
                this.income.push(tmpi)

                tmpRfab = cashFlow.hszcyz[yr - npt.BUILD_YEAR]
                tmpSmRfab = tmpSmRfab + tmpRfab
                this.rcyclFixdAsstsBlncs.push(tmpRfab)
            }
            var tmCi = tmpi + tmpRfab + this.otherIncome[yr]
            this.cashIn.push(tmCi)
        }
        this.picDifInvst['sum'] = npt.picDifIncmSm
        this.otherIncome['sum'] = npt.picDifIncmSm
        this.income['sum'] = tmpSmi
        this.rcyclFixdAsstsBlncs['sum'] = tmpSmRfab
        this.cashIn['sum'] = tmpSmRfab + tmpSmi + npt.picDifIncmSm
    },
    onClcltCo: function () {
        var tmpSmPc = 0
        var tmpSmBpp = 0
        var tmpSmBi = 0
        var tmpSmRc = 0
        var tmpSmVat = 0
        var tmpSmIt = 0
        var tmpSmWf = 0
        for (var yr = 0; yr < npt.BUILD_YEAR + npt.OLC_YEAR; yr++) {
            var tmpPc = 0
            var tmpBpp = 0
            var tmpBi = 0
            var tmpRc = 0
            var tmpVat = 0
            var tmpIt = 0
            var tmpWf = 0
            if (yr < npt.BUILD_YEAR) {
                tmpPc = (npt.CTCapital_grant + npt.ptGntBlncLclInvst_grant) * npt.JSTZ[yr]
                tmpSmPc = tmpSmPc + tmpPc
                this.projectCapital.push(tmpPc)

                this.bwPrincipal.push(0)
                this.bwInterest.push(0)
                this.runCost.push(0)
                this.vat.push(0)
                this.incomeTax.push(0)
                this.waterFunds.push(0)
            } else {
                tmpBpp = rcwi.repayCapitals_4[yr - npt.BUILD_YEAR]
                tmpSmBpp = tmpSmBpp + tmpBpp
                this.bwPrincipal.push(tmpBpp)

                tmpBi = cst.interestExpends[yr - npt.BUILD_YEAR]
                tmpSmBi = tmpSmBi + tmpBi
                this.bwInterest.push(tmpBi)

                tmpRc = cst.runCosts[yr - npt.BUILD_YEAR]
                tmpSmRc = tmpSmRc + tmpRc
                this.runCost.push(tmpRc)

                tmpVat = pfit.vats[yr - npt.BUILD_YEAR]
                tmpSmVat = tmpSmVat + tmpVat
                this.vat.push(tmpVat)

                tmpIt = pfit.incomeTax[yr - npt.BUILD_YEAR]
                tmpSmIt = tmpSmIt + tmpIt
                this.incomeTax.push(tmpIt)

                tmpWf = cst.irrigationFunds[yr - npt.BUILD_YEAR]
                tmpSmWf = tmpSmWf + tmpWf
                this.waterFunds.push(tmpWf)
            }
            var tmpCo = tmpPc + tmpBpp + tmpBi + tmpRc + tmpVat + tmpIt + tmpWf
            this.cashOut.push(tmpCo)
        }
        this.projectCapital['sum'] = tmpSmPc
        this.bwPrincipal['sum'] = tmpSmBpp
        this.bwInterest['sum'] = tmpSmBi
        this.runCost['sum'] = tmpSmRc
        this.vat['sum'] = tmpSmVat
        this.incomeTax['sum'] = tmpSmIt
        this.waterFunds['sum'] = tmpSmWf
        this.cashOut['sum'] = tmpSmPc + tmpSmBpp + tmpSmBi + tmpSmRc + tmpSmVat + tmpSmIt + tmpSmWf
    },
    onClcltSum: function () {
        // cashFlow:[],//净现金流量
        //     cashFlowSum:[],//净现金流量统计
        for (var yr = 0; yr < npt.BUILD_YEAR + npt.OLC_YEAR; yr++) {
            this.cashFlow.push(this.cashIn[yr] - this.cashOut[yr])
            if (yr == 0) {
                this.cashFlowSum.push(this.cashFlow[yr])
            } else {
                this.cashFlowSum.push(this.cashFlow[yr] + this.cashFlowSum[yr - 1])
            }
        }
        this.cashFlow['sum'] = this.cashIn['sum'] - this.cashOut['sum']
    },
    saveData: function () {
        var resArr = [];
        resArr.push(tool.getFormData(this.cashIn, {name: "现金流入", rid: "inf01", num: 1}))
        resArr.push(tool.getFormData(this.income, {name: "收费收入", rid: "inf02", num: 1.1}))
        resArr.push(tool.getFormData(this.rcyclFixdAsstsBlncs, {name: "回收固定资产余值", rid: "inf03", num: 1.2}))
        resArr.push(tool.getFormData(this.otherIncome, {name: "其他收入", rid: "inf04", num: 1.3}))
        resArr.push(tool.getFormData(this.picDifInvst, {name: "投资价差", rid: "inf05", num: "1.3.1"}))
        resArr.push(tool.getFormData([], {name: "其他", rid: "inf06", num: "1.3.2"}))
        resArr.push(tool.getFormData([], {name: "其他", rid: "inf07", num: "1.3.2"}))
        resArr.push(tool.getFormData(this.cashOut, {name: "现金流出", rid: "inf08", num: "2"}))
        resArr.push(tool.getFormData(this.projectCapital, {name: "项目资本金", rid: "inf09", num: "2.1"}))
        resArr.push(tool.getFormData(this.bwPrincipal, {name: "借款本金偿还", rid: "inf10", num: "2.2"}))
        resArr.push(tool.getFormData(this.bwInterest, {name: "借款利息支付", rid: "inf11", num: "2.3"}))
        resArr.push(tool.getFormData(this.runCost, {name: "经营成本", rid: "inf12", num: "2.4"}))
        resArr.push(tool.getFormData(this.vat, {name: "增值税", rid: "inf13", num: "2.5"}))
        resArr.push(tool.getFormData(this.incomeTax, {name: "所得税", rid: "inf14", num: "2.6"}))
        resArr.push(tool.getFormData(this.waterFunds, {name: "水利基金", rid: "inf15", num: "2.7"}))
        resArr.push(tool.getFormData(this.cashFlow, {name: "净现金流量(1-2)", rid: "inf16", num: "3"}))
        resArr.push(tool.getFormData(this.cashFlowSum, {name: "净现金流累计", rid: "inf17", num: "4"}))
        var dbHelper = require("../../utils/dbHelper");
        dbHelper.update("zbjll", resArr);
    }
}
module.exports = inf