/**
 * Created by Administrator on 2016/6/22.
 */

var util={};
util.checkSuffix=function(path){
   var arr=path.split('.'),
       suffix=arr[arr.length-1];
    return this.suffixMap[suffix];
}

util.suffixMap={
    'css': 'text/css',
    'js': 'application/javascript',
    'png': 'image/png',
    'jpg': 'image/jpeg',
    'gif': 'image/gif'
}

module.exports=util;