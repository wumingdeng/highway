/**
 * Created by Fizzo on 16/11/24.
 */

$(function () {
    var idx = 0
    var $table = $('#table'),
        $button = $('#button');

    $button.click(function () {
        $table.bootstrapTable('append', randomData());
        $table.bootstrapTable('scrollTo', 'bottom');
    });
    function randomData() {

        var rows = [{
            _id:idx++,
            k1: 0,
            k2: 0,
            k3: 0,
            k3: 0,
            k4: 0,
            h1: 0,
            h2: 0,
            h3: 0,
            h4: 0,
            h5: 0,
            jtl: 0
        }]
        return rows;
    }
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
        }
    });
});

function operateFormatter(value, row, index) {
        return '<button type="button" class="RoleOfA btn btn-default  btn-sm" style="margin-right:15px;">删除</button>'
}

function inputFormatter(value, row, index){
    return "<input type='text' style='width: 100%' id="+index+row+" name="+index+row+">"
}

window.operateEvents = {
    'click .RoleOfA': function (e, value, row, index) {
        $('#table').bootstrapTable('remove', {
            field: '_id',
            values: [row._id]
        });
    }
};