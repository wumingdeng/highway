/**
 * Created by Fizzo on 16/9/1.
 */
var ztz = 0 //总投资
var jttz = 0 //静态投资
var dk = []
var lx = []
var lx1 = 0
var lx2 = 0
var lx3 = 0
var lx4 = 0
var dksum = 0
var lxsum = 0
var sjdkbl = 0 //实际贷款比例
var xydkje = 0 //需要贷款金额
var zyzjsum = 0 //自有资金 = 项目资本金
var zbj = 0 //资本金

var zyzij = [] //
var blbzcddk = 0 // 部里补助冲抵贷款 BBZ-zbj

//input staticData
var DKBL = 0.8 //贷款比例
var BBZ = 263475.06 //部补助
var ZTZ = 936754
var GNDKLX = 31736
var JSTZ = [0,0.3,0.4,0.3]
var GNDKLX = 31736
var DKTRB = [0,0.3,0.4,0.3]
var ZYZJ = 0.2
var GNLL = 0.049*1 //国内利率
var DF = 0 //地方
var TZ = 1//
var BUILD_YEAR = 4 //建设期
var calculatedNum = 0

var ddd = 0
function onCalculate(ztz){
    for(var by =0;by<BUILD_YEAR;by++){
        var tempZyz = ZYZJ * ztz * JSTZ[by]
        zyzjsum = zyzjsum + tempZyz
        zyzij[by] = (tempZyz)

    }
    zbj = DF*zyzjsum
    blbzcddk = BBZ - zbj
    sjdkbl = ztz * DKBL - blbzcddk //实际贷款比例 ＝ 需贷款金额

    for(var by =0;by<BUILD_YEAR;by++){
        var tempDk = sjdkbl * DKTRB[by]
        dksum = dksum + tempDk
        dk[by] = tempDk
        // var tempPlus = 0
        // var time = 0
        // while(time < by){
        //     tempPlus = tempPlus + dk[time]
        //     time++
        // }
        // var tempLx = (tempPlus+tempDk/2)*GNLL
        // lxsum = lxsum + tempLx
        //
        // lx[by] = tempLx
    }
    lx1 = (dk[0]/2)*GNLL
    lx2 = (dk[0]+dk[1]/2)*GNLL
    lx3 = (dk[0]+dk[1]+dk[2]/2)*GNLL
    lx4 = (dk[0]+dk[1]+dk[2]+dk[3]/2)*GNLL
    lxsum = lx1 + lx2 + lx3 + lx4
    console.log(lxsum)
    jttz = TZ*(ZTZ-GNDKLX)
    ztz = jttz + lxsum
    // if(calculatedNum == ddd){
    if(calculatedNum == ztz){
        console.log(ztz)
        return
    }
    // calculatedNum++
    calculatedNum = ztz
    onCalculate(ztz)
}
onCalculate(0)
