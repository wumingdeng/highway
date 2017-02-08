/**
 * Created by Fizzo on 16/11/24.
 */

function onRunPostForm() {
    if (!onValidator()) return

    var postData = $('#runForm').serialize()
    postData = postData + "&pn=" + projectName
    $.ajax({
        cache: true,
        type: "POST",
        url: '/manageProject/saveProjectByRUN',
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
    var form = document.getElementById("runForm")
    var inputs = form.getElementsByTagName('INPUT')
    for (var idx = 0; idx < inputs.length; idx++) {
        var input = inputs[idx]
        if (Trim(input.value) == "") {
            $('#' + input.id).popover('show');
            isValli = false
        }
    }
    var bfy = Number(document.getElementById('bfy').value)
    var mfy = Number(document.getElementById('mfy').value)
    if(mfy>=bfy){
        window.parent.alertDilog("中修年限不能大于等于大修年限,且中修年限最好是处于大修年限的中间值")
        return false
    }
    if(!isValli){
        alert("请填写完整!")
    }
    return isValli
}

function setRunMangeTableView(argPost){
    document.getElementById("mcf").value = argPost.mcf || "";
    document.getElementById("bfr").value = argPost.bfr || "";
    document.getElementById("mfr").value = argPost.mfr || "";
    document.getElementById("mtcr").value = argPost.mtcr || "";
    document.getElementById("mcr").value = argPost.mcr || "";
    document.getElementById("tmct").value = argPost.tmct || "";
    document.getElementById("sct").value = argPost.sct || "";
    document.getElementById("bfy").value = argPost.bfy || "";
    document.getElementById("mfy").value = argPost.mfy || "";

    document.getElementById("yyf").value = argPost.yyf || "";
    document.getElementById("yhf").value = argPost.yhf || "";
    document.getElementById("sdzmf").value = argPost.sdzmf || "";
    document.getElementById("jdf").value = argPost.jdf || "";
    document.getElementById("sjzxf").value = argPost.sjzxf || "";
    document.getElementById("sjdxf").value = argPost.sjdxf || "";
    document.getElementById("fwf").value = argPost.fwf || "";
}