/**
 * Created by chenzhaowen on 16-9-6.
 */

var npt = require("./../routes/clclt/inputTable.js");
var YData = require("./../routes/clclt/YData.js");
tool = {}

//内部收益率
tool.IRR = function(cashFlows, estimatedResult) {
    var result = "isNAN";
    if (cashFlows != null && cashFlows.length > 0) {
        // check if business startup costs is not zero:
        //if (cashFlows[0] != 0) {
        if (true) {
            var noOfCashFlows = cashFlows.length;
            var sumCashFlows = 0;
            // check if at least 1 positive and 1 negative cash flow exists:
            var noOfNegativeCashFlows = 0;
            var noOfPositiveCashFlows = 0;
            for (var i = 0; i < noOfCashFlows; i++) {
                sumCashFlows += cashFlows[i];
                if (cashFlows[i] > 0) {
                    noOfPositiveCashFlows++;
                } else {
                    if (cashFlows[i] < 0) {
                        noOfNegativeCashFlows++;
                    }
                }
            }

            // at least 1 negative and 1 positive cash flow available?
            if (noOfNegativeCashFlows > 0 && noOfPositiveCashFlows > 0) {
                // set estimated result:
                var irrGuess = 0.1; // default: 10%
                if (!isNaN(estimatedResult)) {
                    irrGuess = estimatedResult;
                    if (irrGuess <= 0) {
                        irrGuess = 0.5;
                    }
                }

                // initialize first IRR with estimated result:
                var irr = 0;
                if (sumCashFlows < 0) { // sum of cash flows negative?
                    irr = -irrGuess;
                } else { // sum of cash flows not negative
                    irr = irrGuess;
                }

                // iteration:
                // the smaller the distance, the smaller the interpolation
                // error
                var minDistance = 1e-15;

                // business startup costs
                var cashFlowStart = cashFlows[0];
                var maxIteration = 100;
                var wasHi = false;
                var cashValue = 0;
                for (var i = 0; i <= maxIteration; i++) {
                    // calculate cash value with current irr:
                    cashValue = cashFlowStart; // init with startup costs

                    // for each cash flow
                    for (var j = 1; j < noOfCashFlows; j++) {
                        cashValue += cashFlows[j] / Math.pow(1 + irr, j);
                    }

                    // cash value is nearly zero
                    if (Math.abs(cashValue) < 0.01) {
                        result = irr;
                        break;
                    }

                    // adjust irr for next iteration:
                    // cash value > 0 => next irr > current irr
                    if (cashValue > 0) {
                        if (wasHi) {
                            irrGuess /= 2;
                        }
                        irr += irrGuess;
                        if (wasHi) {
                            irrGuess -= minDistance;
                            wasHi = false;
                        }
                    } else {// cash value < 0 => next irr < current irr
                        irrGuess /= 2;
                        irr -= irrGuess;
                        wasHi = true;
                    }

                    // estimated result too small to continue => end
                    // calculation
                    if (irrGuess <= minDistance) {
                        result = irr;
                        break;
                    }
                }
            }
        }
    }
    return result;
};

//计算净现值
tool.NPV = function(rate,valueArr) {
    var result = 0;
    if (valueArr != null && valueArr.length > 0) {
        var num = valueArr.length;
        for (var i = 0; i < num; ++i) {
            var nowValue = valueArr[i] / Math.pow((1 + rate), i + 1);
            result += nowValue;
        }
    }
    return result;
};

//加法
tool.sum = function(a,b) {
    a = a || 0;
    b = b || 0;
    return a + b;
};

//数组相加
tool.mergeData = function () {
    var num = arguments.length;
    if (num < 2) {
        return "wrong argument num"
    }
    var max = 0;
    for (var i = 0; i < num; ++i) {
        arguments[i] = arguments[i].arr || arguments[i]
        if (max < arguments[i].length){
            max = arguments[i].length;
        }
    }
    var resArr = arguments[0];
    for (var i = 1; i < num; ++i) {
        for (var t = 0; t < max; ++t) {
            resArr[t] = (resArr[t] || 0) + (arguments[i][t] || 0);
        }
    }
    return new YData(resArr);
};

//获得表格显示的数据
tool.getFormData = function(arr,obj) {
    obj = obj || {}
    var count = 0;
    for (var i = 1;i <= npt.BUILD_YEAR; ++i) {
        obj["b" + i] = arr[count++];
    }
    for (i = 1;i <= npt.OLC_YEAR; ++i) {
        obj["m" + i] = arr[count++];
    }
    if (arr.sum) {
        obj.total = arr.sum;
    }
    return obj;
};
module.exports = tool