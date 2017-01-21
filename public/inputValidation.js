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
    var sfbzTable = document.getElementById("sfbzTable")
    var inputs = form.getElementsByTagName('INPUT')
    for (var idx = 0; idx < inputs.length; idx++) {
        var input = inputs[idx]
        if (Trim(input.value) == "") {
            $('#' + input.id).popover('show');
            isValli = false
        }
    }
    var df = Number(document.getElementById('df').value)
    var zj = Number(document.getElementById('zj').value)
    if((df+zj)!=100){
        window.parent.alertDilog("中交股比跟地方股比的比例为100")
        return false
    }

    var bfy = Number(document.getElementById('bfy').value)
    var mfy = Number(document.getElementById('mfy').value)
    if(mfy>=bfy){
        window.parent.alertDilog("中修年限不能大于等于大修年限,且中修年限最好是处于大修年限的中间值")
        return false
    }

    var beginYear = Number(document.getElementById('by').value)
    if(beginYear<1000 || beginYear>10000){
        alert("请输入有效年份")
        return false
    }
    if(preData.length<=0){
        alert("请输入车辆的预测比例")
        return false
    }
    if(sfbzData.length<=0){
        alert("请输入收费标准系数")
        return false
    }
    var y_min = Number(document.getElementById('by').value)
    var y_max = Number(preData[addYearCar-1]['y'])
    var runYear = Number(document.getElementById('yyq').value)
    if(y_min+runYear>(y_max+1)){
        alert("部分运营期无预测交通量数据")
        return false
    }

    function checkInvail(k,item){
        return item.hasOwnProperty(k) && Number(item[k])>0
    }

    var tableInput = table.getElementsByTagName('INPUT')
    for (var idx = 0; idx < tableInput.length; idx++) {
        var input = tableInput[idx]
        if (Trim(input.value) == "") {
            $('#' + input.id).popover('show');
            isValli = false
        }
    }

    var sfbzTable = sfbzTable.getElementsByTagName('INPUT')
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
                alert("收费里程系数不能大于1")
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