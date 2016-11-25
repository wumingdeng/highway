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
    var form = document.getElementById("prForm")
    var table = document.getElementById("table")
    var xsTable = document.getElementById("xsTable")
    var inputs = form.getElementsByTagName('INPUT')
    for (var idx = 0; idx < inputs.length; idx++) {
        var input = inputs[idx]
        if (Trim(input.value) == "") {
            $('#' + input.id).popover('show');
            return false
        }
    }
    var tableInput = table.getElementsByTagName('INPUT')
    for (var idx = 0; idx < tableInput.length; idx++) {
        var input = tableInput[idx]
        if (Trim(input.value) == "") {
            $('#' + input.id).popover('show');
            return false
        }
    }

    var xsTableInput = xsTable.getElementsByTagName('INPUT')
    for (var idx = 0; idx < xsTableInput.length; idx++) {
        var input = xsTableInput[idx]
        if (Trim(input.value) == "") {
            $('#' + input.id).popover('show');
            return false
        }
    }

    var buildYear = document.getElementById("buildSel").value
    var jsqSum = 0
    var dktr = 0
    for(var year = 1;year<=buildYear;year++ ){
        jsqSum += Number(document.getElementById("jsq" + year).value)
        dktr += Number(document.getElementById("dktr" + year).value)
    }
    if(jsqSum != 1){
        alert("建设投资比例填写不正确")
        return false
    }
    if(dktr != 1){
        alert("贷款投入比例填写不正确")
        return false
    }
    return true
}