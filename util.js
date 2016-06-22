/**
 * Created by Administrator on 2016/6/22.
 */

var util={};
util.checkSuffix=function(MAP,path){
   var arr=path.split('.'),
       suffix=arr[arr.length-1];
    console.log(suffix);
    return MAP[suffix];
}

module.exports=util;