/**
 * Created by Fizzo on 16/9/2.
 * 还本付息表
 */

/**
 *
 * 当期还本付息,还本,付息,本年应计利息 不用建设期数据*/
var rpyCpitlWthIntst = {}
//借款.1
rpyCpitlWthIntst.interestRate = 0.049 //利率

rpyCpitlWthIntst.borrowMoneyBalanceBefore_1 = [] // 期初借款余额
rpyCpitlWthIntst.borrowMoneyCurYear = npt.dk //本年借款 输入表Dk
rpyCpitlWthIntst.curYearInterests = []//本年应计利息
rpyCpitlWthIntst.repayCapitalPayInterests_1 = [] //当期还本付息
rpyCpitlWthIntst.repayCapitals_1 = [] //还本
rpyCpitlWthIntst.payInterests_1 = [] //付息
rpyCpitlWthIntst.borrowMoneyBalanceLast_1 = [] //期末借款余额

//借款.2
rpyCpitlWthIntst.borrowMoneyBalanceBefore_2 = [] // 期初借款余额
rpyCpitlWthIntst.repayCapitalPayInterests_2 = [] //当期还本付息
rpyCpitlWthIntst.repayCapitals_2 = [] //还本
rpyCpitlWthIntst.payInterests_2 = [] //付息
rpyCpitlWthIntst.borrowMoneyBalanceLast_2 = [] //期末借款余额

//债卷
rpyCpitlWthIntst.borrowMoneyBalanceBefore_3 = [] //期初借款余额
rpyCpitlWthIntst.repayCapitalPayInterests_3 = [] //当期还本付息
rpyCpitlWthIntst.repayCapitals_3 = [] //还本
rpyCpitlWthIntst.payInterests_3= [] //付息
rpyCpitlWthIntst.borrowMoneyBalanceLast_3 = [] //期末借款余额
//借款和债卷合计
rpyCpitlWthIntst.balanceBefore_4 = [] //期初余额
rpyCpitlWthIntst.repayCapitalPayInterests_4 = [] //当期还本付息
rpyCpitlWthIntst.repayCapitals_4 = [] //还本
rpyCpitlWthIntst.payInterests_4= [] //付息
rpyCpitlWthIntst.balanceLast_4 = [] //期末余额

rpyCpitlWthIntst.interestPayRate = [] // 利息备付率
rpyCpitlWthIntst.payInterestRate = [] //偿还备付率

//利息备付率
function onCalculateInterestPayRate(){
    for(var by = 0;by<npt.BUILD_YEAR;by++){
        rpyCpitlWthIntst.interestPayRate.push(0)
    }

    for(var ry = 0;ry<MAX_YEAR;ry++){
        var temp = 0
        if(interestExpends[ry] != 0){
            temp = interestBeforeProfits[ry]/interestExpends[ry]
        }
        rpyCpitlWthIntst.interestPayRate.push(temp)
    }
    rpyCpitlWthIntst.interestPayRate['sum'] = interestBeforeProfits['sum']/rpyCpitlWthIntst.payInterests_4['sum']
}
// 偿还备付率 TODO
function onCalculatePayInterestRate(){
    for(var by = 0;by<npt.BUILD_YEAR;by++){
        rpyCpitlWthIntst.payInterestRate.push(0)
    }

    for(var ry = 0;ry<MAX_YEAR;ry++){
        var temp = 0
        if(interestExpends[ry] != 0){
            temp = interestBeforeProfits[ry]/interestExpends[ry]
        }
        rpyCpitlWthIntst.payInterestRate.push(temp)
    }
}

/**
 * 暂时不算入 借款.2 债卷*/
function onCalculateBorrowMoneyBalanceBefore_1(){
    for(var yr=0;yr<npt.BUILD_YEAR + MAX_YEAR;yr++){
        var tempbmbb_1 = 0 //初期借款余额
        var tempbmbl_1 = 0 //期末借款余额
        var tempbl_4 = 0 //期末余额
        if(yr != 0){
            tempbmbb_1 = rpyCpitlWthIntst.balanceLast_4[yr-1]
        }
        if(yr<npt.BUILD_YEAR){
            tempbmbl_1 = tempbmbb_1 - 0 + rpyCpitlWthIntst.borrowMoneyCurYear[yr]
            tempbl_4 = tempbmbl_1
        }else{
            //利润
            var tempRc_1 = 0
            rpyCpitlWthIntst.repayCapitals_1.push(tempRc_1)

            tempbmbl_1 = tempbmbb_1 - tempRc_1
            tempbl_4 = tempbmbl_1

            var tempCyi =tempbmbb_1*npt.GNLL
            rpyCpitlWthIntst.curYearInterests.push(tempCyi)
            rpyCpitlWthIntst.payInterests_1.push(tempCyi)
        }
        rpyCpitlWthIntst.borrowMoneyBalanceBefore_1.push(tempbmbb_1)
        rpyCpitlWthIntst.balanceLast_4.push(tempbl_4)
        rpyCpitlWthIntst.borrowMoneyBalanceLast_1.push(tempbmbl_1)
    }
}