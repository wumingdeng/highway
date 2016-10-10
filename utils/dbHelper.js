/**
 * Created by chenzhaowen on 16-9-20.
 */
dbHelper = {}

var db_proxy = require('../utils/dbconnectorS');
dbHelper.update = function(list,data) {
    if (!data) {
        return false;
    }
    if (!data.length) {
        data = [data]
    }
    var db = db_proxy.mongo.collection(list);
    for (var i = 0; i < data.length; ++i) {
        var record = data[i];
        db.updateOne(
            {pn:record.pn,rid:record.rid},
            record,
            {upsert:true},
            function(err,item){
                if (err) {
                    console.log("数据写入失败")
                } else {
                }
            }
        )

    }

};

dbHelper.getData = function(list,start,num,callback) {
    var db = db_proxy.mongo.collection(list);

    db.find(
        function(err,data){
            if (err) {

            } else {

            }
        }
    ).skip(start).limit(num);

}





module.exports = dbHelper