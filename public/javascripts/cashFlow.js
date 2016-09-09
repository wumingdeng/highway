/**
 * Created by chenzhaowen on 16-9-6.
 */

var cashFlow = {};


cashFlow.hszcyz = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];      //回收资产余值
cashFlow.ldzj = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];     //流动资金
cashFlow.sljj = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];     //水利基金

cashFlow.xjlr = {};     //现金流入 = 收费收入表-收入 + 回收资产余值 + 其他收入

cashFlow.qtsr = {};            //其他收入 = 投资价差 + 补贴收入
cashFlow.tzjc = {};            //投资价差 = 输入表-价差收入  / (1 - 输入表-价差税率)
cashFlow.btsr = {};            //补贴收入 = 输入表-补贴总额 * 输入表-投资占比

cashFlow.xjlc = {};     //现金流出 = 建设投资 + 流动资金 + 经验成本 + 增值税 + 水利基金
cashFlow.jstz = {};     //建设投资 = 输入表-静态投资 * 输入表-投资占比
cashFlow.jycb = {};     //经营成本 = 成本表
cashFlow.zzs = {};      //增值税 = 利润表
cashFlow.jxjll = {};    //净现金流量 = 现金流入 - 现金流出
cashFlow.ljjxjll = {};  //累计净现金流量 = 去年累计净现金流量 + 今年净现金流量
cashFlow.sds = {};      //所得税 = 投资价差*输入表-价差税率 + (利润表-息税前利润扣除递延影响 + 利润表-递延收益) * 利润表-所得税税率
cashFlow.sdshjxjll = {};//所得税后净现金流量 = 净现金流量 - 所得税
cashFlow.ljsdshjxjll = {};  //累计所得税后净现金流量 = 去年累计所得税后净现金流量 + 今年所得税后净现金流量

cashFlow.jzzxl;         //每年的折现率 = 前一年折现率 / (1 + 输入表-基准折现率)
cashFlow.sdshllzx;      //所得税后流量折现 = 所得税后净现金流量 * 每年折现率
cashFlow.sdshzxlj;      //所得税后折现累计 = 去年累计 + 今年所得税后折现

cashFlow.tzhsq = null   //投资回收期

cashFlow.IRR = {};  //内部收益率(所得税前)
//var tempArr = [0,-162637,-216849,-162637,13950,18050,23158,29518,37430,47270,49264,51344,29114,55773,58133,60593,63159,65836,68628,70663,72761,43091,77156,79455,81648,83904,86225,88612,91067,93594,54658,98867,101620,104450];

cashFlow.jzzxl = 0.07;  //基准折现率 = 输入表-基准折现率

cashFlow.irr25 = 0;  //25年期内部收益
cashFlow.irr30 = 0; //30年期内部收益

cashFlow.npv25 = 0; //25年净现值
cashFlow.npv30 = 0; //30年净现值


cashFlow.init = function() {
    cashFlow.tzjc = new YData();
    cashFlow.btsr = new YData();
    cashFlow.qtsr = new YData();
    cashFlow.xjlr = new YData();
    cashFlow.jstz = new YData();
    cashFlow.jxjll = new YData();
    cashFlow.ljjxjll = new YData();
    cashFlow.sds = new YData();
    cashFlow.jzzxl = new YData([1]);
    cashFlow.sdshllzx = new YData();
    cashFlow.sdshzxlj = new YData();
    cashFlow.tzhsq = null;
    for (var i = 0;i < npt.BUILD_YEAR; i++) {
        //算投资价差
        var jc = npt.picDifIncm[i] / (1 - npt.PRICE_DIF_TAX_RT);
        cashFlow.tzjc.push(jc);
        //补贴收入
        var bt = npt.localSubSum * npt.JSTZ[i];
        cashFlow.btsr.push(bt);
        //其他收入
        cashFlow.qtsr.push(jc + bt);
        //建设投资
        var jstz = npt.jttz * npt.JSTZ[i]
        cashFlow.jstz.push(jstz);
        //现金流出

    }
    //求现金流入
    cashFlow.xjlr = tool.mergeData(cashFlow.hszcyz,cashFlow.qtsr,income.incomeTable);

    //经营成本
    cashFlow.jycb = new YData();
    cashFlow.jycb.ignoreBuild();
    cashFlow.jycb.concat(cst.sumCosts);

    //增值税
    cashFlow.zzs = new YData();
    cashFlow.zzs.ignoreBuild();
    cashFlow.zzs.concat(pfit.vats)

    //现金流出 = 建设投资 + 流动资金 + 经验成本 + 增值税 + 水利基金
    cashFlow.xjlc = tool.mergeData(cashFlow.jstz,cashFlow.ldzj,cashFlow.jycb,cashFlow.zzs,cashFlow.sljj);

    //计算净现金流
    for(i = 0; i <= npt.BUILD_YEAR + npt.OLC_YEAR; ++i) {
        //净现金流量 = 现金流入 - 现金流出
        var jxjll = cashFlow.xjlr.get(i) - cashFlow.xjlc.get(i);
        cashFlow.jxjll.push(jxjll);
        //累计净现金流量 = 去年累计净现金流量 + 今年净现金流量
        var ljjxjll = tool.sum(jxjll, cashFlow.ljjxjll.get(i - 1));
        cashFlow.ljjxjll.push(ljjxjll);

        //所得税 = 投资价差*输入表-价差税率 + (利润表-息税前利润扣除递延影响 + 利润表-递延收益) * 利润表-所得税税率
        var sds = (cashFlow.tzjc.get(i) || 0) * npt.PRICE_DIF_TAX_RT + (pfit.intstBfPrfits[i] + pfit.diyanIncomes[i]) * npt.INCONE_TAX
        cashFlow.sds.push(sds);
        //所得税后净现金流量 = 净现金流量 - 所得税
        var sdshjxjll = jxjll - sds;
        cashFlow.sdshjxjll.push(sdshjxjll);
        //累计所得税后净现金流量 = 去年累计所得税后净现金流量 + 今年所得税后净现金流量
        var ljsdshjxjll = tool.sum(sdshjxjll, cashFlow.ljsdshjxjll.get(i - 1));
        cashFlow.ljsdshjxjll.push(ljsdshjxjll);

        //每年的折现率 = 前一年折现率 / (1 + 输入表-基准折现率)
        if (i > 0) {
            var jzzxl = cashFlow.jzzxl.get(i - 1) / (1 + npt.BASE_DISCOUNT_RT );
            cashFlow.jzzxl.push(jzzxl);
        } else {
            jzzxl = 1;
        }
        //所得税后流量折现 = 所得税后净现金流量 * 每年折现率
        var sdshllzx = sdshjxjll * jzzxl;
        cashFlow.sdshllzx.push(sdshllzx);

        //所得税后折现累计 = 去年累计 + 今年所得税后折现
        var sdshzxlj = tool.sum(cashFlow.sdshzxlj.get(i - 1),sdshllzx);
        cashFlow.sdshzxlj.push(sdshzxlj);

        //计算投资回收期
        if (!cashFlow.tzhsq && sdshzxlj > 0) {
            cashFlow.tzhsq = i - sdshzxlj / (sdshzxlj - cashFlow.sdshzxlj.get(i - 1))
        }
    }
    cashFlow.irr25 = cashFlow.getIRR(25,0.01);
    cashFlow.irr30 = cashFlow.getIRR(30,0.01);
    cashFlow.npv25 = cashFlow.getNPV(25);
    cashFlow.npv30 = cashFlow.getNPV(30);


};
//取内部收益率
cashFlow.getIRR = function(num,estimate) {
    num += npt.BUILD_YEAR;   //加上建设期
    var count = 0;  //取num年的数据
    var arr = [];
    for (var i = 0; i < cashFlow.jxjll.length; i++) {
        count++;
        if (count > num) {
            break;
        }
        arr.push(cashFlow.jxjll[i])
    }
    return tool.IRR(arr,estimate);
};
cashFlow.getNPV = function(num) {
    num += npt.BUILD_YEAR;   //加上建设期
    var count = 0;  //取num年的数据
    var arr = [];
    for (var i = 0; i < cashFlow.jxjll.length; i++) {
        count++;
        if (count > num) {
            break;
        }
        arr.push(cashFlow.jxjll[i])
    }
    return tool.NPV(cashFlow.jzzxl,arr);
};