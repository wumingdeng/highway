/**
 * Created by Fizzo on 16/9/2.
 * 还本付息表
 */

/**
 * 下标0为建设期,1为运营期,2为合计*/

//借款.1
var interestRate = 0.049 //利率

var borrowMoneyBalanceBefore_1 = [] // 期初借款余额
var borrowMoneyCurYear = [] //本年借款
var curYearInterests = []//本年应计利息
var repayCapitalPayInterests_1 = [] //当期还本付息
var repayCapitals_1 = [] //还本
var payInterests_1 = [] //付息
var borrowMoneyBalanceLast_1 = [] //期末借款余额

//借款.2
var borrowMoneyBalanceBefore_2 = [] // 期初借款余额
var repayCapitalPayInterests_2 = [] //当期还本付息
var repayCapitals_2 = [] //还本
var payInterests_2 = [] //付息
var borrowMoneyBalanceLast_2 = [] //期末借款余额

//债卷
var borrowMoneyBalanceBefore_3 = [] //期初借款余额
var repayCapitalPayInterests_3 = [] //当期还本付息
var repayCapitals_3 = [] //还本
var payInterests_3= [] //付息
var borrowMoneyBalanceLast_3 = [] //期末借款余额
//借款和债卷合计
var borrowMoneyBalanceBefore_4 = [] //期初余额
var repayCapitalPayInterests_4 = [] //当期还本付息
var repayCapitals_4 = [] //还本
var payInterests_4= [] //付息
var borrowMoneyBalanceLast_4 = [] //期末余额

var interestPayRate = [] // 利息备付率
var payInterestRate = [] //偿还备付率

//利息备付率
function onCalculateInterestPayRate(){
    interestPayRate[0] = []
    for(var by = 0;by<BUILD_YEAR;by++){
        interestPayRate[0].push(0)
    }

    interestPayRate[1] = []
    for(var ry = 0;ry<MAX_YEAR;ry++){
        var temp = 0
        if(interestExpends[ry] != 0){
            temp = interestBeforeProfits[ry]/interestExpends[ry]
        }
        interestPayRate[1].push(temp)
    }
    interestPayRate[2] = interestBeforeProfits['sum']/payInterests_4[2]
}
// 偿还备付率 TODO
function onCalculatePayInterestRate(){
    payInterestRate[0] = []
    for(var by = 0;by<BUILD_YEAR;by++){
        payInterestRate[0].push(0)
    }

    payInterestRate[1] = []
    for(var ry = 0;ry<MAX_YEAR;ry++){
        var temp = 0
        if(interestExpends[ry] != 0){
            temp = interestBeforeProfits[ry]/interestExpends[ry]
        }
        payInterestRate[1].push(temp)
    }
}

//建设初期借款余额
function onCalculateBorrowMoneyBalanceBefore_1(){
    borrowMoneyBalanceBefore_1[0] = new Array()
    borrowMoneyBalanceLast_1[0] = new Array()
    for(var by=0;by<BUILD_YEAR;by++){
        var tempbmbb = 0
        var tempbmbl = 0
        if(by != 0){

        }
        tempbmbl = tempbmbb - 0 + 
        borrowMoneyBalanceLast_1[0].push()
        borrowMoneyBalanceBefore_1[0].push(temp)
    }
}