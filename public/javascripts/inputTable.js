/**
 * Created by Fizzo on 16/9/1.
 */
var ztz = 0 //总投资
var jttz = 0 //静态投资
var dk1 = 0
var dk2 = 0
var dk3 = 0
var dk4 = 0
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

var zyzij1 = 0
var zyzij2 = 0
var zyzij3 = 0 //ZYZJ*ztz*JSTZ3
var zyzij4 = 0
var blbzcddk = 0 // 部里补助冲抵贷款 BBZ-zbj

//input staticData
var DKBL = 0.8 //贷款比例
var BBZ = 263475.06 //部补助
var ZTZ = 100000000
var GNDKLX = 31736
var JSTZ1 = 0
var JSTZ2 = 0.3
var JSTZ3 = 0.4
var JSTZ4 = 0.3
var GNDKLX = 31736
var DKTRB1 = 0
var DKTRB2 = 0.3
var DKTRB3 = 0.4
var DKTRB4 = 0.3
var ZYZJ = 0.2
var GNLL = 0.049*1 //国内利率
var DF = 0 //地方
var TZ = 1//
var calculatedNum = 0

function onCalculate(ztz){
    zyzij1 = ZYZJ * ztz * JSTZ1
    zyzij2 = ZYZJ * ztz * JSTZ2
    zyzij3 = ZYZJ * ztz * JSTZ3
    zyzij4 = ZYZJ * ztz * JSTZ4
    zyzjsum = zyzij1 + zyzij2 + zyzij3 + zyzij4
    zbj = DF*zyzjsum
    blbzcddk = BBZ - zbj
    sjdkbl = ztz * DKBL - blbzcddk //实际贷款比例 ＝ 需贷款金额
    dk1 = sjdkbl * DKTRB1
    dk2 = sjdkbl * DKTRB2
    dk3 = sjdkbl * DKTRB3
    dk4 = sjdkbl * DKTRB4
    dksum = dk1 + dk2 + dk3 + dk4
    lx1 = (dk1/2)*GNLL
    lx2 = (dk1+dk2/2)*GNLL
    lx3 = (dk1+dk2+dk3/2)*GNLL
    lx4 = (dk1+dk2+dk3+dk4/2)*GNLL
    lxsum = lx1 + lx2 + lx3 + lx4
    jttz = TZ*(ZTZ-GNDKLX)
    ztz = jttz + lxsum
    if(calculatedNum == ztz){
        return
    }
    calculatedNum = ztz
    console.log(ztz)
    onCalculate(ztz)
}
onCalculate(0)
