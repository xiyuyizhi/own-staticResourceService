/**
 * Created by Administrator on 2016/6/22.
 */

var util={};
util.checkSuffix=function(MAP,path){
   var arr=path.split('.'),
       suffix=arr[arr.length-1];
    return MAP[suffix];
}

module.exports=util;