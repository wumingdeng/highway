/**
 * Created by chenzhaowen on 16-9-7.
 */
var npt = require("./inputTable.js");
function YData(arr,name) {
    this.bYear = npt.BUILD_YEAR;    //建设期
    this.mYear = npt.OLC_YEAR;      //运营期
    this.arr = arr || [];
    this.sum = 0;
    this.name = name;   //本条数据名称
    if (this.arr.length == 0) {
        //for (var i = 0; i < this.bYear + this.mYear; ++i) {
        //    this.arr.push(0);
        //}
    } else {
        for (var i = 0; i < this.arr.length; ++i) {
            if (typeof this.arr[i] === 'number'){
                this.sum += this.arr[i];
            } else {
                console.log("数组中有非数字");
            }
        }
    }
    this.length = this.arr.length;
}
YData.prototype = {
    constructor:YData,
    push:function(v) {
        this.arr.push(v);
        this.sum += v;
        this.length++;
    },
    concat:function(arr) {
        this.arr = this.arr.concat(arr);
        return this.arr.concat(arr);
    },
    get:function(id) {
        return this.arr[id] || 0;
    },
    set:function(id,value) {
        this.arr[id] = value;
    },
    //建设期没数据
    ignoreBuild:function(){
        for (var i = 1;i <= this.bYear; ++i) {
            this.push(0);
        }
    },
    getManageArr:function(){
        return this.arr.slice(this.bYear);
    },
    look:function(){
        return this.toString();
    },
    //求和
    updateSum:function(){
        this.sum = eval(this.arr.join("+"));
    },
    toString:function(){
        return this.arr.toString();
    },
    //valueOf:function(){
    //    return this.arr.toString();
    //}
};

module.exports = YData;