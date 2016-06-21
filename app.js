/**
 * Created by wangWei on 2016/6/21.
 */
var http = require('http'),
    fs = require('fs'),
    url = require('url'),
    querystring=require('querystring'),
    PORT = 3000;

http.createServer(function (req, res) {

    if(req.url!=='/favicon.ico'){
        var Url=url.parse(req.url)
        console.log(Url)
        console.log('pathname='+Url.pathname)
        console.log(querystring.parse(Url.query))
    }

    res.writeHead(200, {'Content-Type': 'text/plain'})
    res.write('ok')
    res.end();
}).listen(PORT);