/**
 * Created by wangWei on 2016/6/21.
 */
var http = require('http'),
    fs = require('fs'),
    url = require('url'),
    zlib=require('zlib'),
    Util = require('./util'),
    Config=require('./config');
var staticFiles = {};
http.createServer(function (req, res) {

    if (req.url !== '/favicon.ico') {
        var Url = url.parse(req.url)
        var path = Url.pathname.substring(1);
        fs.exists(path, function (exists) {
            if (!exists) {
                res.writeHead(404, {'Content-Type': 'text/plain'});
                res.end();
            }
            fs.stat(path, function (err, stat) {
                if (err) {
                    res.writeHead(500, {'Content-Type': 'text/plain'});
                    res.end(err);
                }
                var lastModified = stat.mtime.toUTCString(),//文件最后修改时间
                    lastModifiedTime = new Date(lastModified).getTime(),//转为毫秒
                    ifModifiedSince = req.headers['if-modified-since'],
                    ifModifiedSinceTime = new Date(ifModifiedSince).getTime(),
                    contenttype = Util.checkSuffix(path),
                    expires = new Date();
                expires.setTime(expires.getTime() + 1000 * Config.EXPIRES);
                res.setHeader('Last-Modified', lastModified);
                res.setHeader('Expires', expires.toUTCString());
                res.setHeader("Cache-Control", "max-age=" + Config.EXPIRES);
                res.setHeader('Content-Type', contenttype + ";charset=UTF-8");
                res.setHeader('server','node');
                if (ifModifiedSince && (lastModifiedTime <= ifModifiedSinceTime)) {
                    console.log('no modify');
                    res.writeHead(304, {'Content-Type': 'text/plain'});
                    res.end();
                }else{
                    var gZip=fs.createReadStream(path);
                    res.writeHead(200, { 'Content-Encoding': 'gzip' });
                    gZip.pipe(zlib.createGzip()).pipe(res);
                }

            })
        });
    }


}).listen(Config.PORT);