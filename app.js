/**
 * Created by wangWei on 2016/6/21.
 */
var http = require('http'),
    fs = require('fs'),
    url = require('url'),
    querystring = require('querystring'),
    Util = require('./util'),
    PORT = 3000;
var staticFiles = {};
var SuffixMap = {
    'css': 'text/css',
    'js': 'application/javascript',
    'png': 'image/png',
    'jpg': 'image/jpeg',
    'gif': 'image/gif'
}
http.createServer(function (req, res) {

    if (req.url !== '/favicon.ico') {
        var Url = url.parse(req.url)
        var path = Url.pathname.substring(1);
        console.log(path);
        fs.readFile(path, 'utf-8', function (err, data) {
            if (err) {
                console.log(err)
                res.writeHead(404, {'Content-Type': 'text/plain'});
                res.end();
            } else {
                var contenttype = Util.checkSuffix(SuffixMap, path),
                    expires=new Date();
                expires.setTime(expires.getTime()+1000*60*60*24*360);
                res.setHeader('Expires',expires.toUTCString());
                res.setHeader("Cache-Control", "max-age=" + 60*60*24*360);
                res.writeHead(200, {'Content-Type': contenttype + ";charset=UTF-8"});
                res.end(data);
            }

        })
    }


}).listen(PORT);