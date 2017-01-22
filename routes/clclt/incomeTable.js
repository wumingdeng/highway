/**
 * Created by chenzhaowen on 16-9-1.
 */
var YData = require("./YData.js");
var gvr = require("../../utils/globalVar.js")
var npt = require("./inputTable")
var income = {}

// income.incomeTable = []
// income.incomeTemp = null;  //每年收费收入总额
var allIncome

income.beginYear = 2020;
income.endYear= 2050
var years = 25;
var interval = 5;   //间隔
var zssResultTab = {};  //车型折算数
var jdsResultTab = {};  //车型绝对数 = 车型折算数 / 折算系数
var sfsrResultTab = {}; //收费收入

income.carType = ["客一类","客二类","客三类","客四类","货一类","货二类","货三类","货四类","货五类"];


//预测比例
var ycbl = {
    "2020":[18.3,6.5,3.5,12.5,9.7,4.4,45.1],
    // "2025":[18.7,6.3,3.3,12.3,9.6,4.5,48],
    // "2030":[19.1,6.1,3.1,12.1,9.5,4.6,51],
    // "2035":[19.5,5.9,2.9,11.9,9.4,4.7,54.1],
    // "2040":[19.9,5.7,2.7,11.7,9.3,4.8,57.3],
    "2045":[20.3,5.5,2.5,11.5,9.2,4.9,60.6]
};

//预测交通量
var jtl = {
    2020:19754,
    // 2025:28359.4217091992,
    // 2030:38854.8654659534,
    // 2035:46147.3916216645,
    // 2040:53497.4747035647,
    2045:56226.383568417
};

//收费里程
var mileage = 54.130

//折算系数
var zsxs = [1,1.5,1,1.5,2,3,3]

//收费标准
var sfbz = [0.6,1.2,0.9,1.2,1.8,2.1,2.1]

var ycts = [345,365,365,365,365,365,365,365,365];

var xls =[0.98];  //里程折算系数

function getCarZSSCountEveryYear() {
    var tempSfbzArr = []
    income.incomeTemp = new YData();
    income.incomeTemp.ignoreBuild();
    function calcIntervalYear(i){
        if (!zssResultTab[i]) {
            var all = jtl[i];
            zssResultTab[i] = [];
            jdsResultTab[i] = [];
            sfsrResultTab[i] = [];
            for (var j = 0; j < income.carType.length; ++j) {
                var k1 = all * ycbl[i][j] * 0.01;
                zssResultTab[i].push(k1);
                var kk1 = 0
                if(zsxs[j] != 0){
                    kk1 = k1 / zsxs[j];
                }
                jdsResultTab[i].push(kk1);
                var sr1 = npt.SR*kk1 * tempSfbzArr[j] * mileage * npt.XSL[j] * ycts[j] / 10000;
                // var sr1 = kk1 * sfbz[j] * mileage * npt.XSL[j] * ycts[j] / 10000;
                sfsrResultTab[i].push(sr1);
            }

        }
    }
    function getNextAndLastIndex(index) {
        var last = 0
        for (var year in jtl) {
            year= Number(year)
            if (year > index) {
                return {last:last,next:year};   //返回上一个 和下一个有数据的年份
            }
            last = year;
        }
    }

    function getSfbzArr(index) {
        var arr = []
        var lastYear = ""
        var idx = 0
        for (var year in sfbz) {
            if(idx==0){
                arr = sfbz[year]
            }else{
                if (Number(year) >= Number(index)) {
                    arr = sfbz[lastYear]
                    break
                }
            }
            lastYear = year
            idx++
        }
        return arr
    }
    for(var i = income.beginYear;i <= income.endYear; ++i){
        tempSfbzArr = getSfbzArr(i)
        if (jtl[i]) {
            calcIntervalYear(i);
        } else {
            var year = getNextAndLastIndex(i);
            var last = year.last;
            //calcIntervalYear(last);
            var lastR = zssResultTab[last];
            var next = year.next;
            calcIntervalYear(next);
            var nextR = zssResultTab[next];
            var k1
            zssResultTab[i] = [];
            jdsResultTab[i] = [];
            sfsrResultTab[i] = [];
            for (var j = 0; j < income.carType.length; ++j) {
                if(lastR[j] == 0 || nextR[j] == 0){
                    k1 = 0
                }else{
                    k1 = Math.pow(nextR[j] / lastR[j] ,0.2) * zssResultTab[i-1][j];
                }
                zssResultTab[i].push(k1);
                // var kk1 = k1 / zsxs[j]
                var kk1 = 0
                if(zsxs[j] != 0){
                    kk1 = k1 / zsxs[j];
                }
                jdsResultTab[i].push(kk1);
                var sr1 = npt.SR*kk1 * tempSfbzArr[j] * mileage * npt.XSL[j] * ycts[j] / 10000;
                // var sr1 = kk1 * sfbz[j] * mileage * npt.XSL[j] * ycts[j] / 10000;

                sfsrResultTab[i].push(sr1);
            }
        }
        zssResultTab[i].push(eval(zssResultTab[i].join('+')));  //求和
        jdsResultTab[i].push(eval(jdsResultTab[i].join('+')));  //求和

        var all = eval(sfsrResultTab[i].join('+'));
        sfsrResultTab[i].push(all);  //求和
        income.incomeTemp.push(all);
    }
}
function showCarzss(num) {
    console.log("车型折算数")
    num = num || 0;
    var resTab = []
    for(var i = income.beginYear;i <= income.beginYear + years; ++i){
        resTab[i] = []
        for (var j = 0; j < zssResultTab[i].length; j++) {
            resTab[i].push(zssResultTab[i][j].toFixed(num));
        }
        console.log(resTab[i].join("  "));
    }

}
function showCarjds(num) {
    console.log("车型绝对数")
    num = num || 0;
    var resTab = []
    for(var i = income.beginYear;i <= income.beginYear + years; ++i){
        resTab[i] = []
        for (var j = 0; j < jdsResultTab[i].length; j++) {
            resTab[i].push(jdsResultTab[i][j].toFixed(num));
        }
        console.log(resTab[i].join("  "));
    }
}
function showCarsfsr(num) {
    console.log("收费收入")
    num = num || 0;
    var resTab = []
    for(var i = income.beginYear;i <= income.beginYear + years; ++i){
        resTab[i] = []
        for (var j = 0; j < sfsrResultTab[i].length; j++) {
            resTab[i].push(sfsrResultTab[i][j].toFixed(num));
        }
        console.log(resTab[i].join("  "));
    }
}


function saveZSSData() {
    var zssArr = [];
    for (var year in zssResultTab) {
        var data = {}
        data.year = year;
        var arr = zssResultTab[year];
        for(var i = 0; i < arr.length - 1; ++i) {
            data["car" + String(i+1)] = arr[i];   //数据加上key
        }
        data.sum = arr[arr.length - 1]
        data.rid = year;
        zssArr.push(data);
    }
    //数据存入数据库
    var dbHelper = require("../../utils/dbHelper");
    dbHelper.update("car_zss",zssArr);

    return zssArr;
}



function saveData(list,dataArr) {
    var resArr = [];
    var num = 0
    for (var type in dataArr) {
        var data = {}
        data.car = type;
        var arr = dataArr[type];
        var yr = 1
        for(var year in arr) {
            data["year" +yr] = arr[year];   //数据加上key
            yr++
        }
        // data.sum = dataArr[dataArr.length-1]
        // delete data["year" +(yr-1)]
        data.rid = Number(type)
        data.pn = gvr.projectName
        resArr.push(data);
    }
    //数据存入数据库
    var dbHelper = require("../../utils/dbHelper");
    dbHelper.update(list,resArr);

    return resArr;
}

income.run = function(){
    income.incomeTable = [0,0,0,0]
    income.incomeTemp = []
    ycbl = npt.ycbl//预测比例
    jtl = npt.jtl//预测交通量
    sfbz = npt.sfbz//收费标准
    zsxs = npt.zsxs//折算系数
    zssResultTab = {};  //车型折算数
    jdsResultTab = {};  //车型绝对数 = 车型折算数 / 折算系数
    sfsrResultTab = {};
    mileage = npt.LENGTH
    getCarZSSCountEveryYear();  //计算得出数据
    // saveData("car_zss",zssResultTab);   //保存折算数
    // saveData("car_jds",jdsResultTab);   //保存绝对数
    var incomeArr =  []
    for(var year in sfsrResultTab){
        var tmpArray = sfsrResultTab[year]
        for(var idx in tmpArray){
            if(incomeArr[Number(idx)]) {
                var temp = incomeArr[Number(idx)]
            }else{
                var temp = {}
            }
            temp[year]=tmpArray[idx]
            incomeArr[Number(idx)] = temp
        }
    }
    var srsfArr = incomeArr[(incomeArr.length-1)]
    for(var i in srsfArr){
        income.incomeTable.push(srsfArr[i])
    }
    saveData("car_sfsr",incomeArr);   //保存收费收入
    // saveData("car_sfsr",sfsrResultTab);   //保存收费收入
};

module.exports = income