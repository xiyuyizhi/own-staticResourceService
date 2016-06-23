/**
 * Created by wangWei on 2016/6/21.
 */
var http = require('http'),
    fs = require('fs'),
    url = require('url'),
    zlib = require('zlib'),
    Util = require('./util'),
    Config = require('./config');
var resourceStore = {};
http.createServer(function (req, res) {

    if (req.url !== '/favicon.ico') {
        var Url = url.parse(req.url),
            path = Url.pathname.substring(1),
           contenttype = Util.checkSuffix(path);
        fs.exists(path, function (exists) {
            if (!exists) {
                res.writeHead(404, {'Content-Type': 'text/html;charset=UTF-8'});
                res.write('<h1>No Found</h1><p>请求的url找不到</p>')
                res.end();
                return;
            }

            //对 css,js,图片文件进行缓存处理
            if(Config.fileMatch.test(path)){
                //读取文件信息
                fs.stat(path, function (err, stat) {
                    if (err) {
                        res.writeHead(500, {'Content-Type': 'text/plain'});
                        res.end(err);
                        return;
                    }
                    var lastModified = stat.mtime.toUTCString(),//文件最后修改时间
                        lastModifiedTime = new Date(lastModified).getTime(),//转为毫秒
                        ifModifiedSince = req.headers['if-modified-since'],
                        ifModifiedSinceTime = new Date(ifModifiedSince).getTime(),
                        expires = new Date();
                    expires.setTime(expires.getTime() + 1000 * Config.EXPIRES);//设置文件的缓存过期时间为一年
                    res.setHeader('Expires', expires.toUTCString());
                    res.setHeader("Cache-Control", "max-age=" + Config.EXPIRES);
                    res.setHeader('Last-Modified', lastModified);
                    res.setHeader('Content-Type', contenttype || 'text/plain' + ";charset=UTF-8");
                    res.setHeader('server', 'node');

                    if (ifModifiedSince && (lastModifiedTime <= ifModifiedSinceTime)) {
                        //expires时间已过，但文件一直都没有修改，则还可以接着使用缓存中的文件
                        res.statusCode = 304;
                        res.end();
                        return;
                    } else {
                        var rs;
                        resourceStore[path] = resourceStore[path] || fs.createReadStream(path);
                        rs = resourceStore[path];
                        if (/gzip/.test(req.headers['accept-encoding'])) {
                            //开启gzip压缩
                            res.writeHead(200, {'Content-Encoding': 'gzip'});
                            rs.pipe(zlib.createGzip()).pipe(res);
                        } else {
                            rs.pipe(res);
                        }
                    }

                })
            }
            else{
                fs.readFile(path,'utf-8',function(err,data){
                    if(err){
                        res.writeHead(500,{'Content-Type':'text/plain'})
                        res.write(err);
                        res.end();
                        return;
                    }else{
                        console.log(path)
                        res.writeHead(200,{'Content-Type':contenttype||'text/plain'})
                        res.end(data);
                    }
                })
            }

        });
    }


}).listen(Config.PORT);