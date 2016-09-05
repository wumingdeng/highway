/**
 * Created by chenzhaowen on 16-9-1.
 */
// require("extjs");

// console.log(Ext.getVersion().version);

var income = {}

var beginYear = 2020;
var years = 25;
var interval = 5;   //间隔
var zssResultTab = {};
var jdsResultTab = {};
var sfsrResultTab = {}; //收费收入

income.carType = {
    passengerCar:"小客", //小客车
    passengerBus:"大客", //大客车
    littleTruck:"小货",  //小货车
    bigTruck:"大货",     //大货车
    largeTruck:"特大货",   //特大货车
    tuoGua:"拖挂",       //拖挂
    JZX:"集装箱"           //集装箱
};

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

var xs1 = 0.98

function getCarZSSCountEveryYear() {

    function calcIntervalYear(i){
        if (!zssResultTab[i]) {
            var all = jtl[i];
            var k1,k2,h1,h2,h3,h4,t1;
            zssResultTab[i] = [];
            jdsResultTab[i] = [];
            sfsrResultTab[i] = [];
            k1 = all * ycbl[i][0] * 0.01;
            zssResultTab[i].push(k1);
            var kk1 = k1 / zsxs[0];
            jdsResultTab[i].push(kk1);
            var sr1 = kk1 * sfbz[0] * mileage * xs1 * 345 / 10000
            sfsrResultTab[i].push(sr1);


            k2 = all * ycbl[i][1] * 0.01;
            zssResultTab[i].push(k2);
            var kk2 = k2 / zsxs[1];
            jdsResultTab[i].push(kk2);
            var sr2 = kk2 * sfbz[1] * mileage * xs1 * 365 / 10000
            sfsrResultTab[i].push(sr2);

            h1 = all * ycbl[i][2] * 0.01;
            zssResultTab[i].push(h1);
            var hh1 = h1 / zsxs[2];
            jdsResultTab[i].push(hh1);
            var sr3 = hh1 * sfbz[2] * mileage * xs1 * 365 / 10000
            sfsrResultTab[i].push(sr3);

            h2 = all * ycbl[i][3] * 0.01;
            zssResultTab[i].push(h2);
            var hh2 = h2 / zsxs[3];
            jdsResultTab[i].push(hh2);
            var sr4 = hh2 * sfbz[3] * mileage * xs1 * 365 / 10000
            sfsrResultTab[i].push(sr4);

            h3 = all * ycbl[i][4] * 0.01;
            zssResultTab[i].push(h3);
            var hh3 = h3 / zsxs[4];
            jdsResultTab[i].push(hh3);
            var sr5 = hh3 * sfbz[4] * mileage * xs1 * 365 / 10000
            sfsrResultTab[i].push(sr5);

            h4 = all * ycbl[i][5] * 0.01;
            zssResultTab[i].push(h4);
            var hh4 = h4 / zsxs[5];
            jdsResultTab[i].push(hh4);
            var sr6 = hh4 * sfbz[5] * mileage * xs1 * 365 / 10000
            sfsrResultTab[i].push(sr6);

            t1 = all * ycbl[i][6] * 0.01;
            zssResultTab[i].push(t1);
            var tt1 = t1 / zsxs[6];
            jdsResultTab[i].push(tt1);
            var sr7 = tt1 * sfbz[6] * mileage * xs1 * 365 / 10000
            sfsrResultTab[i].push(sr7);

        }
    }

    for(var i = beginYear;i <= beginYear + years; ++i){
        if (jtl[i]) {
            calcIntervalYear(i);
        } else {
            var yu = i % interval;
            var last = i - yu;
            //calcIntervalYear(last);
            var lastR = zssResultTab[last];
            var next = i + interval - yu;
            calcIntervalYear(next);
            var nextR = zssResultTab[next];
            var k1,k2,h1,h2,h3,h4,t1;
            zssResultTab[i] = [];
            jdsResultTab[i] = [];
            sfsrResultTab[i] = [];
            k1 = Math.pow(nextR[0] / lastR[0] ,0.2) * zssResultTab[i-1][0];
            zssResultTab[i].push(k1);
            var kk1 = k1 / zsxs[0]
            jdsResultTab[i].push(kk1);
            var sr1 = kk1 * sfbz[0] * mileage * xs1 * 345 / 10000
            sfsrResultTab[i].push(sr1);

            k2 = Math.pow(nextR[1] / lastR[1] ,0.2) * zssResultTab[i-1][1];
            zssResultTab[i].push(k2);
            var kk2 = k2 / zsxs[1];
            jdsResultTab[i].push(kk2);
            var sr2 = kk2 * sfbz[1] * mileage * xs1 * 365 / 10000
            sfsrResultTab[i].push(sr2);

            h1 = Math.pow(nextR[2] / lastR[2] ,0.2) * zssResultTab[i-1][2];
            zssResultTab[i].push(h1);
            var hh1 = h1 / zsxs[2];
            jdsResultTab[i].push(hh1);
            var sr3 = hh1 * sfbz[2] * mileage * xs1 * 365 / 10000
            sfsrResultTab[i].push(sr3);

            h2 = Math.pow(nextR[3] / lastR[3] ,0.2) * zssResultTab[i-1][3];
            zssResultTab[i].push(h2);
            var hh2 = h2 / zsxs[3];
            jdsResultTab[i].push(hh2);
            var sr4 = hh2 * sfbz[3] * mileage * xs1 * 365 / 10000
            sfsrResultTab[i].push(sr4);

            h3 = Math.pow(nextR[4] / lastR[4] ,0.2) * zssResultTab[i-1][4];
            zssResultTab[i].push(h3);
            var hh3 = h3 / zsxs[4];
            jdsResultTab[i].push(hh3);
            var sr5 = hh3 * sfbz[4] * mileage * xs1 * 365 / 10000
            sfsrResultTab[i].push(sr5);

            h4 = Math.pow(nextR[5] / lastR[5] ,0.2) * zssResultTab[i-1][5];
            zssResultTab[i].push(h4);
            var hh4 = h4 / zsxs[5];
            jdsResultTab[i].push(hh4);
            var sr6 = hh4 * sfbz[5] * mileage * xs1 * 365 / 10000
            sfsrResultTab[i].push(sr6);

            t1 = Math.pow(nextR[6] / lastR[6] ,0.2) * zssResultTab[i-1][6];
            zssResultTab[i].push(t1);
            var tt1 = t1 / zsxs[6];
            jdsResultTab[i].push(tt1);
            var sr7 = tt1 * sfbz[6] * mileage * xs1 * 365 / 10000
            sfsrResultTab[i].push(sr7);
        }
        zssResultTab[i].push(eval(zssResultTab[i].join('+')));  //求和
        jdsResultTab[i].push(eval(jdsResultTab[i].join('+')));  //求和
        sfsrResultTab[i].push(eval(sfsrResultTab[i].join('+')));  //求和
    }
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
getCarZSSCountEveryYear();
showCarzss();
showCarjds();
showCarsfsr();
console.log("call income")