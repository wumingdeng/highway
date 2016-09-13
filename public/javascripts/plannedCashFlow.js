/**
 * Created by Fizzo on 16/9/6.
 */

var npt = require("./inputTable.js")
var cashFlow = require("./cashFlow.js")
var income = require("./incomeTable.js")
var pfit = require('./profit.js')
var cst = require("./cost.js")
var rcwi = require("./repayCapitalWithInterest.js")

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
    for(var yr = 0;yr>npt.BUILD_YEAR+npt.OLC_YEAR;yr++){
        if(yr<npt.BUILD_YEAR){
            pcf.otherOut.push(0)
            pcf.runCost.push(0)
            pcf.oParatingTax.push(0)
            pcf.incomeTax.push(0)

            this.revenue.push(0)
            this.subIncome.push(cashFlow.btsr[yr])
            this.investDifPic.push(npt.picDifIncm[yr])
            //TODO
            //加了两行不知什么鬼的空白信息,so.直接等于补贴收入
            this.otherIn.push(npt.picDifIncm[yr])
            tempSumSi = tempSumSi + cashFlow.btsr[yr]
            tempSumIdp = tempSumIdp + npt.picDifIncm[yr]
            tempSumOi = tempSumOi + npt.picDifIncm[yr]
        }else{
            pcf.oParatingTax.push(pfit.vats[yr-npt.BUILD_YEAR])
            pcf.runCost.push(cst.runCosts[yr-npt.BUILD_YEAR])
            pcf.otherOut.push(cst.irrigationFunds[yr-npt.BUILD_YEAR])
            pcf.incomeTax.push(pfit.incomeTax[yr-npt.BUILD_YEAR])
            tempSumOpt = tempSumOpt+pfit.vats[yr-npt.BUILD_YEAR]
            tempSumRc = tempSumRc + cst.runCosts[yr-npt.BUILD_YEAR]
            tempSumOo = tempSumOo + cst.irrigationFunds[yr-npt.BUILD_YEAR]
            tempSumIt = tempSumIt + pfit.incomeTax[yr-npt.BUILD_YEAR]
            this.revenue.push(income.incomeTable[yr])
            tempSumRe = tempSumRe + income.incomeTable[yr]
        }
        pcf.cashIn.push(this.revenue[yr]+this.subIncome[yr]+this.investDifPic[yr]+this.otherIn[yr])
        pcf.cashOut.push(pfit.vats[yr]+cst.runCosts[yr]+cst.irrigationFunds[yr]+pfit.incomeTax[yr])

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
    pcf.cashIn['sum']= tempSumSi + tempSumIdp + tempSumOi + tempSumRe

    pcf.racf['sum'] = pcf.cashIn['sum'] - pcf.cashOut['sum']
}



pcf.onClcltIacf = function()
{
    pcf.buildInvest = npt.projectInvestSums
    var tempSumCo = 0
    var tempSumbd = 0

    for(var yr = 0;yr>npt.BUILD_YEAR;yr++){

        pcf.cashIn_2.push(0)
        //TODO
        //还有三行没有数据的字段所以暂时用0 代替
        pcf.cashOut_2.push(pcf.buildInvest[yr]+0+0+0)
        tempSumCo = tempSumCo + pcf.buildInvest[yr]
        tempSumbd = tempSumbd + pcf.buildInvest[yr]
        pcf.iacf.push(pcf.cashIn_2[yr] - pcf.cashOut_2[yr])
    }

    pcf.cashOut_2['sum']= tempSumCo
    pcf.cashIn_2['sum']= 0
    pcf.buildInvest['sum'] = tempSumbd
    pcf.iacf['sum'] = pcf.cashIn_2['sum'] - pcf.cashOut_2['sum']
}
var tmpSmIo = 0
var tmpSmpsci = 0

var tmpSmBp = 0
var tmpSmBsl = 0
var tmpSmPp = 0
var tmpSmOo = 0
pcf.onClcltFacf = function(yr)
{

    this.buildInvestLoan = npt.dk

    // for(var yr = 0;yr>npt.BUILD_YEAR+npt.OLC_YEAR;yr++){
    pcf.flowCashLaon.push(0)
    pcf.bonds.push(0)
    if(yr < npt.BUILD_YEAR){
        var psci = npt.zyzij[yr]-npt.picDifIncm[yr]-npt.ptGntBlncCTInvst_invest*npt.JSTZ[yr]
        this.projectSelfCashIn.push(psci)
        tmpSmpsci = tmpSmpsci + psci
        //this.shortLoan.push(0)
        pcf.longLoanInterest.push(0)
        pcf.borrowPrincipal.push(0)
        pcf.profitPay.push(0)
        pcf.cashOut_3.push(0)
        this.interestOut.push(0)
    }else{
        var tmpIo = cst.interestExpends[yr-npt.BUILD_YEAR]
        tmpSmIo = tmpSmIo + tmpIo
        this.interestOut.push(tmpIo)

        if (rcwi.repayCapitals_1[yr-npt.BUILD_YEAR]){
            var tmpBp = rcwi.repayCapitals_1[yr-npt.BUILD_YEAR]
        }else{
            var tmpBp = 0
        }

        tmpSmBp = tmpSmBp + tmpBp
        pcf.borrowPrincipal.push(tmpBp)

        var tmpBsl =  this.shortLoan[yr-1]
        tmpSmBsl = tmpSmBsl + tmpBsl
        pcf.borrowShortLoan.push(tmpBsl)

        var tmpPp = 0
        tmpSmPp = tmpSmPp + tmpPp
        pcf.profitPay.push(tmpPp)

        var tmpOo = 0
        tmpSmOo = tmpSmOo + tmpOo
        pcf.otherOut_3.push(tmpOo)

        pcf.cashOut_3.push(tmpIo+tmpBp+tmpBsl+tmpPp+tmpOo)

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
    var tmpSmSl = 0
    var tmpSmSli = 0
    for(var yr = 0;yr<npt.BUILD_YEAR+npt.OLC_YEAR;yr++) {
        var tmSli = 0
        var tmlli = 0
        if (yr != 0) {
            tmSli = npt.INTEREST_RT_2 * this.shortLoan[yr - 1]

            tmpSmSli = tmpSmSli + tmSli
        }


        tmlli = rcwi.onRepayCapitals(yr,pcf)
//         tmlli = rcwi.onCalculateBorrowMoneyBalance(yr, pcf)
        
        pcf.shortLoanInterest.push(tmSli)
        pcf.longLoanInterest.push(tmlli)
        if(yr>=npt.BUILD_YEAR){
            cst.loanLongs.push(tmlli)
            cst.loanShorts.push(tmSli)
            //利息的支出
            cst.interestExpends.push(tmSli + tmlli)

            pcf.onClcltFacf(yr)

            cst.onCalculateSumCost(yr-npt.BUILD_YEAR)

            pfit.onCalculateProfitSums(yr-npt.BUILD_YEAR)
            
            pfit.intstBfPrfits.push(pfit.profitSums[yr-npt.BUILD_YEAR] + cst.interestExpends[yr-npt.BUILD_YEAR] - pfit.makeUpLoseMoneys[yr-npt.BUILD_YEAR])
            pfit.intstDpcitBfPrfits.push(pfit.intstBfPrfits[yr-npt.BUILD_YEAR] + cst.depreciates[yr-npt.BUILD_YEAR] + cst.promoteSales[yr-npt.BUILD_YEAR])

            pfit.onCalculateSelfTaxations(yr-npt.BUILD_YEAR)
            pfit.onCalculateTaxation(yr-npt.BUILD_YEAR)
            //=IF((H35-利润表!D16+利润表!D13)<0,0,(H35-利润表!D16+利润表!D13))
            var tmpSl = pcf.cashOut_3[yr] - pfit.intstDpcitBfPrfits[yr-npt.BUILD_YEAR] + pfit.incomeTax[yr-npt.BUILD_YEAR]

            if(tmpSl < 0) tmpSl = 0
            tmpSmSl = tmpSmSl + tmpSl
            this.shortLoan.push(tmpSl)

        }else{
            pcf.onClcltFacf(yr)
            this.shortLoan.push(0)
        }
        rcwi.onCalculateBorrowMoneyBalance(yr,pcf)
    }
    pcf.shortLoan['sum'] = tmpSmSl
    pcf.shortLoanInterest['sum'] = tmpSmSli

    pcf.buildInvestLoan['sum'] = npt.sjdkbl
    pcf.flowCashLaon['sum'] = 0
    pcf.bonds['sum'] = 0

    pcf.projectSelfCashIn['sum'] = tmpSmpsci
    pcf.cashIn_3['sum']= npt.sjdkbl + tmpSmpsci + pcf.shortLoan['sum']


    pcf.longLoanInterest['sum'] = rcwi.payInterests_4['sum']

    pcf.borrowPrincipal['sum'] = tmpSmBp
    pcf.borrowShortLoan['sum'] = tmpSmBsl
    pcf.interestOut['sum'] = tmpSmIo
    pcf.profitPay['sum'] = tmpSmPp
    pcf.otherOut_3['sum'] = tmpSmOo
    pcf.cashOut_3['sum']= tmpSmIo + tmpSmBp + tmpSmBsl + tmpSmOo

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

module.exports = pcf