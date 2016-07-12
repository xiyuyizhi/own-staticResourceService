/**
 * Created by Administrator on 2016/6/22.
 */
var path=require('path'),
    util={};
util.checkSuffix=function(pathname){
   var suffix=path.extname(pathname);
    return this.mimes[suffix.substring(1)];
}
util.setHead=function(res,statusCode,contentType){
    res.writeHead(statusCode,{'Content-Type':contentType});
}
util.mimes={
    'css': 'text/css',
    'js': 'application/javascript',
    'png': 'image/png',
    'jpg': 'image/jpeg',
    'gif': 'image/gif',
    "ico": "image/x-icon",
    "json": "application/json",
    "pdf": "application/pdf",
    "txt": "text/plain",
    "woff":"application/font-woff",
    "ttf":"truetype",
    "eot":"application/vnd.ms-fontobject"
};
module.exports=util;