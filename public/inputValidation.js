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