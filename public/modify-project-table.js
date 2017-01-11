/**
 * Created by Fizzo on 16/11/24.
 */
var preData = []
var sfbzData = []
var addYearCar = 0
var addYearSfbz = 0
$(function () {
    var _Id = 10000
    var $table = $('#table'),
        $button = $('#button');

    $('#sfbzAddYear').click(function () {
        sfbzData.push(new Object())
        setTableVariable(sfbzData)
        $('#sfbzTable').bootstrapTable('insertRow',{index:0,row:{sfid:_Id++}});
        addYearSfbz++
    });

    $button.click(function () {
        preData.push(new Object())
        setTableVariable(preData)
        $table.bootstrapTable('insertRow',{index:0,row:{_id:_Id++}});
        addYearCar++
    });
    
    var rowData = [{name:"车型折算系数"},{name:"收费里程百分比"}]
    $('#xsTable').bootstrapTable('load',rowData);

    $('#sfbzTable').bootstrapTable('hideColumn', 'sfid');
    $table.bootstrapTable('hideColumn', '_id');
    $table.bootstrapTable({
        toolbar: "#toolbar",
        pagination: true,
        showRefresh: true,
        search: true,
        onLoadSuccess:function(){
            console.log("onLoadSuccess")
        },
        onResetView:function(){
            console.log("onResetView")
        }
    });
});

function operateFormatter(value, row, index) {
    return '<button type="button" class="RoleOfA btn btn-default  btn-sm" style="margin-right:15px;">删除</button>'
}

function filterStr(_this)
{
    _this.value=_this.value.replace(/[^\-?\d.]/g,'')
}

function sumStr(_self){
    var sum = 0
    var idx = _self.id.split('_')[1]
    var source = document.getElementById('hj_'+idx)
    sum += Number(document.getElementById('k1_'+idx).value)
    sum += Number(document.getElementById('k2_'+idx).value)
    sum += Number(document.getElementById('k3_'+idx).value)
    sum += Number(document.getElementById('k4_'+idx).value)
    sum += Number(document.getElementById('h1_'+idx).value)
    sum += Number(document.getElementById('h2_'+idx).value)
    sum += Number(document.getElementById('h3_'+idx).value)
    sum += Number(document.getElementById('h4_'+idx).value)
    sum += Number(document.getElementById('h5_'+idx).value)
    source.innerHTML = sum
}

function filterYear(_self){
    var idx = _self.id.split('_')[1]
    if(idx==0){
        var dataFile = _self.id.split('_')[0]
        var beginYear = Number(document.getElementById('by').value)
        if(beginYear==0){
            alert("请先填写起始年份")
            document.getElementById(_self.id).value = ""
            return
        }
        if(dataFile=='y'){
            var curYear = Number(document.getElementById(_self.id).value)
            if(curYear<=beginYear){
                alert("第一条年份必须大于等于起始年份")
                document.getElementById(_self.id).value = ""
            }
        }else{

        }
    }else{
        var dataFile = _self.id.split('_')[0]
        var curYear = Number(document.getElementById(_self.id).value)
        var beforyear = Number(document.getElementById(dataFile+"_"+(Number(idx)-1)).value)
        if(curYear<=beforyear){
            alert("新增的年份必须大于前一条记录的年份")
            document.getElementById(_self.id).value = ""
        }
    }
}

function inputFormatter(dataFile,index,arr,change){
    var _id = dataFile+"_"+index
    var val = ""
    if(arr && arr[index]){
        val = arr[index][dataFile] || ""
    }
    var changeStr = ""
    if(change){
        if(dataFile=='y'||dataFile=='sfy'){
            changeStr = "onchange='filterYear(this)'"
        }else{
            changeStr = "onchange='sumStr(this)'"
        }
    }else{
        changeStr=""
    }
    return "<input type='text' class='form-control' data-container='body' data-toggle='popover' data-placement='bottom' "+changeStr+" onkeyup='filterStr(this)' data-content='不能为空' style='width: 100%' value='"+val+"' id='"+_id+"' name='"+_id+"'>"
}

function inputFormatter1(dataFile,index,value){
    var _id = dataFile+"_"+index
    if(!value){
        value = ""
    }
    return "<input type='text' class='form-control' data-container='body' data-toggle='popover' data-placement='bottom' onkeyup='filterStr(this)' data-content='不能为空' style='width: 100%' value='"+value+"' id='"+_id+"' name='"+_id+"'>"
}

function hjFormatter(value,row,index){
    var _id = "hj_"+index
    return "<h5 id='"+_id+"'></h5>"
}

function k1Formatter(value, row, index){
    
    return inputFormatter("k1",index,preData,true)
}
function k2Formatter(value, row, index){
     return inputFormatter("k2",index,preData,true)
}
function k3Formatter(value, row, index){
     return inputFormatter("k3",index,preData,true)
}
function k4Formatter(value, row, index){
    return inputFormatter("k4",index,preData,true)
}
function h1Formatter(value, row, index){
    return inputFormatter("h1",index,preData,true)
}
function h2Formatter(value, row, index){
    return inputFormatter("h2",index,preData,true)
}

function h3Formatter(value, row, index){
    return inputFormatter("h3",index,preData,true)
}

function h4Formatter(value, row, index){
    return inputFormatter("h4",index,preData,true)
}

function h5Formatter(value, row, index){
    return inputFormatter("h5",index,preData,true)
}
function jtlFormatter(value, row, index){
    return inputFormatter("jtl",index,preData)
}

function yFormatter(value,row,index){
    return inputFormatter("y",index,preData,true)
}

function sfk1Formatter(value, row, index){

    return inputFormatter("sfk1",index,sfbzData)
}
function sfk2Formatter(value, row, index){
    return inputFormatter("sfk2",index,sfbzData)
}
function sfk3Formatter(value, row, index){
    return inputFormatter("sfk3",index,sfbzData)
}
function sfk4Formatter(value, row, index){
    return inputFormatter("sfk4",index,sfbzData)
}
function sfh1Formatter(value, row, index){
    return inputFormatter("sfh1",index,sfbzData)
}
function sfh2Formatter(value, row, index){
    return inputFormatter("sfh2",index,sfbzData)
}

function sfh3Formatter(value, row, index){
    return inputFormatter("sfh3",index,sfbzData)
}

function sfh4Formatter(value, row, index){
    return inputFormatter("sfh4",index,sfbzData)
}

function sfh5Formatter(value, row, index){
    return inputFormatter("sfh5",index,sfbzData)
}

function sfyFormatter(value,row,index){
    return inputFormatter("sfy",index,sfbzData,true)
}

function xsk1Formatter(value,row,index){
    return inputFormatter1("xsk1",index,value)
}
function xsk2Formatter(value,row,index){
    return inputFormatter1("xsk2",index,value)
}

function xsk3Formatter(value,row,index){
    return inputFormatter1("xsk3",index,value)
}

function xsk4Formatter(value,row,index){
    return inputFormatter1("xsk4",index,value)
}

function xsh1Formatter(value,row,index){
    return inputFormatter1("xsh1",index,value)
}

function xsh2Formatter(value,row,index){
    return inputFormatter1("xsh2",index,value)
}

function xsh3Formatter(value,row,index){
    return inputFormatter1("xsh3",index,value)
}

function xsh4Formatter(value,row,index){
    return inputFormatter1("xsh4",index,value)
}

function xsh5Formatter(value,row,index){
    return inputFormatter1("xsh5",index,value)
}

window.operateEvents = {
    'click .RoleOfA': function (e, value, row, index) {
        if(row.hasOwnProperty("_id")){
            setTableVariable(preData)
            preData.splice(index,1)
            $('#table').bootstrapTable('remove', {
                field: '_id',
                values: [row._id]
            });
            addYearCar--
        }else{
            setTableVariable(sfbzData)
            sfbzData.splice(index,1)
            $('#sfbzTable').bootstrapTable('remove', {
                field: 'sfid',
                values: [row.sfid]
            });
            addYearSfbz--
        }

    }
};

function getTablePostVariable(tableId){
    var table = document.getElementById(tableId)
    var tableInput = table.getElementsByTagName('INPUT')
    var postVariableStr = ""
    for (var idx = 0; idx < tableInput.length; idx++) {
        var input = tableInput[idx]
        var variable = "&"+input.name+"="+input.value
        postVariableStr += variable
    }
    return postVariableStr
}

function setTableVariable(arr){
    var table
    if(arr === preData){
        table = document.getElementById("table")
    }else{
        table = document.getElementById("sfbzTable")
    }
    if(arr.length>0){
        var tableInput = table.getElementsByTagName('INPUT')
        for (var idx = 0; idx < tableInput.length; idx++) {
            var input = tableInput[idx]
            var tmpStr = input.name.split("_")
            var row = Number(tmpStr[1])
            var cell = tmpStr[0]
            arr[row][cell]= input.value
        }
    }
}

function setCarYearTableView(argData){
    for(var idx=0;true;idx++){
        if(argData["y_"+idx]){
            preData.push(new Object())
            preData[idx]['y'] = argData['y_'+idx]
            preData[idx]['k1'] = argData['k1_'+idx]
            preData[idx]['k2'] = argData['k2_'+idx]
            preData[idx]['k3'] = argData['k3_'+idx]
            preData[idx]['k4'] = argData['k4_'+idx]
            preData[idx]['h1'] = argData['h1_'+idx]
            preData[idx]['h2'] = argData['h2_'+idx]
            preData[idx]['h3'] = argData['h3_'+idx]
            preData[idx]['h4'] = argData['h4_'+idx]
            preData[idx]['h5'] = argData['h5_'+idx]
            preData[idx]['jtl'] = argData['jtl_'+idx]
            $('#table').bootstrapTable('insertRow',{index:idx,row:{_id:idx}});
            addYearCar++
        }else{
            break
        }
    }
}

function setSfYearTableView(argData){
    for(var idx=0;true;idx++){
        if(argData["sfy_"+idx]){
            sfbzData.push(new Object())
            sfbzData[idx]['sfy'] = argData['sfy_'+idx]
            sfbzData[idx]['sfk1'] = argData['sfk1_'+idx]
            sfbzData[idx]['sfk2'] = argData['sfk2_'+idx]
            sfbzData[idx]['sfk3'] = argData['sfk3_'+idx]
            sfbzData[idx]['sfk4'] = argData['sfk4_'+idx]
            sfbzData[idx]['sfh1'] = argData['sfh1_'+idx]
            sfbzData[idx]['sfh2'] = argData['sfh2_'+idx]
            sfbzData[idx]['sfh3'] = argData['sfh3_'+idx]
            sfbzData[idx]['sfh4'] = argData['sfh4_'+idx]
            sfbzData[idx]['sfh5'] = argData['sfh5_'+idx]
            $('#sfbzTable').bootstrapTable('insertRow',{index:idx,row:{sfid:idx}});
            addYearSfbz++
        }else{
            break
        }
    }
}

function setXsTableView(argData){
    var rowData = [{name:"车型折算系数"},{name:"收费里程百分比"}]
    for(var idx in rowData){
        rowData[idx]['xsk1'] = argData['xsk1_'+idx]
        rowData[idx]['xsk2'] = argData['xsk2_'+idx]
        rowData[idx]['xsk3'] = argData['xsk3_'+idx]
        rowData[idx]['xsk4'] = argData['xsk4_'+idx]
        rowData[idx]['xsh1'] = argData['xsh1_'+idx]
        rowData[idx]['xsh2'] = argData['xsh2_'+idx]
        rowData[idx]['xsh3'] = argData['xsh3_'+idx]
        rowData[idx]['xsh4'] = argData['xsh4_'+idx]
        rowData[idx]['xsh5'] = argData['xsh5_'+idx]
    }
    $('#xsTable').bootstrapTable('load',rowData);
}