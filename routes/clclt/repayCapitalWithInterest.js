/**
 * Created by Fizzo on 16/9/2.
 * 还本付息表
 */

/**
 *
 * 当期还本付息,还本,付息,本年应计利息 不用建设期数据*/


var npt = require("./inputTable.js")
var pfit = require("./profit.js")
var cst = require("./cost.js")

var rcwi = {}
//借款.1
rcwi.interestRate = 0.049 //利率

rcwi.borrowMoneyBalanceBefore_1 = [] // 期初借款余额
rcwi.borrowMoneyCurYear = npt.dk //本年借款 输入表Dk
rcwi.curYearInterests = []//本年应计利息
rcwi.repayCapitalPayInterests_1 = [] //当期还本付息
rcwi.repayCapitals_1 = [] //还本
rcwi.payInterests_1 = [] //付息
rcwi.borrowMoneyBalanceLast_1 = [] //期末借款余额

//借款.2
rcwi.borrowMoneyBalanceBefore_2 = [] // 期初借款余额
rcwi.repayCapitalPayInterests_2 = [] //当期还本付息
rcwi.repayCapitals_2 = [] //还本
rcwi.payInterests_2 = [] //付息
rcwi.borrowMoneyBalanceLast_2 = [] //期末借款余额

//债卷
rcwi.borrowMoneyBalanceBefore_3 = [] //期初债务余额
rcwi.repayCapitalPayInterests_3 = [] //当期还本付息
rcwi.repayCapitals_3 = [] //还本
rcwi.payInterests_3= [] //付息
rcwi.borrowMoneyBalanceLast_3 = [] //期末借款余额
//借款和债卷合计
rcwi.balanceBefore_4 = [] //期初余额
rcwi.repayCapitalPayInterests_4 = [] //当期还本付息
rcwi.repayCapitals_4 = [] //还本
rcwi.payInterests_4= [] //付息
rcwi.balanceLast_4 = [] //期末余额

rcwi.interestPayRate = [] // 利息备付率
rcwi.payInterestRate = [] //偿还备付率


rcwi.onOutput = function(){
    var jdArr = []
    function onClct(rid,tempArr,name,index){
        var jd = {}
        for(var yr = 0;yr<npt.BUILD_YEAR+npt.OLC_YEAR;yr++){
            if(yr<npt.BUILD_YEAR) {
                if(tempArr.length == npt.OLC_YEAR) {
                    jd['b' + yr] = 0
                }else {
                    jd['b' + yr] = tempArr[yr]
                }
            }else{
                if(tempArr.length == npt.BUILD_YEAR){
                    jd['r'+ String(yr-npt.BUILD_YEAR)] = 0
                }else{
                    jd['r'+ String(yr-npt.BUILD_YEAR)] = tempArr[yr]
                }
            }
        }
        jd.total = tempArr['sum'] || 0
        jd.name = name;
        jd.num = index;
        jd.rid = rid;
        // if(tempArr['sum']) {
        //     jd['s'] = tempArr['sum']
        // }else
        jdArr.push(jd)
    }
    onClct(1,[],"借款1",1)
    onClct(2,this.borrowMoneyBalanceBefore_1,"期初借款余额",1.1)
    onClct(3,this.borrowMoneyCurYear,"本年借款")
    onClct(4,this.curYearInterests,"本年应计利息")
    onClct(5,this.repayCapitalPayInterests_1,"当期还本付息",1.2)
    onClct(6,this.repayCapitals_1,"其中:还本")
    onClct(7,this.payInterests_1,"付息")
    onClct(8,this.borrowMoneyBalanceLast_1,"期末借款余额",1.3)


    onClct(9,[],"借款2",2)
    onClct(10,this.borrowMoneyBalanceBefore_2,"期初借款余额",2.1)
    onClct(11,this.repayCapitalPayInterests_2,"当期还本付息",2.2)
    onClct(12,this.repayCapitals_2,"其中:还本")
    onClct(13,this.payInterests_2,"付息")
    onClct(14,this.borrowMoneyBalanceLast_2,"期末借款余额",2.3)

    onClct(15,[],"债券",3)
    onClct(16,this.borrowMoneyBalanceBefore_3,"期初债务余额",3.1)
    onClct(17,this.repayCapitalPayInterests_3,"当期还本付息",3.2)
    onClct(18,this.repayCapitals_3,"其中:还本")
    onClct(19,this.payInterests_3,"付息")
    onClct(20,this.borrowMoneyBalanceLast_3,"期末债务余额",3.3)


    onClct(21,[],"借款和债券合计",4)
    onClct(22,this.balanceBefore_4,"初期余额",4.1)
    onClct(23,this.repayCapitalPayInterests_4,"当期还本付息",4.2)
    onClct(24,this.repayCapitals_4,"其中:还本")
    onClct(25,this.payInterests_4,"付息")
    onClct(26,this.balanceLast_4,"期末余额",4.3)
    onClct(27,this.interestPayRate,"利息备付率(%)")
    onClct(28,this.payInterestRate,"偿债备付率(%)")

    //写入数据库
    // var dbHelper = require("../../utils/dbHelper");
    // dbHelper.update("hbfx",jdArr);

    return jdArr
}
//利息备付率
rcwi.onCalculateInterestPayRate = function(){
    for(var by = 0;by<npt.BUILD_YEAR;by++){
        rcwi.interestPayRate.push(0)
    }

    for(var ry = 0;ry<npt.OLC_YEAR;ry++){
        var temp = 0
        if( cst.interestExpends[ry] != 0){
            temp = pfit.intstBfPrfits[ry]/ cst.interestExpends[ry]
        }
        rcwi.interestPayRate.push(temp)
    }
    rcwi.interestPayRate['sum'] = pfit.intstBfPrfits['sum']/rcwi.payInterests_4['sum']
}
// 偿还备付率 TODO
rcwi.onCalculatePayInterestRate = function(){
    for(var by = 0;by<npt.BUILD_YEAR;by++){
        rcwi.payInterestRate.push(0)
    }

    for(var ry = 0;ry<npt.OLC_YEAR;ry++){
        var temp = 0
        if(cst.interestExpends[ry] != 0){
            temp = pfit.intstBfPrfits[ry]/cst.interestExpends[ry]
        }
        rcwi.payInterestRate.push(temp)
    }
}

rcwi.onRepayCapitals = function(yr){
    var tempbmbb_1 = 0 //初期借款余额
    var tmlli = 0 //长期借款利息
    if(yr != 0){
        tempbmbb_1 = rcwi.balanceLast_4[yr-1]
    }

    if(yr>=npt.BUILD_YEAR){
        var tempCyi = tempbmbb_1 * npt.GNLL
        //还本

        rcwi.curYearInterests.push(tempCyi)
        rcwi.payInterests_1.push(tempCyi)

        tmlli = tempCyi + 0 + 0
        rcwi.payInterests_4.push(tmlli)
    }
    return tmlli
}
/**
 * 暂时不算入 借款.2 债卷*/
rcwi.onCalculateBorrowMoneyBalance = function(yr,pcf){
    var tempbmbb_1 = 0 //初期借款余额
    var tempbmbl_1 = 0 //期末借款余额
    var tempbl_4 = 0 //期末余额
    var tempbb_4 = 0 //期初余额

    // var tmlli = 0 //长期借款利息
    if(yr != 0){
        tempbmbb_1 = rcwi.balanceLast_4[yr-1]

        tempbb_4 = tempbmbb_1 + 0 + 0
    }
    
    if(yr<npt.BUILD_YEAR){
        tempbmbl_1 = tempbmbb_1 - 0 + rcwi.borrowMoneyCurYear[yr]
        tempbl_4 = tempbmbl_1
    }else {
        // var tempCyi = tempbmbb_1 * npt.GNLL
        //还本

        var tempRc_1 = 0
        if (yr != npt.BUILD_YEAR) {
            var temp = pfit.intstDpcitBfPrfits[yr - npt.BUILD_YEAR] - rcwi.curYearInterests[yr - npt.BUILD_YEAR] - pfit.incomeTax[yr - npt.BUILD_YEAR] - pcf.shortLoan[yr - 1] - pcf.shortLoanInterest[yr]
            if ( temp >= 0) {
                if (tempbmbb_1 != 0) {
                    tempRc_1 = Math.min(temp, tempbmbb_1)
                }
            }
        }
        rcwi.repayCapitals_1.push(tempRc_1)
        tempbmbl_1 = tempbmbb_1 - tempRc_1
        tempbl_4 = tempbmbl_1

        // rcwi.curYearInterests.push(tempCyi)
        var tempCyi = rcwi.payInterests_1[yr-npt.BUILD_YEAR]
        // rcwi.payInterests_1.push(tempCyi)
        rcwi.repayCapitalPayInterests_1.push(tempCyi+tempRc_1)
        rcwi.repayCapitals_4.push(tempRc_1 + 0 + 0)

        // tmlli = tempCyi +0 +0
        // rcwi.payInterests_4.push(tmlli)
        rcwi.repayCapitalPayInterests_4.push((tempCyi+tempRc_1)+0+0)
    }
    rcwi.balanceBefore_4.push(tempbb_4+0+0)
    rcwi.borrowMoneyBalanceBefore_1.push(tempbmbb_1)
    if(yr == 0){
        rcwi.balanceLast_4.push(0)
    }else{
        rcwi.balanceLast_4.push(tempbl_4+0+0)
    }
    rcwi.borrowMoneyBalanceLast_1.push(tempbmbl_1)
    // return tmlli
}

module.exports = rcwi