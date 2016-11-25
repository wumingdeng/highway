/**
 * Created by Fizzo on 16/11/24.
 */
var preData = []
$(function () {
    var _Id = 0
    var $table = $('#table'),
        $button = $('#button');
    
    $button.click(function () {
        preData.push(new Object())
        setTableVariable()
        $table.bootstrapTable('insertRow',{index:0,row:{_id:_Id++}});
        
       
    });
    
    var rowData = [{name:"车型折算系数"},{name:"里程折算系数"},{name:"收费标准"}]
    $('#xsTable').bootstrapTable('load',rowData);

    $table.bootstrapTable('hideColumn', '_id');
    $table.bootstrapTable({
        toolbar: "#toolbar",
        idField: "Id",
        pagination: true,
        showRefresh: true,
        search: true,
        clickToSelect: true,
        queryParams: function (param) {
            return {};
        },
        url: "/Editable/GetUsers",
        onEditableSave: function (field, row, oldValue, $el) {
            $.ajax({
                type: "post",
                url: "/Editable/Edit",
                data: row,
                dataType: 'JSON',
                success: function (data, status) {
                    if (status == "success") {
                        alert('提交数据成功');
                    }
                },
                error: function () {
                    alert('编辑失败');
                },
                complete: function () {

                }

            });
        },
        onLoadSuccess:function(){
            console.log("onLoadSuccess")
        },
        onResetView:function(){
            console.log("onResetView")
        },
        onRefresh:function(){
            console.log("onRefresh")
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

function inputFormatter(dataFile,index){
    var _id = dataFile+"_"+index
    var val = ""
    if(preData && preData[index]){
        val = preData[index][dataFile] || ""
    }
    return "<input type='text' class='form-control' data-container='body' data-toggle='popover' data-placement='bottom' onkeyup='filterStr(this)' data-content='不能为空' style='width: 100%' value='"+val+"' id='"+_id+"' name='"+_id+"'>"
}
function k1Formatter(value, row, index){
    
    return inputFormatter("k1",index)
}
function k2Formatter(value, row, index){
     return inputFormatter("k2",index)
}
function k3Formatter(value, row, index){
     return inputFormatter("k3",index)
}
function k4Formatter(value, row, index){
    return inputFormatter("k4",index)
}
function h1Formatter(value, row, index){
    return inputFormatter("h1",index)
}
function h2Formatter(value, row, index){
    return inputFormatter("h2",index)
}

function h3Formatter(value, row, index){
    return inputFormatter("h3",index)
}

function h4Formatter(value, row, index){
    return inputFormatter("h4",index)
}

function h5Formatter(value, row, index){
    return inputFormatter("h5",index)
}
function jtlFormatter(value, row, index){
    return inputFormatter("jtl",index)
}

function yFormatter(value,row,index){
    return inputFormatter("y",index)
}
function xsk1Formatter(value,row,index){
    return inputFormatter("xsk1",index)
}
function xsk2Formatter(value,row,index){
    return inputFormatter("xsk2",index)
}

function xsk3Formatter(value,row,index){
    return inputFormatter("xsk3",index)
}

function xsk4Formatter(value,row,index){
    return inputFormatter("xsk4",index)
}

function xsh1Formatter(value,row,index){
    return inputFormatter("xsh1",index)
}

function xsh2Formatter(value,row,index){
    return inputFormatter("xsh2",index)
}

function xsh3Formatter(value,row,index){
    return inputFormatter("xsh3",index)
}

function xsh4Formatter(value,row,index){
    return inputFormatter("xsh4",index)
}

function xsh5Formatter(value,row,index){
    return inputFormatter("xsh5",index)
}

window.operateEvents = {
    'click .RoleOfA': function (e, value, row, index) {
        setTableVariable()
        preData.splice(index,1)
        $('#table').bootstrapTable('remove', {
            field: '_id',
            values: [row._id]
        });
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

function setTableVariable(){
     var table = document.getElementById("table")
    var tableInput = table.getElementsByTagName('INPUT')
    for (var idx = 0; idx < tableInput.length; idx++) {
        var input = tableInput[idx]
        var tmpStr = input.name.split("_")
        var row = Number(tmpStr[1])
        var cell = tmpStr[0]
        preData[row][cell]= input.value
    }
}