/**
 * Created by Fizzo on 16/10/28.
 */

function checkNum(obj) {
    //检查是否是非数字值
    if (isNaN(obj.value)) {
        obj.value = "";
    }
}

function Trim(str)
{
    return str.replace(/(^\s*)|(\s*$)/g, "");
}

function onValidator() {
    var isValli = true
    var form = document.getElementById("prForm")
    var table = document.getElementById("table")
    var xsTable = document.getElementById("xsTable")
    var inputs = form.getElementsByTagName('INPUT')
    for (var idx = 0; idx < inputs.length; idx++) {
        var input = inputs[idx]
        if (Trim(input.value) == "") {
            $('#' + input.id).popover('show');
            isValli = false
        }
    }
    var beginYear = Number(document.getElementById('by').value)
    if(beginYear<1000 || beginYear>10000){
        alert("请输入有效年份")
        return false
    }
    var y_min = document.getElementById('y_0')
    var y_max = document.getElementById('y_'+addYearCar)
    var runYear = Number(document.getElementById('yyq').value)
    if(y_min+runYear>y_max){
        alert("预测比例的年份跨度不要超过运营期")
        return false
    }

    var tableInput = table.getElementsByTagName('INPUT')
    for (var idx = 0; idx < tableInput.length; idx++) {
        var input = tableInput[idx]
        if (Trim(input.value) == "") {
            $('#' + input.id).popover('show');
            isValli = false
        }
    }

    var xsTableInput = xsTable.getElementsByTagName('INPUT')
    for (var idx = 0; idx < xsTableInput.length; idx++) {
        var input = xsTableInput[idx]
        if (Trim(input.value) == "") {
            $('#' + input.id).popover('show');
            isValli = false
        }
        if(input.name.indexOf("_1")>0){
            if(Number(input.value) > 1){
                alert("里程折算系数不能大于1")
                return false
            }
        }

    }

    var buildYear = document.getElementById("buildSel").value
    var jsqSum = 0
    var dktr = 0
    for(var year = 1;year<=buildYear;year++ ){
        jsqSum += Number(document.getElementById("jsq" + year).value)
        dktr += Number(document.getElementById("dktr" + year).value)
    }
    if(jsqSum != 100){
        alert("建设投资比例填写不正确")
        return false
    }
    if(dktr != 100){
        alert("贷款投入比例填写不正确")
        return false
    }
    if(!isValli){
        alert("请填写完整!")
    }
    return isValli
}