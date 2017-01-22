/**
 * Created by Fizzo on 16/11/24.
 */
var preData = []
var sfbzData = []
var addYearCar = 0
var addYearSfbz = 0
var g_argPost = {}

function autoHeight(height){
    auto_height += height
    window.parent.document.getElementById('ifr').style.height = auto_height+"px"
}

function srsf() {
    var _Id = 10000
    var $table = $('#table'),
        $button = $('#button');
    
    function checkInvailInput(arrayData){
        if(arrayData == preData){
            if(addYearCar==0) return true

            var beforIdx = addYearCar-1

            if($('#y_'+beforIdx).val() == ""){
                return false
            }
            if($('#jtl_'+beforIdx).val() == ""){
                return false
            }
            if($('#k1_'+beforIdx).val() == ""){
                return false
            }   
            if($('#k2_'+beforIdx).val() == ""){
                return false
            }   
            if($('#k3_'+beforIdx).val() == ""){
                return false
            }   
            if($('#k4_'+beforIdx).val() == ""){
                return false
            }   
            if($('#h1_'+beforIdx).val() == ""){
                return false
            }   
            if($('#h2_'+beforIdx).val() == ""){
                return false
            }  
            if($('#h3_'+beforIdx).val() == ""){
                return false
            } 
            if($('#h4_'+beforIdx).val() == ""){
                return false
            } 
            if($('#h5_'+beforIdx).val() == ""){
                return false
            }
            return true
        }else{
            if(addYearSfbz==0) return true
            var beforIdx = addYearSfbz-1
            if($('#sfy_'+beforIdx).val() == ""){
                return false
            }
            if($('#sfk1_'+beforIdx).val() == ""){
                return false
            }   
            if($('#sfk2_'+beforIdx).val() == ""){
                return false
            }   
            if($('#sfk3_'+beforIdx).val() == ""){
                return false
            }   
            if($('#sfk4_'+beforIdx).val() == ""){
                return false
            }   
            if($('#sfh1_'+beforIdx).val() == ""){
                return false
            }   
            if($('#sfh2_'+beforIdx).val() == ""){
                return false
            }  
            if($('#sfh3_'+beforIdx).val() == ""){
                return false
            } 
            if($('#sfh4_'+beforIdx).val() == ""){
                return false
            } 
            if($('#sfh5_'+beforIdx).val() == ""){
                return false
            }
            return true
        }
    }
    function checkHj(){
        if(addYearCar==0) return true

        var beforIdx = addYearCar-1
        if(Number(document.getElementById('hj_'+beforIdx).innerHTML)!=100){
            window.parent.alertDilog('车型占比预测合计必须等于100')
            return false
        }else{
            return true
        }
    }
    $('#sfbzAddYear').click(function () {
        if(checkInvailInput(sfbzData)){
            sfbzData.push(new Object())
            setTableVariable(sfbzData)
            $('#sfbzTable').bootstrapTable('insertRow',{index:0,row:{sfid:_Id++}});
            autoHeight(50)
            addYearSfbz++
        }
        else{
            alert("请填写完整再添加记录")
        }
    });

    $button.click(function () {
        if(checkInvailInput(preData)){
            if(checkHj()) {
                preData.push(new Object())
                setTableVariable(preData)
                $table.bootstrapTable('insertRow', {index: 0, row: {_id: _Id++}});
                autoHeight(50)
                addYearCar++
            }
        }else{
            alert("请填写完整再添加记录")
        }
        
    });
    
    var rowData = [{name:"车型折算系数"},{name:"收费里程系数"}]
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
}

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
    var dataFile = _self.id.split('_')[0]
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
    setTableInputVariable(dataFile,idx,_self.value)
}

function filterYear(_self){
    var idx = _self.id.split('_')[1]
    var dataFile = _self.id.split('_')[0]
    if(idx==0){
        var beginYear = Number(document.getElementById('by').value)
        if(beginYear==0){
            alert("请先填写起始年份")
            document.getElementById(_self.id).value = ""
            return
        }
        if(dataFile=='y'){
            var curYear = Number(document.getElementById(_self.id).value)
            if(curYear>beginYear){
                alert("第一条年份必须小于等于运营期起始年份")
                document.getElementById(_self.id).value = ""
                return
            }
        }else{

        }
    }else{
        var tempArr = {}
        if(dataFile=="sxf"){
            tempArr = sfbzData
        }else{
            tempArr = preData
        }
        var curYear = Number(document.getElementById(_self.id).value)
        var beforyear = Number(tempArr[idx-1][dataFile])||0
        if(curYear<=beforyear){
            alert("新增的年份必须大于前一条记录的年份")
            document.getElementById(_self.id).value = ""
            return
        }
    }
    setTableInputVariable(dataFile,idx,_self.value)
}

function setTableInputVariable(dataFile,idx,value){
    if(dataFile.indexOf('sf')>=0){
        sfbzData[Number(idx)][dataFile] = value
    }else{
        preData[Number(idx)][dataFile] = value
    }
}

function savaVariable(_self){
    var idx = _self.id.split('_')[1]
    var dataFile = _self.id.split('_')[0]
    var value = _self.value
    setTableInputVariable(dataFile,idx,value)
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
        }else if(dataFile.indexOf('k')==0 || dataFile.indexOf('h')==0){
            changeStr = "onchange='sumStr(this)'"
        }else{
            changeStr = "onchange='savaVariable(this)'"
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
    var idx = "hj_"+index
    var sum = 0
    index = Number(index)
    sum += (Number(preData[index]['k1'])||0)
    sum += (Number(preData[index]['k2'])||0)
    sum += (Number(preData[index]['k3'])||0)
    sum += (Number(preData[index]['k4'])||0)
    sum += (Number(preData[index]['h1'])||0)
    sum += (Number(preData[index]['h2'])||0)
    sum += (Number(preData[index]['h3'])||0)
    sum += (Number(preData[index]['h4'])||0)
    sum += (Number(preData[index]['h5'])||0)
    return "<h5 id='"+idx+"'>"+sum+"</h5>"
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
    return inputFormatter("jtl",index,preData,true)
}

function yFormatter(value,row,index){
    return inputFormatter("y",index,preData,true)
}

function sfk1Formatter(value, row, index){

    return inputFormatter("sfk1",index,sfbzData,true)
}
function sfk2Formatter(value, row, index){
    return inputFormatter("sfk2",index,sfbzData,true)
}
function sfk3Formatter(value, row, index){
    return inputFormatter("sfk3",index,sfbzData,true)
}
function sfk4Formatter(value, row, index){
    return inputFormatter("sfk4",index,sfbzData,true)
}
function sfh1Formatter(value, row, index){
    return inputFormatter("sfh1",index,sfbzData,true)
}
function sfh2Formatter(value, row, index){
    return inputFormatter("sfh2",index,sfbzData,true)
}

function sfh3Formatter(value, row, index){
    return inputFormatter("sfh3",index,sfbzData,true)
}

function sfh4Formatter(value, row, index){
    return inputFormatter("sfh4",index,sfbzData,true)
}

function sfh5Formatter(value, row, index){
    return inputFormatter("sfh5",index,sfbzData,true)
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
            autoHeight(-50)
        }else{
            setTableVariable(sfbzData)
            sfbzData.splice(index,1)
            $('#sfbzTable').bootstrapTable('remove', {
                field: 'sfid',
                values: [row.sfid]
            });
            addYearSfbz--
            autoHeight(-50)
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
    autoHeight(50*addYearCar)
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
    autoHeight(50*addYearSfbz)
}

function setXsTableView(argData){
    var rowData = [{name:"车型折算系数"},{name:"收费里程系数"}]
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

function onPostForm() {
    if (!onValidator()) return
    if(addYearCar<2){
        alert("请至少选择两个年份的交通量及车型占比预测")
        return
    }
    if(addYearSfbz<1){
        alert("请至少选择一个年份的收费标准系数，并且小于等于起始年份")
        return
    }
    var postData = "pn=" + projectName
    postData += getTablePostVariable("table")
    postData += getTablePostVariable("xsTable")
    postData += getTablePostVariable("sfbzTable")
    $.ajax({
        cache: true,
        type: "POST",
        url: '/manageProject/saveProjectBySRSF',
        data: postData,// 你的formid
        async: false,
        error: function (request) {
            alert("修改失败");
        },
        success: function (data) {
            if(data.ok == 0){
                window.parent.alertDilog('修改失败')
            }else {
                window.parent.alertDilog('修改成功',function(){
                    onReloadGrid()
                })
            }
        }
    });
}

function Trim(str)
{
    return str.replace(/(^\s*)|(\s*$)/g, "");
}

function onValidator() {
    var isValli = true
    var table = document.getElementById("table")
    var xsTable = document.getElementById("xsTable")
    var sfbzTable = document.getElementById("sfbzTable")
    

    var beginYear = Number(proDat.by)
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
    var y_max = Number(preData[addYearCar-1]['y'])
    var runYear = Number(document.getElementById('yyq').value)
    if(beginYear+runYear>(y_max+1)){
        alert("部分运营期无预测交通量数据")
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

    
    if(!isValli){
        alert("请填写完整!")
    }
    return isValli
}