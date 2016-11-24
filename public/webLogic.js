/**
 * Created by Fizzo on 16/10/8.
 */
var projectName = ""
var _id = ""
var bYear = 4
var mYear = 30 //建设期和运营期从服务端取配置

function onRunManage() {
    var calNamesArr = ["序号", "项目", "基年"];
    var colModelArr = [
        {name: 'num', index: 'num', width: 60, align: 'center', sortable: false, frozen: true},
        {name: 'name', index: 'name', width: 100, sortable: false, frozen: true},
        {name: 'r0', index: 'r0', width: 100, sortable: false, align: "right"}
    ];
//初始化表格
    for (var i = 1; i <= mYear; ++i) {
        calNamesArr.push(String(i));
        var model = {
            name: "r" + i,
            index: "r" + i,
            width: 75,
            sortable: false,
            editable: false,
            align: "right",
            formatter: 'number',
            edittype: 'text',
        };
        colModelArr.push(model)
    }
    pageInit();
    function pageInit() {
        var lastsel2
        jQuery("#list2").jqGrid({
            url: '/runManage/yygl',
            datatype: "json",
            postData: {pn: projectName},
            colNames: calNamesArr,
            colModel: colModelArr,
            rowNum: 20,
            autowidth: true,
            rowList: [8],
            viewrecords: true,
            sortable: false,
            jsonReader: {
                repeatitems: false
            },
            shrinkToFit: false,
            caption: "运营管理费",
            height: 'auto',
            mtype: "POST",

            editurl: "/manageProject/updateWithCell",

            ondblClickRow: function (rowid, iRow, iCol, e) {
                if (rowid && rowid !== lastsel2) {
                    var rowData = $("#jqGridId").jqGrid("getRowData", rowid);
                    jQuery('#list2').jqGrid('restoreRow', lastsel2);
                    jQuery('#list2').jqGrid('editRow', rowid, {
                        keys: true,
                        restoreAfterError: true,
                        extraparam: {
                            "rowData": rowData,
                            "name": "yygl"
                        },
                        oneditfunc: function (rowid) {
                            console.log(rowid);
                        },
                        successfunc: function (response) {
                            alert("save success");
                            return true;
                        },
                        errorfunc: function (rowid, res) {
                            console.log(rowid);
                            console.log(res);
                        }
                    });
                    lastsel2 = rowid;
                }
            }
        });
        jQuery("#list2").jqGrid('setFrozenColumns');
        jQuery("#list2").jqGrid('navGrid', '#pager2', {edit: true, add: false, del: false});
    }
}

function onCarCalc() {
    function onFormatterName(cellvalue) {
        switch (cellvalue) {
            case "0":
                return "小客"
            case "1":
                return "大客"
            case "2":
                return "小货"
            case "3":
                return "中货"
            case "4":
                return "大货"
            case "5":
                return "特大货"
            case "6":
                return "拖挂"
            case "7":
                return "合计"
            default:
                return ""
        }
    }

    function onIndexFormatter(cellvalue) {
        return Number(cellvalue) + 1
    }

    function onNumberToFixed(cellvalue) {
        return Number(cellvalue).toFixed(2)
    }

    var calNamesArr = ["序号", "项目"];
    var colModelArr = [
        {
            name: 'rid',
            index: 'rid',
            width: 60,
            align: 'center',
            sortable: false,
            frozen: true,
            editable: true,
            formatter: onIndexFormatter
        },
        {name: 'car', index: 'car', width: 100, sortable: false, frozen: true, formatter: onFormatterName}
    ]

    //初始化表格
    for (var i = 1; i <= mYear; ++i) {
        calNamesArr.push("第" + i + "年份");
        var model = {
            name: "year" + i,
            index: "year" + i,
            width: 75,
            sortable: false,
            align: "right",
            formatter: onNumberToFixed
        };
        colModelArr.push(model)
    }

    pageInit();
    function pageInit() {
        jQuery("#list5").jqGrid({
            url: '/carCalc/car_sfsr',
            datatype: "json",
            postData: {pn: projectName},
            colNames: calNamesArr,
            colModel: colModelArr,
            rowNum: 10,
            autowidth: true,
            rowList: [30],
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

function onCashFlow() {
    var calNamesArr = ["序号", "项目", "合计"];
    var colModelArr = [
        {name: 'num', index: 'num', width: 60, align: 'center', sortable: false, frozen: true, editable: true},
        {name: 'name', index: 'name', width: 100, sortable: false, frozen: true},
        {name: 'total', index: 'total', width: 75, formatter: 'number', sortable: false, frozen: true, align: 'right'}
    ];
    //初始化表格
    for (var i = 1; i <= bYear; ++i) {
        calNamesArr.push(String(i));
        var model = {
            name: "b" + i,
            index: "b" + i,
            width: 75,
            sortable: false,
            align: "right",
            formatter: 'number',
            editable: true,
            edittype: 'text'
        };
        colModelArr.push(model)
    }
    for (var i = 1; i <= mYear; ++i) {
        calNamesArr.push(String(i));
        var model = {
            name: "r" + i,
            index: "r" + i,
            width: 75,
            sortable: false,
            align: "right",
            formatter: 'number',
            editable: true,
            edittype: 'text'
        };
        colModelArr.push(model)
    }
    pageInit();
    function pageInit() {
        var lastsel2
        jQuery("#list6").jqGrid({
            url: '/cashFlow/xjll',
            datatype: "json",
            postData: {pn: projectName},
            colNames: calNamesArr,
            colModel: colModelArr,
            rowNum: 20,
            autowidth: true,
            rowList: [20],
            viewrecords: true,
            sortable: false,
            jsonReader: {
                repeatitems: false
            },
            shrinkToFit: false,
            caption: "项目投资现金流量表",
            height: 'auto',
            mtype: "POST",
            editurl: "/manageProject/updateWithCell",
            ondblClickRow: function (rowid, iRow, iCol, e) {
                if (rowid && rowid !== lastsel2) {
                    var rowData = $("#list6").jqGrid("getRowData", rowid);
                    if(rowData.name == "水利基金" || rowData.name == "流动资金") {
                        jQuery('#list6').jqGrid('restoreRow', lastsel2);
                        jQuery('#list6').jqGrid('editRow', rowid, {
                            keys: true,
                            restoreAfterError: true,
                            extraparam: {
                                "rn": rowData.name,
                                "ln": "xjll"
                            },
                            oneditfunc: function (rowid) {
                                console.log(rowid);
                            },
                            successfunc: function (response) {
                                if(response.ok=="1"){
                                    jQuery("#list6").jqGrid('setGridParam',{url:'/cashFlow/xjll'}).trigger("reloadGrid");
                                }
                                lastsel2=""
                                return true;
                            },
                            errorfunc: function (rowid, res) {
                                lastsel2=""
                                console.log(rowid);
                                console.log(res);
                            }
                        });
                        lastsel2 = rowid;
                    }
                }
            }
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

function onCost() {
    var calNamesArr = ["序号", "项目"];
    var colModelArr = [
        {name: 'num', index: 'num', width: 60, align: 'center', sortable: false, frozen: true},
        {name: 'name', index: 'name', width: 130, sortable: false, frozen: true}
    ];
    //初始化表格
    for (var i = 1; i <= mYear; ++i) {
        calNamesArr.push(String(i));
        var model = {
            name: "r" + i,
            index: "r" + i,
            width: 75,
            sortable: false,
            editable: true,
            align: "right",
            formatter: 'number',
            edittype: 'text'
        };
        colModelArr.push(model)
    }
    pageInit();
    function pageInit() {
        var lastsel2
        jQuery("#list7").jqGrid({
            url: '/cost/cbb',
            datatype: "json",
            postData: {pn: projectName},
            colNames: calNamesArr,
            colModel: colModelArr,
            rowNum: 20,
            autowidth: true,
            rowList: [14],
            // pager: '#pager7',
            viewrecords: true,
            sortable: false,
            jsonReader: {
                repeatitems: false
            },
            shrinkToFit: false,
            caption: "总成本费用估算表(生产要素法)",
            height: 'auto',
            mtype: "POST",
            editurl: "/manageProject/updateWithCell",
            ondblClickRow: function (rowid, iRow, iCol, e) {
                var rowData = $("#list7").jqGrid("getRowData", rowid);
                if(rowData.name == "水利基金" || rowData.name == "推销费") {
                    if (rowid && rowid !== lastsel2) {
                        jQuery('#list7').jqGrid('restoreRow', lastsel2);
                        jQuery('#list7').jqGrid('editRow', rowid, {
                            keys: true,
                            restoreAfterError: true,
                            extraparam: {
                                "rn": rowData.name,
                                "ln": "cbb"
                            },
                            oneditfunc: function (rowid) {
                                console.log(rowid);
                            },
                            successfunc: function (response) {
                                if (response.ok == "1") {
                                    jQuery("#list7").jqGrid('setGridParam', {url: '/cost/cbb'}).trigger("reloadGrid");
                                }
                                lastsel2 = ""
                                return true;
                            },
                            errorfunc: function (rowid, res) {
                                lastsel2 = ""
                                console.log(rowid);
                                console.log(res);
                            }
                        });
                        lastsel2 = rowid;
                    }
                }
            }
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
function onPlanCashFlow() {
    var calNamesArr = ["序号", "项目", "合计"];
    var colModelArr = [
        {name: 'num', index: 'num', width: 60, align: 'center', sortable: true, frozen: true, editable: true},
        {name: 'name', index: 'name', width: 100, sortable: false, frozen: true},
        {name: 'total', index: 'total', width: 75, formatter: 'number', sortable: false, frozen: true, align: 'right'}
    ];
    //初始化表格
    for (var i = 1; i <= bYear; ++i) {
        calNamesArr.push(String(i));
        var model = {
            name: "b" + i,
            index: "b" + i,
            width: 75,
            sortable: false,
            align: "right",
            formatter: 'number',
            editable: true,
            edittype: 'text'
        };
        colModelArr.push(model)
    }
    for (var i = 1; i <= mYear; ++i) {
        calNamesArr.push(String(i));
        var model = {
            name: "r" + i,
            index: "r" + i,
            width: 75,
            sortable: false,
            align: "right",
            formatter: 'number',
            editable: true,
            edittype: 'text'
        };
        colModelArr.push(model)
    }
    pageInit();
    function pageInit() {
        var lastsel2 = {}
        jQuery("#list8").jqGrid({
            url: '/planCashFlow/pcf',
            datatype: "json",
            postData: {pn: projectName},
            colNames: calNamesArr,
            colModel: colModelArr,
            rowNum: 40,
            autowidth: true,
            rowList: [40],
            // pager: '#pager8',
            viewrecords: true,
            sortable: false,
            jsonReader: {
                repeatitems: false
            },
            shrinkToFit: false,
            caption: "财务计划流量",
            height: 'auto',
            mtype: "POST",
            editurl: "/manageProject/updateWithCell",
            ondblClickRow: function (rowid, iRow, iCol, e) {
                var rowData = $("#list8").jqGrid("getRowData", rowid);
                if(rowData.name == "其他流出(水利基金）" || rowData.name == "维持运营投资"|| rowData.name == "流动资金"|| rowData.name == "其他流出"
                ||rowData.name == "流动资金借款" || rowData.name == "债券"|| rowData.name == "应付利润") {
                    if (rowid && rowid !== lastsel2) {
                        jQuery('#list8').jqGrid('restoreRow', lastsel2);
                        jQuery('#list8').jqGrid('editRow', rowid, {
                            keys: true,
                            restoreAfterError: true,
                            extraparam: {
                                "rn": rowData.name,
                                "ln": "pcf"
                            },
                            oneditfunc: function (rowid) {
                                lastsel2 = {}
                                console.log(rowid);
                            },
                            successfunc: function (res) {
                                lastsel2 = {}
                                if (res.responseJSON.ok == "1") {
                                    jQuery("#list8").jqGrid('setGridParam', {url: '/planCashFlow/pcf'}).trigger("reloadGrid");
                                }
                                return true;
                            },
                            errorfunc: function (rowid, res) {
                                lastsel2 = {}
                                console.log(rowid);
                                console.log(res);
                            }
                        });
                        lastsel2 = rowid;
                    }
                }
            }
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

function onFixedAssets() {
    var calNamesArr = ["序号", "项目", "总计"];
    var colModelArr = [
        {name: 'num', index: 'num', width: 60, align: 'center', sortable: false, frozen: true, editable: true},
        {name: 'name', index: 'name', width: 100, sortable: false, frozen: true},
        {
            name: 'total',
            index: 'total',
            width: 75,
            formatter: 'number',
            sortable: false,
            frozen: true,
            align: 'right',
            editable: true,
            edittype: 'text'
        }
    ];
    //初始化表格
    for (var i = 1; i <= mYear; ++i) {
        calNamesArr.push(String(i));
        var model = {
            name: "r" + i,
            index: "r" + i,
            width: 75,
            sortable: false,
            align: "right",
            formatter: 'number',
            editable: false,
            edittype: 'text'
        };
        colModelArr.push(model)
    }
    pageInit();
    function pageInit() {
        var lastsel2 = {}
        jQuery("#list9").jqGrid({
            url: '/fixedAssets/gdzc',
            datatype: "json",
            postData: {pn: projectName},
            colNames: calNamesArr,
            colModel: colModelArr,
            rowNum: 20,
            autowidth: true,
            rowList: [2],
            viewrecords: true,
            sortable: false,
            jsonReader: {
                repeatitems: false
            },
            shrinkToFit: false,
            caption: "固定资产折旧费估算表",
            height: 'auto',
            mtype: "POST",
            editurl: "/manageProject/updateWithCell",
            ondblClickRow: function (rowid, iRow, iCol, e) {
                if (rowid && rowid !== lastsel2) {
                    var rowData = $("#list9").jqGrid("getRowData", rowid);

                    jQuery('#list9').jqGrid('restoreRow', lastsel2);
                    jQuery('#list9').jqGrid('editRow', rowid, {
                        keys: true,
                        restoreAfterError: true,
                        extraparam: {
                            "rn": rowData.name,
                            "ln": "gdzc"
                        },
                        oneditfunc: function (rowid) {
                            console.log(rowid);
                        },
                        successfunc: function (res) {
                            if(res.responseJSON.ok=="1"){
                                jQuery("#list9").jqGrid('setGridParam',{url:'/fixedAssets/gdzc'}).trigger("reloadGrid");
                            }
                            return true;
                        },
                        errorfunc: function (rowid, res) {
                            console.log(rowid);
                            console.log(res);
                        }
                    });
                    lastsel2 = rowid;
                }
            }
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

function onInvestFlow() {
    var calNamesArr = ["序号", "项目", "合计"];
    var colModelArr = [
        {name: 'num', index: 'num', width: 60, align: 'center', sortable: false, frozen: true, editable: true},
        {name: 'name', index: 'name', width: 100, sortable: false, frozen: true},
        {name: 'total', index: 'total', width: 75, formatter: 'number', sortable: false, frozen: true, align: 'right'}
    ];
    //初始化表格
    for (var i = 1; i <= bYear; ++i) {
        calNamesArr.push(String(i));
        var model = {name: "b" + i, index: "b" + i, width: 75, sortable: false, align: "right", formatter: 'number'};
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
            postData: {pn: projectName},
            colNames: calNamesArr,
            colModel: colModelArr,
            rowNum: 17,
            autowidth: true,
            rowList: [17],
            // pager: '#pager10',
            viewrecords: true,
            sortable: false,
            jsonReader: {
                repeatitems: false
            },
            shrinkToFit: false,
            caption: "项目资本金现金流量表",
            height: 'auto',
            mtype: "POST"
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

function onProfit() {
    var calNamesArr = ["序号", "项目"];
    var colModelArr = [
        {name: 'num', index: 'num', width: 60, align: 'center', sortable: false, frozen: true, editable: true},
        {name: 'name', index: 'name', width: 130, sortable: false, frozen: true}
    ];
    //初始化表格
    for (var i = 1; i <= mYear; ++i) {
        calNamesArr.push(String(i));
        var model = {
            name: "r" + i,
            index: "r" + i,
            width: 75,
            sortable: false,
            align: "right",
            formatter: 'number',
            editable: true,
            edittype: 'text'
        };
        colModelArr.push(model)
    }
    pageInit();
    function pageInit() {
        var lastsel2 = {}
        jQuery("#list11").jqGrid({
            url: '/profit/lrb',
            datatype: "json",
            postData: {pn: projectName},
            colNames: calNamesArr,
            colModel: colModelArr,
            rowNum: 20,
            autowidth: true,
            rowList: [12],
            // pager: '#pager11',
            viewrecords: true,
            sortable: false,
            jsonReader: {
                repeatitems: false
            },
            shrinkToFit: false,
            caption: "利润与利润分配表（计算流量）",
            height: 'auto',
            mtype: "POST",
            editurl: "/manageProject/updateWithCell",
            ondblClickRow: function (rowid, iRow, iCol, e) {
                if (rowid && rowid !== lastsel2) {
                    var rowData = $("#list11").jqGrid("getRowData", rowid);
                    if(rowData.name == "其他" || rowData.name == "递延收益") {
                        jQuery('#list11').jqGrid('restoreRow', lastsel2);
                        jQuery('#list11').jqGrid('editRow', rowid, {
                            keys: true,
                            restoreAfterError: true,
                            extraparam: {
                                "rn": rowData.name,
                                "ln": "lrb"
                            },
                            oneditfunc: function (rowid) {
                                lastsel2 = ""
                                console.log(rowid);
                            },
                            successfunc: function (res) {
                                if (res.responseJSON.ok == "1") {
                                    jQuery("#list11").jqGrid('setGridParam', {url: '/profit/lrb'}).trigger("reloadGrid");
                                }
                                lastsel2 = ""
                                return true;
                            },
                            errorfunc: function (rowid, res) {
                                console.log(rowid);
                                console.log(res);
                            }
                        });
                        lastsel2 = rowid;
                    }
                }
            }
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

function onRepay() {
    var calNamesArr = ["序号", "项目", "合计"];
    var colModelArr = [
        {name: 'num', index: 'num', width: 60, align: 'center', sortable: false, frozen: true, editable: true},
        {name: 'name', index: 'name', width: 100, sortable: false, frozen: true},
        {name: 'total', index: 'total', width: 75, formatter: 'number', sortable: false, frozen: true, align: 'right'}
    ];
    //初始化表格
    for (var i = 1; i <= bYear; ++i) {
        calNamesArr.push(String(i));
        var model = {name: "b" + i, index: "b" + i, width: 75, sortable: false, align: "right", formatter: 'number'};
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
            postData: {pn: projectName},
            colNames: calNamesArr,
            colModel: colModelArr,
            rowNum: 28,
            autowidth: true,
            rowList: [28],
            // pager: '#pager12',
            viewrecords: true,
            sortable: false,
            jsonReader: {
                repeatitems: false
            },
            shrinkToFit: false,
            caption: "还本付息表",
            height: 'auto',
            mtype: "POST"
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