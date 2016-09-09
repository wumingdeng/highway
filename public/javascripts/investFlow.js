/**
 * Created by Fizzo on 16/9/7.
 */

var inf = {
    cashIn:[], //现金流入
    income:[], //收入收费
    rcyclFixdAsstsBlncs:[],//回收固定资产余额
    otherIncome:[],//其他收入
    picDifInvst:[], //投资价差

    cashOut:[], // 现金流出
    projectCapital:[],//项目资本金
    bwPrincipal:[],//借款本金偿还
    bwInterest:[],//借款利息支付
    runCost:[],//经营成本
    vat:[],//增值税
    incomeTax:[],//所得税
    waterFunds:[],//水利基金 TODO 没有数据
    cashFlow:[],//净现金流量
    cashFlowSum:[],//净现金流量统计
    onClcltCi:function(){
        this.picDifInvst = npt.picDifIncm
        this.otherIncome = npt.picDifIncm
        var tmpSmRfab = 0
        var tmpSmi = 0
        for(var yr = 0;yr<npt.BUILD_YEAR+npt.OLC_YEAR;yr++){
            var tmpi,tmpRfab = 0
            if(yr < npt.BUILD_YEAR){
                this.rcyclFixdAsstsBlncs.push(0)
                this.income.push(0)
            }else{
                this.picDifInvst.push(0)
                this.otherIncome.push(0)

                tmpi = sfsrResultTab[yr-npt.BUILD_YEAR]
                tmpSmi = tmpSmi + tmpi
                this.income.push(tmpi)

                tmpRfab = cashFlow.hszcyzArr[yr-npt.BUILD_YEAR]
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
    onClcltCo:function(){
        var tmpSmPc = 0
        var tmpSmBpp = 0
        var tmpSmBi=0
        var tmpSmRc=0
        var tmpSmVat=0
        var tmpSmIt=0
        var tmpSmWf = 0
        for(var yr = 0;yr<npt.BUILD_YEAR+npt.OLC_YEAR;yr++){
            var tmpPc = 0
            var tmpBpp = 0
            var tmpBi=0
            var tmpRc=0
            var tmpVat=0
            var tmpIt=0
            var tmpWf = 0
            if(yr < npt.BUILD_YEAR){
                tmpPc = (npt.CTCapital_grant + npt.ptGntBlncLclInvst_grant)*npt.JSTZ[yr]
                tmpSmPc = tmpSmPc + tmpPc
                this.projectCapital.push(tmpPc)

                this.bwPrincipal.push(0)
                this.bwInterest.push(0)
                this.runCost.push(0)
                this.vat.push(0)
                this.incomeTax.push(0)
                this.waterFunds.push(0)
            }else{
                tmpBpp = rcwi.repayCapitals_4[yr-npt.BUILD_YEAR]
                tmpSmBpp = tmpSmBpp + tmpBpp
                this.bwPrincipal.push(tmpBpp)

                tmpBi = cst.interestExpends[yr-npt.BUILD_YEAR]
                tmpSmBi = tmpSmBi + tmpBi
                this.bwInterest.push(tmpBi)

                tmpRc = cst.runCosts[yr-npt.BUILD_YEAR]
                tmpSmRc = tmpSmRc + tmpRc
                this.runCost.push(tmpRc)

                tmpVat = pfit.vats[yr-npt.BUILD_YEAR]
                tmpSmVat = tmpSmVat + tmpVat
                this.vat.push(tmpVat)

                tmpIt = pfit.incomeTax[yr-npt.BUILD_YEAR]
                tmpSmIt = tmpSmIt + tmpIt
                this.incomeTax.push(tmpIt)

                tmpWf = 0
                tmpSmWf = tmpSmWf + tmpWf
                this.waterFunds.push(tmpWf)
            }
            var tmpCo = tmpPc+tmpBpp+tmpBi+tmpRc+tmpVat+tmpIt+tmpWf
            this.cashOut.push(tmpCo)
        }
        this.projectCapital['sum'] = tmpSmPc
        this.bwPrincipal['sum'] = tmpSmBpp
        this.bwInterest['sum'] = tmpSmBi
        this.runCost['sum'] = tmpSmRc
        this.vat['sum'] = tmpSmVat
        this.incomeTax['sum'] = tmpSmIt
        this.waterFunds['sum'] = tmpSmWf
        this.cashOut['sum'] = tmpSmPc + tmpSmBpp +tmpSmBi+tmpSmRc+tmpSmVat+tmpSmIt+tmpSmWf
    },
    onClcltSum:function() {
        // cashFlow:[],//净现金流量
        //     cashFlowSum:[],//净现金流量统计
        for (var yr = 0; yr < npt.BUILD_YEAR + npt.OLC_YEAR; yr++) {
            this.cashFlow.push(this.cashIn[yr]-this.cashOut[yr])
            if(yr == 0 ){
                this.cashFlowSum.push(this.cashFlow[yr])
            }else{
                this.cashFlowSum.push(this.cashFlow[yr] + this.cashFlowSum[yr-1])
            }
        }
        this.cashFlow['sum'] = this.cashIn['sum'] - this.cashOut['sum']
    }
}