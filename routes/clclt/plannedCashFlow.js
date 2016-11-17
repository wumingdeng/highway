/**
 * Created by Fizzo on 16/9/6.
 */

var npt = require("./inputTable.js")
var cashFlow = require("./cashFlow.js")
var income = require("./incomeTable.js")
var pfit = require('./profit.js')
var cst = require("./cost.js")
var rcwi = require("./repayCapitalWithInterest.js")
var tool = require("../../utils/tool.js")

var pcf = {}
pcf.racf = [] //经营活动净现金流量
pcf.cashIn = [] // 现金流入
pcf.revenue = [] // 营业收入
pcf.VATRecognitionTax = [] //增值税销项税额
pcf.subIncome = [] //补贴收入
pcf.otherIn = []//其他流入
pcf.investDifPic = [] //投资价差
pcf.cashOut = [] //现金流出
pcf.runCost = []//运营成本
pcf.inputVAT = [] //增值税进项税额
pcf.oParatingTax = [] //营业税金及附加
pcf.VAT = [] //增值税
pcf.incomeTax = [] //所得税
pcf.otherOut = [] // 其他流出

pcf.iacf = [] //投资活动净现金流量
pcf.cashIn_2 = [] //现金流入
pcf.cashOut_2 = [] //现金流出
pcf.buildInvest = [] //建设投资
pcf.keepRunInvest = [] //维持运营投资
pcf.operatingFunds = [] //流动资金
pcf.otherOut_2 = [] //其他流出

pcf.facf = [] //筹资活动净现金流量
pcf.cashIn_3 = []//现金流入
pcf.projectSelfCashIn = [] //项目自有资金流入
pcf.buildInvestLoan = [] //建设投资借款
pcf.flowCashLaon = [] //流动资金借款
pcf.bonds = [] //债卷
pcf.shortLoan = [] //短期借款
pcf.cashOut_3 = [] //现金流出
pcf.interestOut= [] // 利息支出
pcf.longLoanInterest= [] //长期借款利息
pcf.shortLoanInterest = [] //短期借款利息
pcf.borrowPrincipal = [] //偿还债务本金
pcf.borrowShortLoan = [] //偿还短期借款
pcf.profitPay = [] //应付利润
pcf.otherOut_3 = [] //其他流出

pcf.cashFlow = [] //净现金流量
pcf.sumFunds = [] //盈余资金

pcf.onClcltRacf = function()
{
    var tempSumOpt = 0
    var tempSumRc = 0
    var tempSumOo = 0
    var tempSumIt = 0

    var tempSumRe = 0
    var tempSumSi = 0
    var tempSumIdp = 0
    var tempSumOi = 0
    for(var yr = 0;yr<npt.BUILD_YEAR+npt.OLC_YEAR;yr++){
        if(yr<npt.BUILD_YEAR){
            pcf.otherOut.push("")
            pcf.runCost.push(0)
            pcf.oParatingTax.push(0)
            pcf.incomeTax.push(0)

            // this.revenue.push(0)
            this.subIncome.push(cashFlow.btsr.arr[yr])
            this.investDifPic.push(npt.picDifIncm[yr])
            //TODO
            //加了两行不知什么鬼的空白信息,so.直接等于补贴收入
            this.otherIn.push(npt.picDifIncm[yr])
            tempSumSi = tempSumSi + cashFlow.btsr.arr[yr]
            tempSumIdp = tempSumIdp + npt.picDifIncm[yr]
            tempSumOi = tempSumOi + npt.picDifIncm[yr]
            pcf.cashOut.push(0)
        }else{
            this.subIncome.push(0)
            this.otherIn.push(0)
            pcf.oParatingTax.push(pfit.vats[yr-npt.BUILD_YEAR])
            pcf.runCost.push(cst.runCosts[yr-npt.BUILD_YEAR])
            pcf.otherOut.push(cst.irrigationFunds[yr-npt.BUILD_YEAR])
            pcf.incomeTax.push(pfit.incomeTax[yr-npt.BUILD_YEAR])
            tempSumOpt = tempSumOpt+pfit.vats[yr-npt.BUILD_YEAR]
            tempSumRc = tempSumRc + cst.runCosts[yr-npt.BUILD_YEAR]
            tempSumOo = tempSumOo + cst.irrigationFunds[yr-npt.BUILD_YEAR]
            tempSumIt = tempSumIt + pfit.incomeTax[yr-npt.BUILD_YEAR]

            pcf.cashOut.push(pfit.vats[yr-npt.BUILD_YEAR]+cst.runCosts[yr-npt.BUILD_YEAR]+cst.irrigationFunds[yr-npt.BUILD_YEAR]+pfit.incomeTax[yr-npt.BUILD_YEAR])
        }
        this.revenue.push(income.incomeTable[yr])
        tempSumRe = tempSumRe + income.incomeTable[yr]
        pcf.cashIn.push(this.revenue[yr]+this.subIncome[yr]+this.otherIn[yr]+this.inputVAT[yr])

        pcf.racf.push(pcf.cashIn[yr] - pcf.cashOut[yr])
    }
    pcf.oParatingTax['sum'] = tempSumOpt
    pcf.runCost['sum']= tempSumRc
    pcf.otherOut['sum']= tempSumOo
    pcf.incomeTax['sum']= tempSumIt
    pcf.cashOut['sum']= tempSumOpt + tempSumRc + tempSumOo + tempSumIt

    pcf.revenue['sum'] = tempSumRe
    pcf.subIncome['sum']= tempSumSi
    pcf.investDifPic['sum']= tempSumIdp
    pcf.otherIn['sum']= tempSumOi
    pcf.cashIn['sum']= tempSumSi + tempSumOi + tempSumRe

    pcf.racf['sum'] = pcf.cashIn['sum'] - pcf.cashOut['sum']
}



pcf.onClcltIacf = function()
{
    pcf.buildInvest = npt.projectInvestSums
    var tempSumCo = 0
    var tempSumbd = 0

    for(var yr = 0;yr<npt.BUILD_YEAR;yr++){

        pcf.cashIn_2.push(0)
        //TODO
        //还有三行没有数据的字段所以暂时用0 代替
        // pcf.cashOut_2.push(pcf.buildInvest[yr]+0+0+0)
        pcf.cashOut_2.push(pcf.buildInvest[yr]+pcf.keepRunInvest[yr]+pcf.operatingFunds[yr]+pcf.otherOut_2[yr])
        tempSumCo = tempSumCo + pcf.buildInvest[yr]
        tempSumbd = tempSumbd + pcf.buildInvest[yr]
        pcf.iacf.push(pcf.cashIn_2[yr] - pcf.cashOut_2[yr])
    }

    pcf.cashOut_2['sum']= tempSumCo
    pcf.cashIn_2['sum']= 0
    pcf.buildInvest['sum'] = tempSumbd
    pcf.iacf['sum'] = pcf.cashIn_2['sum'] - pcf.cashOut_2['sum']
}
pcf.init = function() {
    this.tmpSmSl = 0
    this.tmpSmIo = 0
    this.tmpSmBp = 0
    this.tmpSmBsl = 0
    this.tmpSmPp = 0
    this.tmpSmOo = 0
    function onInitData(arr){
        if (arr.length == 0){
            for(var yr=0;yr<npt.BUILD_YEAR+npt.OLC_YEAR;yr++){
                arr[yr] = 0
            }
        }
    }
    onInitData(this.inputVAT)
    onInitData(this.keepRunInvest)
    onInitData(this.operatingFunds)
    onInitData(this.otherOut_2)
    onInitData(this.flowCashLaon)
    onInitData(this.bonds)
    onInitData(this.profitPay)
    onInitData(this.otherOut_3)
}
pcf.onClcltFacf = function(yr)
{

    this.buildInvestLoan = npt.dk

    // for(var yr = 0;yr>npt.BUILD_YEAR+npt.OLC_YEAR;yr++){
    // pcf.flowCashLaon.push(0)
    // pcf.bonds.push(0)
    if(yr < npt.BUILD_YEAR){

        pcf.borrowPrincipal.push(0)
        pcf.profitPay.push(0)
        pcf.cashOut_3.push(0)
        this.interestOut.push(0)
        pcf.borrowShortLoan.push(0)
    }else{
        var tmpIo = cst.interestExpends[yr-npt.BUILD_YEAR]
        this.tmpSmIo = this.tmpSmIo + tmpIo
        this.interestOut.push(tmpIo)

        if (rcwi.repayCapitals_1[yr]){
            var tmpBp = rcwi.repayCapitals_1[yr]
        }else{
            var tmpBp = 0
        }

        this.tmpSmBp = this.tmpSmBp + tmpBp
        pcf.borrowPrincipal.push(tmpBp)

        var tmpBsl =  this.shortLoan[yr-1]
        this.tmpSmBsl = this.tmpSmBsl + tmpBsl
        pcf.borrowShortLoan.push(tmpBsl)

        // var tmpPp = 0
        // this.tmpSmPp = this.tmpSmPp + tmpPp
        this.tmpSmPp = this.tmpSmPp + pcf.profitPay[yr]
        // pcf.profitPay.push(tmpPp)

        // var tmpOo = 0
        // this.tmpSmOo = this.tmpSmOo + tmpOo
        this.tmpSmOo = this.tmpSmOo + pcf.otherOut_3[yr]
        // pcf.otherOut_3.push(tmpOo)

        // pcf.cashOut_3.push(tmpIo+tmpBp+tmpBsl+tmpPp+tmpOo)
        pcf.cashOut_3.push(tmpIo+tmpBp+tmpBsl+pcf.profitPay[yr]+pcf.otherOut_3[yr])

        //=IF((H35-利润表!D16+利润表!D13)<0,0,(H35-利润表!D16+利润表!D13))
        var tmpSl = pcf.cashOut_3[yr] - pfit.intstDpcitBfPrfits[yr-npt.BUILD_YEAR] + pfit.incomeTax[yr-npt.BUILD_YEAR]
        if(tmpSl < 0) tmpSl = 0
        this.tmpSmSl = this.tmpSmSl + tmpSl
        this.shortLoan.push(tmpSl)

        //---------流入
        this.projectSelfCashIn.push(0)
        this.buildInvestLoan.push(0)

    }
    pcf.cashIn_3.push(this.shortLoan[yr]+pcf.bonds[yr]+pcf.flowCashLaon[yr]+this.buildInvestLoan[yr]+pcf.projectSelfCashIn[yr])
    pcf.facf.push(pcf.cashIn_3[yr] - pcf.cashOut_3[yr])

}

//统计短期借款与借款利息
pcf.onClcltShortLoan = function()
{
    this.init()
    var tmpSmpsci = 0
    var tmpSmSli = 0
    var tmpSmLli = 0



    for(var yr = 0;yr<npt.BUILD_YEAR+npt.OLC_YEAR;yr++) {
        var tmSli = 0
        var tmlli = 0
        if (yr != 0) {
            tmSli = npt.INTEREST_RT_2 * this.shortLoan[yr - 1]

            tmpSmSli = tmpSmSli + tmSli
        }

        tmlli = rcwi.onRepayCapitals(yr,pcf)
        tmpSmLli = tmpSmLli + tmlli
        pcf.shortLoanInterest.push(tmSli)
        pcf.longLoanInterest.push(tmlli)
        if(yr>=npt.BUILD_YEAR){
            cst.loanLongs.push(tmlli)
            cst.loanShorts.push(tmSli)
            //利息的支出
            cst.interestExpends.push(tmSli + tmlli)

            cst.onCalculateSumCost(yr-npt.BUILD_YEAR)

            pfit.onCalculateProfitSums(yr-npt.BUILD_YEAR)

            var tempIbpf = pfit.profitSums[yr-npt.BUILD_YEAR] + cst.interestExpends[yr-npt.BUILD_YEAR] - pfit.makeUpLoseMoneys[yr-npt.BUILD_YEAR]
            pfit.intstBfPrfits.push(tempIbpf)

            var tempSumIp = pfit.intstBfPrfits[yr-npt.BUILD_YEAR] + cst.depreciates[yr-npt.BUILD_YEAR] + cst.promoteSales[yr-npt.BUILD_YEAR]

            pfit.intstDpcitBfPrfits.push(tempSumIp)
            // tmpSmintstDpcitBfPrfits = tmpSmintstDpcitBfPrfits + tempSumIp
            // tmpSmintstBfPrfits = tmpSmintstBfPrfits + tempIbpf

            pfit.intstDpcitBfPrfits['sum'] =(pfit.intstDpcitBfPrfits['sum']||0) + tempSumIp
            pfit.intstBfPrfits['sum'] =(pfit.intstBfPrfits['sum']||0) + tempIbpf


            pfit.onCalculateSelfTaxations(yr-npt.BUILD_YEAR)
            pfit.onCalculateTaxation(yr-npt.BUILD_YEAR)

            rcwi.onCalculateBorrowMoneyBalance(yr,pcf)


            pcf.onClcltFacf(yr)

            // //=IF((H35-利润表!D16+利润表!D13)<0,0,(H35-利润表!D16+利润表!D13))
            // var tmpSl = pcf.cashOut_3[yr] - pfit.intstDpcitBfPrfits[yr-npt.BUILD_YEAR] + pfit.incomeTax[yr-npt.BUILD_YEAR]
            // if(tmpSl < 0) tmpSl = 0
            // tmpSmSl = tmpSmSl + tmpSl
            // this.shortLoan.push(tmpSl)
        }else{
            this.shortLoan.push(0)
            rcwi.onCalculateBorrowMoneyBalance(yr,pcf)
            pcf.onClcltFacf(yr)
            var psci = npt.zyzij[yr]-npt.picDifIncm[yr]-npt.ptGntBlncCTInvst_grant*npt.JSTZ[yr]
            this.projectSelfCashIn.push(psci)
            tmpSmpsci = tmpSmpsci + psci
        }
    }
    pcf.shortLoan['sum'] = this.tmpSmSl
    pcf.shortLoanInterest['sum'] = tmpSmSli

    pcf.buildInvestLoan['sum'] = npt.sjdkbl
    pcf.flowCashLaon['sum'] = 0
    pcf.bonds['sum'] = 0

    //项目自有资金流入
    pcf.projectSelfCashIn['sum'] = tmpSmpsci

    pcf.cashIn_3['sum']= npt.sjdkbl + tmpSmpsci + pcf.shortLoan['sum']


    pcf.longLoanInterest['sum'] = tmpSmLli
    rcwi.payInterests_4['sum'] = tmpSmLli
    pcf.borrowPrincipal['sum'] = this.tmpSmBp
    pcf.borrowShortLoan['sum'] = this.tmpSmBsl
    pcf.interestOut['sum'] = this.tmpSmIo
    pcf.profitPay['sum'] = this.tmpSmPp
    pcf.otherOut_3['sum'] = this.tmpSmOo
    pcf.cashOut_3['sum']= this.tmpSmIo + this.tmpSmBp + this.tmpSmBsl + this.tmpSmOo

    pcf.facf['sum'] = pcf.cashIn_3['sum'] - pcf.cashOut_3['sum']
},
pcf.onClcltSm = function(){
    for(var yr =0;yr<npt.BUILD_YEAR+npt.OLC_YEAR ;yr++){
        var tmp = pcf.facf[yr]+pcf.iacf[yr]+pcf.racf[yr]
        pcf.cashFlow.push(tmp)

        if(yr == 0){
            pcf.sumFunds.push(tmp)
        }else{
            pcf.sumFunds.push(pcf.sumFunds[yr-1]+tmp)
        }
    }
    pcf.cashFlow['sum'] = pcf.facf['sum']+pcf.iacf['sum']+pcf.racf['sum']
    pcf.sumFunds['sum'] = pcf.cashFlow['sum']
}

pcf.saveData = function(){
    var resArr = []
    resArr.push(tool.getFormData(pcf.racf,{name:"经营活动净现金流量",rid:"pcf1",num:1}))
    resArr.push(tool.getFormData(pcf.cashIn,{name:"现金流入",rid:"pcf2",num:'1.1'}))
    resArr.push(tool.getFormData(pcf.revenue,{name:"营业收入",rid:"pcf3",num:'1.1.1'}))
    resArr.push(tool.getFormData(pcf.VATRecognitionTax,{name:"增值税销项税额",rid:"pcf4",num:'1.1.2'}))
    resArr.push(tool.getFormData(pcf.subIncome,{name:"补贴收入",rid:"pcf5",num:'1.1.3'}))
    resArr.push(tool.getFormData(pcf.otherIn,{name:"其他流入",rid:"pcf6",num:'1.1.4'}))
    resArr.push(tool.getFormData(pcf.investDifPic,{name:"投资价差",rid:"pcf7",num:'1.1.4.1'}))
    resArr.push(tool.getFormData(pcf.cashOut,{name:"现金流出",rid:"pcf8",num:'1.2'}))
    resArr.push(tool.getFormData(pcf.runCost,{name:"运营成本",rid:"pcf9",num:'1.2.1'}))
    resArr.push(tool.getFormData(pcf.inputVAT,{name:"增值税进项税额",rid:"pcf10",num:'1.2.2'}))
    resArr.push(tool.getFormData(pcf.oParatingTax,{name:"营业税金及附加",rid:"pcf11",num:'1.2.3'}))
    resArr.push(tool.getFormData(pcf.VAT,{name:"增值税",rid:"pcf12",num:'1.2.4'}))
    resArr.push(tool.getFormData(pcf.incomeTax,{name:"所得税",rid:"pcf13",num:'1.2.5'}))
    resArr.push(tool.getFormData(pcf.otherOut,{name:"其他流出(水利基金)",rid:"pcf14",num:'1.2.6'}))

    resArr.push(tool.getFormData(pcf.iacf,{name:"投资活动净现金流量",rid:"pcf15",num:'2'}))
    resArr.push(tool.getFormData(pcf.cashIn_2,{name:"现金流入",rid:"pcf16",num:'2.1'}))
    resArr.push(tool.getFormData(pcf.cashOut_2,{name:"现金流出",rid:"pcf17",num:'2.2'}))
    resArr.push(tool.getFormData(pcf.buildInvest,{name:"建设投资",rid:"pcf18",num:'2.2.1'}))
    resArr.push(tool.getFormData(pcf.keepRunInvest,{name:"维持运营投资",rid:"pcf19",num:'2.2.2'}))
    resArr.push(tool.getFormData(pcf.operatingFunds,{name:"流动资金",rid:"pcf21",num:'2.2.3'}))
    resArr.push(tool.getFormData(pcf.otherOut_2,{name:"其他流出",rid:"pcf22",num:'2.2.4'}))

    resArr.push(tool.getFormData(pcf.facf,{name:"筹资活动净现金流量",rid:"pcf23",num:3}))
    resArr.push(tool.getFormData(pcf.cashIn_3,{name:"现金流入",rid:"pcf24",num:'3.1'}))
    resArr.push(tool.getFormData(pcf.projectSelfCashIn,{name:"项目自有资金流入",rid:"pcf25",num:'3.1.1'}))
    resArr.push(tool.getFormData(pcf.buildInvestLoan,{name:"建设投资借款",rid:"pcf26",num:'3.1.2'}))
    resArr.push(tool.getFormData(pcf.flowCashLaon,{name:"流动资金借款",rid:"pcf27",num:'3.1.3'}))
    resArr.push(tool.getFormData(pcf.bonds,{name:"债卷",rid:"pcf28",num:'3.1.4'}))
    resArr.push(tool.getFormData(pcf.shortLoan,{name:"短期借款",rid:"pcf29",num:'3.1.5'}))
    resArr.push(tool.getFormData(pcf.cashOut_3,{name:"现金流出",rid:"pcf30",num:'3.2'}))
    resArr.push(tool.getFormData(pcf.interestOut,{name:"利息支出",rid:"pcf31",num:'3.2.1'}))
    resArr.push(tool.getFormData(pcf.longLoanInterest,{name:"长期借款利息",rid:"pcf32",num:null}))
    resArr.push(tool.getFormData(pcf.shortLoanInterest,{name:"短期借款利息",rid:"pcf33",num:null}))
    resArr.push(tool.getFormData(pcf.borrowPrincipal,{name:"偿还债务本金",rid:"pcf34",num:'3.2.2'}))
    resArr.push(tool.getFormData(pcf.borrowShortLoan,{name:"偿还短期借款",rid:"pcf35",num:'3.2.3'}))
    resArr.push(tool.getFormData(pcf.profitPay,{name:"应付利润",rid:"pcf36",num:'3.2.4'}))
    resArr.push(tool.getFormData(pcf.otherOut_3,{name:"其他流出",rid:"pcf37",num:'3.2.5'}))
    resArr.push(tool.getFormData(pcf.cashFlow,{name:"净现金流量",rid:"pcf38",num:'4'}))
    resArr.push(tool.getFormData(pcf.sumFunds,{name:"盈余资金",rid:"pcf39",num:5}))

    var dbHelper = require("../../utils/dbHelper");
    dbHelper.update("pcf",resArr);
};

module.exports = pcf