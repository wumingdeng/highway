/**
 * Created by chenzhaowen on 16-9-1.
 */
var YData = require("./YData.js");
var gvr = require("../../utils/globalVar.js")
var income = {}

income.incomeTable = [0,0,0,0,18479, 22909, 28403, 35218, 43671, 54157, 56388, 58713, 61135, 63660, 66292, 69035, 71894, 74874, 77980, 80294, 82680, 85140, 87677, 90291, 92799, 95379, 98034, 100765, 103574, 106465, 109440, 112500, 115650, 118890 ]
// income.incomeTemp = null;  //每年收费收入总额
var allIncome

var beginYear = 2020;
var years = 25;
var interval = 5;   //间隔
var zssResultTab = {};  //车型折算数
var jdsResultTab = {};  //车型绝对数 = 车型折算数 / 折算系数
var sfsrResultTab = {}; //收费收入

income.carType = ["小客","大客","小货","中货","大货","特大货","拖挂"];

console.log(income.carType.length);
//预测比例
var ycbl = {
    "2020":[18.3,6.5,3.5,12.5,9.7,4.4,45.1],
    "2025":[18.7,6.3,3.3,12.3,9.6,4.5,48],
    "2030":[19.1,6.1,3.1,12.1,9.5,4.6,51],
    "2035":[19.5,5.9,2.9,11.9,9.4,4.7,54.1],
    "2040":[19.9,5.7,2.7,11.7,9.3,4.8,57.3],
    "2045":[20.3,5.5,2.5,11.5,9.2,4.9,60.6]
};

//预测交通量
var jtl = {
    2020:19754,
    2025:28359.4217091992,
    2030:38854.8654659534,
    2035:46147.3916216645,
    2040:53497.4747035647,
    2045:56226.383568417
};

//收费里程
var mileage = 54.130

//折算系数
var zsxs = [1,1.5,1,1.5,2,3,3]

//收费标准
var sfbz = [0.6,1.2,0.9,1.2,1.8,2.1,2.1]

var ycts = [345,365,365,365,365,365,365];

var xs1 = 0.98;  //里程折算系数

function getCarZSSCountEveryYear() {
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
                var kk1 = k1 / zsxs[j];
                jdsResultTab[i].push(kk1);
                var sr1 = kk1 * sfbz[j] * mileage * xs1 * ycts[j] / 10000;
                sfsrResultTab[i].push(sr1);
            }

        }
    }
    function getNextAndLastIndex(index) {
        var last = 0
        for (var year in jtl) {
            if (year > index) {
                return {last:last,next:year};   //返回上一个 和下一个有数据的年份
            }
            last = year;
        }
    }
    for(var i = beginYear;i <= beginYear + years; ++i){
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
            var k1,k2,h1,h2,h3,h4,t1;
            zssResultTab[i] = [];
            jdsResultTab[i] = [];
            sfsrResultTab[i] = [];
            for (var j = 0; j < income.carType.length; ++j) {
                k1 = Math.pow(nextR[j] / lastR[j] ,0.2) * zssResultTab[i-1][j];
                zssResultTab[i].push(k1);
                var kk1 = k1 / zsxs[j]
                jdsResultTab[i].push(kk1);
                var sr1 = kk1 * sfbz[j] * mileage * xs1 * ycts[j] / 10000;
                sfsrResultTab[i].push(sr1);
            }
        }
        zssResultTab[i].push(eval(zssResultTab[i].join('+')));  //求和
        jdsResultTab[i].push(eval(jdsResultTab[i].join('+')));  //求和

        var all = eval(sfsrResultTab[i].join('+'));
        sfsrResultTab[i].push(all);  //求和
        income.incomeTemp.push(all);
    }

    //allIncome = eval(income.incomeTemp.join('+')); //总收入
}
function showCarzss(num) {
    console.log("车型折算数")
    num = num || 0;
    var resTab = []
    for(var i = beginYear;i <= beginYear + years; ++i){
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
    for(var i = beginYear;i <= beginYear + years; ++i){
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
    for(var i = beginYear;i <= beginYear + years; ++i){
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
    for (var year in dataArr) {
        var data = {}
        data.year = year;
        var arr = dataArr[year];
        for(var i = 0; i < arr.length - 1; ++i) {
            data["car" + String(i + 1)] = arr[i];   //数据加上key
        }
        data.sum = arr[arr.length - 1]
        data.rid = year;
        data.pn = gvr.projectName
        resArr.push(data);
    }
    //数据存入数据库
    var dbHelper = require("../../utils/dbHelper");
    dbHelper.update(list,resArr);

    return resArr;
}

income.run = function(){
    getCarZSSCountEveryYear();  //计算得出数据
    saveData("car_zss",zssResultTab);   //保存折算数
    saveData("car_jds",jdsResultTab);   //保存绝对数
    saveData("car_sfsr",sfsrResultTab);   //保存收费收入

};

module.exports = income