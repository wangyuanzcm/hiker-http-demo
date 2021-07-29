var url = require('url');
var fs = require('fs');
var http = require('http');
var log4js = require('log4js');//第三方库，用来打印日志
var staticFilter = require('./libs/static').staticFilter;
var jsonpFilter = require('./libs/routerFilter').jsonpFilter;
var corsFilter = require('./libs/routerFilter').corsFilter;
var cookieFilter = require('./libs/routerFilter').cookieFilter;

global.logger = log4js.getLogger();//使用log4js把日志输出到命令行
logger.level = 'info';//设置日志级别为info

var server = http.createServer(function (req, res) {
    var pathName = url.parse(req.url).pathname;//获取文件名
    var resourcePath = __dirname + '/views' + pathName;//获取文件绝对路径
    if(pathName === '/'){
        fs.readFile(__dirname + '/public/index.html', function (err, resource) {
            if (err) {
                res.writeHead(500, { 'content-type': 'text/plain' });
                res.end();
                return;
            }
            res.writeHead(200, { 'content-type': 'text/html' });
            res.write(resource, 'binary');
            res.end();
        });
        return;
    }
    // 对请求进行拦截，判断是接口请求还是资源文件的请求
    if (fs.existsSync(resourcePath)) {    //判断文件路径是否存在，在新版本中exist这个api已经被弃用，但是作为演示不考虑性能问题
        staticFilter(req, res, pathName);
        return;
    }
    logger.info(pathName, 'pathName');
    if (pathName.startsWith('/api/jsonp')) {
        jsonpFilter(req, res, pathName);
        return;
    }
    if (pathName.startsWith('/api/cors')) {
        corsFilter(req, res, pathName);
        return;
    }
    if (pathName.startsWith('/api/cookie')) {
        cookieFilter(req, res, pathName);
        return;
    }
    //兜底处理
    res.writeHead(404, { 'content-type': 'text/plain' });
    res.write('not found');
    res.end();
})
server.listen(8080, function () {
    logger.info('listening on 8080');
})