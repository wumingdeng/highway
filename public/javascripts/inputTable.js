/**
 * Created by Fizzo on 16/9/1.
 */

var npt = {}

//input staticData

npt.ZTZ = 936754 //总投资
npt.GNDKLX = 31736 //国内贷款利息
npt.JSTZ = [0,0.3,0.4,0.3] //建设投资
npt.DKTRB = [0,0.3,0.4,0.3] //贷款投入例
npt.ZYZJ = 0.2 //自有资金比
npt.CAPITAL_PT = 0.2 //资本金比
npt.LOAN_YEAR = 19 //贷款年限
npt.DF = 0 //地方
npt.TZ = 1//投资
npt.LX = 1//利息
npt.SR = 1//收入
npt.BUILD_YEAR = 4 //建设期
npt.OLC_YEAR  = 30 //运营期
npt.LENGTH = 133.740 //全厂
npt.INTEREST_RT_1 = 0.049 //贷款五年以上利率
npt.INTEREST_RT_2 = 0.0435 //短期贷款利率(一年内)

npt.PRICE_DIF_PT = 0.15 //价差的比例
npt.PRICE_DIF_TAX_RT = 0.25 //价差税率

npt.GNLL = npt.INTEREST_RT_1 * npt.LX //国内利率
npt.BUILD_PROFIT_PT = 0 //施工利润比例
npt.BUILD_PROFIT_TAX_RT = 0.25 //施工利润税率
npt.VAT = 0.05 //增值税

npt.CT = 1 //中交
npt.CT_RUN_DIS_PT = 1 //中交运营期粉红比例
npt.CDB_FUND_INTEREST_RT = 0.012 //国开行基金利率
npt.CDB_FUND_PT = 0 //国开基金比例
npt.CDB_FUND_M = 0//国开基金金额
npt.LOCAL_GRANT = 0 //地方补助
npt.PART_GRANT_PT = 0.28 //部补助比例
npt.BASE_DISCOUNT_RT = 0.07 // 基准折现率
npt.INCONE_TAX = 0.25 //所得税
npt.TURNOVER_TAX = 0.05 //流转税
npt.BUILD_SETTLEMENT_M = 662797 // 建安费
npt.FLOAT_RT = 0 // 浮动比例

npt.fltSttlmntM = npt.BUILD_SETTLEMENT_M * (1-npt.FLOAT_RT) //下浮后的建安费
npt.sttlmntPt = npt.BUILD_SETTLEMENT_M / npt.ZTZ //建安费比例
npt.loanPt = 1- npt.CAPITAL_PT //贷款比例
npt.invest = 0 //总投资
npt.jttz = 0 //静态投资
npt.dk = [] //贷款数额
npt.lx = [] //利息数额
npt.dksum = 0 //贷款总数
npt.lxsum = 0 //利息总和
npt.sjdkbl = 0 //实际贷款比例
npt.xydkje = 0 //需要贷款金额
npt.zyzjsum = 0 //自有资金 = 项目资本金
npt.zbj_CT = 0 //中交资本金
npt.zbj_LOCAL = 0 //地方资本金
npt.localSubSum = 0 //地方补贴总额
npt.localBalance = 0 //扣除地方资本金后金额

npt.zyzij = [] //自有资金
npt.blbzcddk_Grant = 0 // 部里补助冲抵贷款 BBZ-zbj_LOCAL  (冲减贷款模式)
npt.blbzcddk_Invest = 0 // 部里补助冲抵贷款 BBZ-zbj_LOCAL  (冲减资本金模式)
npt.pfitIncm = [] // 利润收入
npt.partGrant = 0//部补助
npt.picDifIncm = [] // 价差收入
npt.picDifIncmSm = 0 //价差收入合计
npt.projectInvestSums = [] // 项目总投资

npt.calculatedNum = 0 //存储上一个计算出的总投资数目,当递归到当前值与上一个数值平衡时候,跳出循环

//价差收入
for(var yr = 0 ;yr<npt.BUILD_YEAR;yr++){
    var tempPic = npt.JSTZ[yr] * npt.fltSttlmntM * npt.PRICE_DIF_PT *(1-npt.PRICE_DIF_TAX_RT)*npt.TZ
    npt.picDifIncmSm = npt.picDifIncmSm + tempPic
    npt.picDifIncm.push(tempPic)
}

//利润收入
for(var yr = 0 ;yr<npt.BUILD_YEAR;yr++){
    var tempPf = npt.JSTZ[yr] * npt.fltSttlmntM * npt.BUILD_PROFIT_PT *(1-npt.BUILD_PROFIT_TAX_RT)*npt.TZ
    npt.pfitIncm.push(tempPf)
}

function onCalculate(ztz){
    for(var by =0;by<npt.BUILD_YEAR;by++){
        var tempZyz = npt.ZYZJ * ztz * npt.JSTZ[by]
        npt.zyzjsum = npt.zyzjsum + tempZyz
        npt.zyzij[by] = (tempZyz)
    }
    npt.zbj_LOCAL = npt.DF*npt.zyzjsum
    npt.partGrant = ztz*npt.PART_GRANT_PT
    npt.blbzcddk_Grant = npt.partGrant - npt.zbj_LOCAL
    npt.sjdkbl = ztz * npt.loanPt - npt.blbzcddk_Grant //实际贷款比例 ＝ 需贷款金额
    npt.lxsum = 0
    for(var by =0;by<npt.BUILD_YEAR;by++){
        var tempDk = npt.sjdkbl * npt.DKTRB[by]
        npt.dksum = npt.dksum + tempDk
        npt.dk[by] = tempDk
        var tempPlus = 0
        var time = 0
        while(time < by){
            tempPlus = tempPlus + npt.dk[time]
            time++
        }
        var tempLx = (tempPlus+tempDk/2)*npt.GNLL
        npt.lxsum = npt.lxsum + tempLx
        npt.lx[by] = tempLx
    }
    npt.jttz = npt.TZ*(npt.ZTZ-npt.GNDKLX)
    ztz = npt.jttz + npt.lxsum
    if(npt.calculatedNum == ztz){
        npt.invest = ztz
        console.log(ztz)
        return
    }
    npt.calculatedNum = ztz
    onCalculate(ztz)
}
onCalculate(0)

for(var y = 0;y<npt.BUILD_YEAR;y++){
    npt.projectInvestSums.push(npt.invest * npt.JSTZ[y])
}

npt.zbj_CT = npt.CT * npt.zyzjsum //中交资本金
npt.localSubSum = npt.LOCAL_GRANT + npt.partGrant //地方补贴总额
npt.localBalance = npt.localSubSum - npt.zbj_LOCAL//扣除地方资本金后金额

if(npt.localBalance > npt.zbj_CT){
    npt.blbzcddk_Invest = npt.localBalance - npt.zbj_CT
}

/**
 * "_grant" 冲减贷款模式,"_invest" 冲减资本金模式
 * */
//需要贷款金额
npt.loanMoney_grant = npt.sjdkbl // (=实际贷款比例)
npt.loanMoney_invest = npt.invest*npt.loanPt-npt.blbzcddk_Invest
//部里补助冲抵中交资本金
npt.ptGntBlncCTInvst_grant = 0
if(npt.localBalance > npt.zbj_CT){
    npt.ptGntBlncCTInvst_invest = npt.zbj_CT
}else{
    npt.ptGntBlncCTInvst_invest = npt.localBalance
}

//部里补助冲抵地方资本金
npt.ptGntBlncLclInvst_grant = npt.zbj_LOCAL
npt.ptGntBlncLclInvst_invest = npt.zbj_LOCAL

//中交自由资金
npt.CTCapital_grant = npt.zbj_CT
npt.CTCapital_invest = npt.zbj_CT -npt.ptGntBlncCTInvst_invest

module.exports = npt



