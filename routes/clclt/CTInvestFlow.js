/**
 * Created by Fizzo on 16/9/8.
 * 中交资本金流量
 */
var npt = require('./inputTable.js')
var YData = require("./YData.js")
var tool = require("./../../utils/tool.js")
// var pfit = require('./profit.js')
// var rcwi = require('./repayCapitalWithInterest.js')
// var cst = require('./cost.js')
// var income = require('./incomeTable.js')
var inf = require("./investFlow.js")
var cashFlow = require('./cashFlow.js')
var ctif = {
    stockOwnershipRate:null,    //中交股权比例
    cashIn:[], //现金流入 = 运营期分配 + 回收固定资产余值 + 其他收入
    runningValue:[], //运营期分配 = 资本金流量表-净现金流量 * 中交股权比例
    rcyclFixdAsstsBlncs:[],//回收固定资产余额
    otherIncome:[],//其他收入
    picDifInvst:[], //投资价差

    cashOut:[], // 现金流出
    CT_zbj:[],  //中交资本金
    cashFlow:[],//净现金流量
    cashFlowSum:[],//净现金累计
    cashFlow2:[],//净现金流量(不含价差)
    cashFlowSum2:[],//净现金累计(不含价差)

    irr25:null,
    irr30:null,

    init:function(){
        this.cashIn = new YData();
        this.runningValue = new YData();
        this.rcyclFixdAsstsBlncs = new YData();
        this.otherIncome = new YData();
        this.picDifInvst = new YData();
        this.cashOut = new YData();
        this.CT_zbj = new YData();
        this.cashFlow = new YData();
        this.cashFlowSum = new YData();
        this.cashFlow2 = new YData();
        this.cashFlowSum2 = new YData();
        this.onCalculate();
    },

    onCalculate:function(){
        this.stockOwnershipRate = npt.CT_RUN_DIS_PT;
        this.runningValue.ignoreBuild();
        this.rcyclFixdAsstsBlncs = cashFlow.hszcyz;
        for (var i = 0; i < npt.BUILD_YEAR + npt.OLC_YEAR; ++i) {
            if (i < npt.BUILD_YEAR) {
                //投资价差
                this.picDifInvst.push(npt.picDifIncm[i])
                //中交资本金
                this.CT_zbj.push(npt.zbj_CT * npt.JSTZ[i])
            } else {
                //运营期分配
                this.runningValue.push(inf.cashFlow[i] * this.stockOwnershipRate)
            }
        }
        //其他收入
        this.otherIncome = this.picDifInvst;
        //现金流入
        this.cashIn = tool.mergeData(this.runningValue,this.rcyclFixdAsstsBlncs,this.otherIncome);
        //现金流出
        this.cashOut = this.CT_zbj;

        //计算净现金
        for (i = 0; i < npt.BUILD_YEAR + npt.OLC_YEAR; ++i) {
            //净现金流量
            this.cashFlow.push(this.cashIn.get(i) - this.cashOut.get(i));
            //净现金流量(不含差价)
            this.cashFlow2.push(this.cashFlow.get(i) - this.picDifInvst.get(i));

            //净现金流累计
            this.cashFlowSum.push(this.cashFlowSum.get(i -1) + this.cashFlow.get(i));
            this.cashFlowSum2.push(this.cashFlowSum2.get(i -1) + this.cashFlow2.get(i));
        }
        this.irr25 = this.getIRR(25,0.01);
        this.irr30 = this.getIRR(npt.OLC_YEAR,0.01);

        this.saveData();
    },

    getIRR:function(num,estimate) {
        num += npt.BUILD_YEAR;   //加上建设期
        var count = 0;  //取num年的数据
        var arr = [];
        for (var i = 0; i < this.cashFlow.length; i++) {
            count++;
            if (count > num) {
                break;
            }
            arr.push(this.cashFlow.get(i))
        }
        return tool.IRR(arr,estimate);
    },

    saveData:function(){
        var resArr = [];
        resArr.push(tool.getFormData(this.cashIn,{name:"现金流入",rid:1,num:1}));
        resArr.push(tool.getFormData(this.runningValue,{name:"运营期分配",rid:2,num:1.1}));
        resArr.push(tool.getFormData(this.rcyclFixdAsstsBlncs,{name:"回收固定资产余值",rid:3,num:1.2}));
        resArr.push(tool.getFormData(this.otherIncome,{name:"其他收入",rid:4,num:1.3}));
        resArr.push(tool.getFormData(this.picDifInvst,{name:"投资价差",rid:5,num:"1.3.1"}));
        resArr.push(tool.getFormData(this.cashOut,{name:"现金流出",rid:6,num:2}));
        resArr.push(tool.getFormData(this.CT_zbj,{name:"中交资本金",rid:7,num:2.1}));
        resArr.push(tool.getFormData(this.cashFlow,{name:"净现金流量(2-1)",rid:8,num:3}));
        resArr.push(tool.getFormData(this.cashFlowSum,{name:"净现金流累计",rid:9,num:4}));
        resArr.push(tool.getFormData(this.cashFlow2,{name:"净现金流量(不含价差)",rid:10,num:5}));
        resArr.push(tool.getFormData(this.cashFlowSum2,{name:"净现金累计(不含价差)",rid:11,num:6}));
        var dbHelper = require("../../utils/dbHelper");
        dbHelper.update("zjzbj",resArr);

    }
}

module.exports = ctif;

