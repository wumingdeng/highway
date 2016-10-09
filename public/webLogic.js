/**
 * Created by Fizzo on 16/10/8.
 */
var projectName = ""
var bYear = 4
var mYear = 30 //建设期和运营期从服务端取配置

function onRunManage() {
    var calNamesArr = ["序号", "项目", "基年"];
    var colModelArr = [
        {name: 'num', index: 'num', width: 60, align: 'center', sortable: false, frozen: true, editable: true},
        {name: 'name', index: 'name', width: 100, sortable: false, frozen: true},
        {name: 'r0', index: 'r0', width: 100, sortable: false, align: "right"},
    ];
//初始化表格
    for (var i = 1; i <= mYear; ++i) {
        calNamesArr.push(String(i));
        var model = {name: "r" + i, index: "r" + i, width: 75, sortable: false, align: "right", formatter: 'number'};
        colModelArr.push(model)
    }
    pageInit();
    function pageInit() {
        jQuery("#list2").jqGrid({
            url: '/runManage/yygl',
            datatype: "json",
            postData: {pn:projectName},
            colNames: calNamesArr,
            colModel: colModelArr,
            rowNum: 20,
            width: 1400,
            rowList: [8],
            pager: '#pager2',
            viewrecords: true,
            sortable: false,
            jsonReader: {
                repeatitems: false
            },
            shrinkToFit: false,
            caption: "运营管理费",
            height: 'auto',
            mtype: "POST"
        });
        jQuery("#list2").jqGrid('setFrozenColumns');
        jQuery("#list2").jqGrid('navGrid', '#pager2', {edit: true, add: false, del: false});
    }
}

function onCarCalc(){
    var calNamesArr = ["年份","小客","大客","小货","中货","大货","特大货","拖挂","合计"];
    var colModelArr = [
        {name: 'year', index: 'year', width: 70, align: 'center', sortable: false},
        {name: 'car1', index: 'car1', width: 70, formatter: 'number', sortable: false,align: 'right'},
        {name: 'car2', index: 'car2', width: 70, formatter: 'number', sortable: false,align: 'right'},
        {name: 'car3', index: 'car3', width: 70, formatter: 'number', sortable: false,align: 'right'},
        {name: 'car4', index: 'car4', width: 70, formatter: 'number', sortable: false,align: 'right'},
        {name: 'car5', index: 'car5', width: 70, formatter: 'number', sortable: false,align: 'right'},
        {name: 'car6', index: 'car6', width: 70, formatter: 'number', sortable: false,align: 'right'},
        {name: 'car7', index: 'car7', width: 70, formatter: 'number', sortable: false,align: 'right'},
        {name: 'sum', index: 'sum', width: 70, formatter: 'number', sortable: false,align: 'right'}
    ];
    pageInit();
    function pageInit() {
        jQuery("#list3").jqGrid({
            url: '/carCalc/car_zss',
            datatype: "json",
            postData: {pn:projectName},
            colNames: calNamesArr,
            colModel: colModelArr,
            rowNum: 10,
            width: "auto",
            rowList: [10, 20, 30],
            pager: '#pager3',
            viewrecords: true,
            sortable:false,
            jsonReader: {
                repeatitems: false
            },
            shrinkToFit: false,
            caption: "折算数车型",
            height: 'auto',
            mtype:"POST"
        });
        jQuery("#list3").jqGrid('navGrid', '#pager3', {edit: false, add: false, del: false});

        jQuery("#list4").jqGrid({
            url: '/carCalc/car_jds',
            datatype: "json",
            postData: {pn:projectName},
            colNames: calNamesArr,
            colModel: colModelArr,
            rowNum: 10,
            width: "auto",
            rowList: [10, 20, 30],
            pager: '#pager4',
            viewrecords: true,
            sortable: false,
            jsonReader: {
                repeatitems: false
            },
            shrinkToFit: false,
            caption: "绝对数车型",
            height: 'auto',
            mtype: "POST"
        });
        jQuery("#list4").jqGrid('navGrid', '#pager4', {edit: false, add: false, del: false});

        jQuery("#list5").jqGrid({
            url: '/carCalc/car_sfsr',
            datatype: "json",
            postData: {pn:projectName},
            colNames: calNamesArr,
            colModel: colModelArr,
            rowNum: 10,
            width: "auto",
            rowList: [10, 20, 30],
            pager: '#pager5',
            viewrecords: true,
            sortable: false,
            jsonReader: {
                repeatitems: false
            },
            shrinkToFit: false,
            caption: "收费收入",
            height: 'auto',
            mtype: "POST"
        });
        jQuery("#list5").jqGrid('navGrid', '#pager5', {edit: false, add: false, del: false});
    }
}

function onCashFlow(){
    var calNamesArr = ["序号","项目","合计"];
    var colModelArr = [
        {name: 'num', index: 'num', width: 60, align: 'center', sortable: false,  frozen: true,editable : true},
        {name: 'name', index: 'name', width: 100, sortable: false, frozen: true},
        {name: 'total', index: 'total', width: 75, formatter: 'number', sortable: false, frozen: true, align: 'right'}
    ];
    //初始化表格
    for (var i = 1; i <= bYear; ++i) {
        calNamesArr.push(String(i));
        var model = {name:"b"+i, index:"b" + i, width:75, sortable: false, align: "right", formatter: 'number'};
        colModelArr.push(model)
    }
    for (var i = 1; i <= mYear; ++i) {
        calNamesArr.push(String(i));
        var model = {name: "r" + i, index: "r" + i, width: 75, sortable: false, align: "right", formatter: 'number'};
        colModelArr.push(model)
    }
    pageInit();
    function pageInit() {
        jQuery("#list6").jqGrid({
            url: '/cashFlow/xjll',
            datatype: "json",
            postData: {pn:projectName},
            colNames: calNamesArr,
            colModel: colModelArr,
            rowNum: 20,
            width: 1400,
            rowList: [20],
            pager: '#pager6',
            viewrecords: true,
            sortable:false,
            jsonReader: {
                repeatitems: false
            },
            shrinkToFit: false,
            caption: "项目投资现金流量表",
            height: 'auto',
            mtype:"POST"
        });
        $("#list6").jqGrid('setGroupHeaders', {
            useColSpanStyle: true,
            groupHeaders: [
                {startColumnName: 'b1', numberOfColumns: bYear, titleText: '建设期'},
                {startColumnName: 'r1', numberOfColumns: mYear, titleText: '运营期'}
            ]
        })
        jQuery("#list6").jqGrid('setFrozenColumns');
        jQuery("#list6").jqGrid('navGrid', '#pager6', {edit: true, add: false, del: false});
    }
}

function onCost(){
    var calNamesArr = ["序号","项目"];
    var colModelArr = [
        {name: 'num', index: 'num', width: 60, align: 'center', sortable: false,  frozen: true,editable : true},
        {name: 'name', index: 'name', width: 130, sortable: false, frozen: true},
    ];
    //初始化表格
    for (var i = 1; i <= mYear; ++i) {
        calNamesArr.push(String(i));
        var model = {name: "r" + i, index: "r" + i, width: 75, sortable: false, align: "right", formatter: 'number'};
        colModelArr.push(model)
    }
    pageInit();
    function pageInit() {
        jQuery("#list7").jqGrid({
            url: '/cost/cbb',
            datatype: "json",
            postData: {pn:projectName},
            colNames: calNamesArr,
            colModel: colModelArr,
            rowNum: 20,
            width: 1400,
            rowList: [14],
            pager: '#pager7',
            viewrecords: true,
            sortable:false,
            jsonReader: {
                repeatitems: false
            },
            shrinkToFit: false,
            caption: "总成本费用估算表(生产要素法)",
            height: 'auto',
            mtype:"POST"
        });
        $("#list7").jqGrid('setGroupHeaders', {
            useColSpanStyle: true,
            groupHeaders: [
                {startColumnName: 'r1', numberOfColumns: mYear, titleText: '运营期'}
            ]
        });
        jQuery("#list7").jqGrid('setFrozenColumns');
        jQuery("#list7").jqGrid('navGrid', '#pager7', {edit: true, add: false, del: false});
    }
}

//应改成 财务计划流量
function onPlanCashFlow(){
    var calNamesArr = ["序号","项目","合计"];
    var colModelArr = [
        {name: 'num', index: 'num', width: 60, align: 'center', sortable: false,  frozen: true,editable : true},
        {name: 'name', index: 'name', width: 100, sortable: false, frozen: true},
        {name: 'total', index: 'total', width: 75, formatter: 'number', sortable: false, frozen: true, align: 'right'}
    ];
    //初始化表格
    for (var i = 1; i <= bYear; ++i) {
        calNamesArr.push(String(i));
        var model = {name:"b"+i, index:"b" + i, width:75, sortable: false, align: "right", formatter: 'number'};
        colModelArr.push(model)
    }
    for (var i = 1; i <= mYear; ++i) {
        calNamesArr.push(String(i));
        var model = {name: "r" + i, index: "r" + i, width: 75, sortable: false, align: "right", formatter: 'number'};
        colModelArr.push(model)
    }
    pageInit();
    function pageInit() {
        jQuery("#list8").jqGrid({
            url: '/planCashFlow/pcf',
            datatype: "json",
            postData: {pn:projectName},
            colNames: calNamesArr,
            colModel: colModelArr,
            rowNum: 40,
            width: 1400,
            rowList: [40],
            pager: '#pager8',
            viewrecords: true,
            sortable:false,
            jsonReader: {
                repeatitems: false
            },
            shrinkToFit: false,
            caption: "财务计划流量",
            height: 'auto',
            mtype:"POST"
        });
        $("#list8").jqGrid('setGroupHeaders', {
            useColSpanStyle: true,
            groupHeaders: [
                {startColumnName: 'b1', numberOfColumns: bYear, titleText: '建设期'},
                {startColumnName: 'r1', numberOfColumns: mYear, titleText: '运营期'}
            ]
        })
        jQuery("#list8").jqGrid('setFrozenColumns');
        jQuery("#list8").jqGrid('navGrid', '#pager8', {edit: true, add: false, del: false});
    }
}

function onFixedAssets(){
    var calNamesArr = ["序号","项目","总计"];
    var colModelArr = [
        {name: 'num', index: 'num', width: 60, align: 'center', sortable: false,  frozen: true,editable : true},
        {name: 'name', index: 'name', width: 100, sortable: false, frozen: true},
        {name: 'total', index: 'total', width: 75, formatter: 'number', sortable: false, frozen: true, align: 'right'}
    ];
    //初始化表格
    for (var i = 1; i <= mYear; ++i) {
        calNamesArr.push(String(i));
        var model = {name: "r" + i, index: "r" + i, width: 75, sortable: false, align: "right", formatter: 'number'};
        colModelArr.push(model)
    }
    pageInit();
    function pageInit() {
        jQuery("#list9").jqGrid({
            url: '/fixedAssets/gdzc',
            datatype: "json",
            postData: {pn:projectName},
            colNames: calNamesArr,
            colModel: colModelArr,
            rowNum: 20,
            width: 1400,
            rowList: [2],
            pager: '#pager9',
            viewrecords: true,
            sortable:false,
            jsonReader: {
                repeatitems: false
            },
            shrinkToFit: false,
            caption: "固定资产折旧费估算表",
            height: 'auto',
            mtype:"POST"
        });
        $("#list9").jqGrid('setGroupHeaders', {
            useColSpanStyle: true,
            groupHeaders: [
                {startColumnName: 'r1', numberOfColumns: mYear, titleText: '运营期'}
            ]
        });
        jQuery("#list9").jqGrid('setFrozenColumns');
        jQuery("#list9").jqGrid('navGrid', '#pager9', {edit: true, add: false, del: false});
    }
}

function onInvestFlow(){
    var calNamesArr = ["序号","项目","合计"];
    var colModelArr = [
        {name: 'num', index: 'num', width: 60, align: 'center', sortable: false,  frozen: true,editable : true},
        {name: 'name', index: 'name', width: 100, sortable: false, frozen: true},
        {name: 'total', index: 'total', width: 75, formatter: 'number', sortable: false, frozen: true, align: 'right'}
    ];
    //初始化表格
    for (var i = 1; i <= bYear; ++i) {
        calNamesArr.push(String(i));
        var model = {name:"b"+i, index:"b" + i, width:75, sortable: false, align: "right", formatter: 'number'};
        colModelArr.push(model)
    }
    for (var i = 1; i <= mYear; ++i) {
        calNamesArr.push(String(i));
        var model = {name: "r" + i, index: "r" + i, width: 75, sortable: false, align: "right", formatter: 'number'};
        colModelArr.push(model)
    }
    pageInit();
    function pageInit() {
        jQuery("#list10").jqGrid({
            url: '/investFlow/zbjll',
            datatype: "json",
            postData: {pn:projectName},
            colNames: calNamesArr,
            colModel: colModelArr,
            rowNum: 17,
            width: 1400,
            rowList: [17],
            pager: '#pager10',
            viewrecords: true,
            sortable:false,
            jsonReader: {
                repeatitems: false
            },
            shrinkToFit: false,
            caption: "项目资本金现金流量表",
            height: 'auto',
            mtype:"POST"
        });
        $("#list10").jqGrid('setGroupHeaders', {
            useColSpanStyle: true,
            groupHeaders: [
                {startColumnName: 'b1', numberOfColumns: bYear, titleText: '建设期'},
                {startColumnName: 'r1', numberOfColumns: mYear, titleText: '运营期'}
            ]
        })
        jQuery("#list10").jqGrid('setFrozenColumns');
        jQuery("#list10").jqGrid('navGrid', '#pager10', {edit: true, add: false, del: false});
    }
}

function onProfit(){
    var calNamesArr = ["序号","项目"];
    var colModelArr = [
        {name: 'num', index: 'num', width: 60, align: 'center', sortable: false,  frozen: true,editable : true},
        {name: 'name', index: 'name', width: 130, sortable: false, frozen: true},
    ];
    //初始化表格
    for (var i = 1; i <= mYear; ++i) {
        calNamesArr.push(String(i));
        var model = {name: "r" + i, index: "r" + i, width: 75, sortable: false, align: "right", formatter: 'number'};
        colModelArr.push(model)
    }
    pageInit();
    function pageInit() {
        jQuery("#list11").jqGrid({
            url: '/profit/lrb',
            datatype: "json",
            postData: {pn:projectName},
            colNames: calNamesArr,
            colModel: colModelArr,
            rowNum: 20,
            width: 1400,
            rowList: [12],
            pager: '#pager11',
            viewrecords: true,
            sortable:false,
            jsonReader: {
                repeatitems: false
            },
            shrinkToFit: false,
            caption: "利润与利润分配表（计算流量）",
            height: 'auto',
            mtype:"POST"
        });
        $("#list11").jqGrid('setGroupHeaders', {
            useColSpanStyle: true,
            groupHeaders: [
                {startColumnName: 'r1', numberOfColumns: mYear, titleText: '运营期'}
            ]
        });
        jQuery("#list11").jqGrid('setFrozenColumns');
        jQuery("#list11").jqGrid('navGrid', '#pager2', {edit: true, add: false, del: false});
    }
}

function onRepay(){
    var calNamesArr = ["序号","项目","合计"];
    var colModelArr = [
        {name: 'num', index: 'num', width: 60, align: 'center', sortable: false,  frozen: true,editable : true},
        {name: 'name', index: 'name', width: 100, sortable: false, frozen: true},
        {name: 'total', index: 'total', width: 75, formatter: 'number', sortable: false, frozen: true, align: 'right'}
    ];
    //初始化表格
    for (var i = 1; i <= bYear; ++i) {
        calNamesArr.push(String(i));
        var model = {name:"b"+i, index:"b" + i, width:75, sortable: false, align: "right", formatter: 'number'};
        colModelArr.push(model)
    }
    for (var i = 1; i <= mYear; ++i) {
        calNamesArr.push(String(i));
        var model = {name: "r" + i, index: "r" + i, width: 75, sortable: false, align: "right", formatter: 'number'};
        colModelArr.push(model)
    }
    pageInit();
    function pageInit() {
        jQuery("#list12").jqGrid({
            url: '/repay/hbfx',
            datatype: "json",
            postData: {pn:projectName},
            colNames: calNamesArr,
            colModel: colModelArr,
            rowNum: 28,
            width: 1400,
            rowList: [28],
            pager: '#pager12',
            viewrecords: true,
            sortable:false,
            jsonReader: {
                repeatitems: false
            },
            shrinkToFit: false,
            caption: "还本付息表",
            height: 'auto',
            mtype:"POST"
        });
        $("#list12").jqGrid('setGroupHeaders', {
            useColSpanStyle: true,
            groupHeaders: [
                {startColumnName: 'b1', numberOfColumns: bYear, titleText: '建设期'},
                {startColumnName: 'r1', numberOfColumns: mYear, titleText: '运营期'}
            ]
        })
        jQuery("#list12").jqGrid('setFrozenColumns');
        jQuery("#list12").jqGrid('navGrid', '#pager12', {edit: true, add: false, del: false});
    }
}