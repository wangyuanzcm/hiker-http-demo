var fs = require('fs');
var path = require('path');
var etag = require('etag');//第三方库，用来生成文件的ETag
var mimeLists = require('./mimeTypes').types;//config中放置允许的文件后缀类型

/**
 * no-cache代表强制缓存无效
 * no-store代表不使用缓存
 * max-age代表强制缓存设置的文件有效期,值为: `"max-age=${expires}`
 */
let cacheControl = 'no-cache'
let maxAge =60*60*24*365

var expires = new Date();
expires.setTime(expires.getTime() + maxAge * 1000);//设置文件过期时间点
function staticFilter(req,res,pathName) {
    console.log(pathName,'pathName')
    var suffix = path.extname(pathName).slice(1);//获取文件后缀
    var contentType = mimeLists[suffix];//根据文件类型设置对应的content-type
    var resourcePath = path.join(__dirname, '../dist' + pathName);//获取文件绝对路径
    fs.readFile(resourcePath, function (err, resource) {
        if (err) {
            res.writeHead(500, { 'content-type': 'text/plain' });
            res.end();
            return;
        }
        var stat = fs.statSync(resourcePath);//获取文件修改信息
        var lastModified = stat.mtime.toUTCString();//协商缓存到last-modified字段是在服务端获取的文件修改时间
        let ETag = etag(resource);
        /**
         * 如果使用no-store应存储有关客户端请求或服务器响应的任何内容，即不使用任何缓存
         * 如果想跳过强制缓存阶段，cache-control必须设置为no-cache，否则必须等强制缓存失效,
         * 强制缓存不会经过服务器，只要生效，直接在浏览器返回200，from disk/memory cache
         */
        if (cacheControl !== 'no-store' && req.headers['if-none-match'] && req.headers['if-none-match'] === ETag) {
            logger.info('协商缓存，判断是否是使用了ETag');
            //获取浏览器传过来的上次所获取的文件的修改时间.每次接受到请求,比较与之前文件的修改时间
            res.writeHead(304, 'Not Modified');//last-modified协商缓存生效，返回304
            res.end();
            return;
        }
        //ETag的优先级比last-modified高，所以在比较ETag相同之后直接返回
        if (cacheControl !== 'no-store' && req.headers['if-modified-since'] && req.headers['if-modified-since'] === lastModified) {
            //获取浏览器传过来的上次所获取的文件的修改时间.每次接受到请求,比较与之前文件的修改时间
            logger.info('协商缓存，判断是否使用了last-modified')
            res.writeHead(304, 'Not Modified');//last-modified协商缓存生效，返回304
            res.end();
            return;
        }

        logger.info("当前使用的强缓存字段cache-control值：", cacheControl)
        res.writeHead(200, {
            'content-type': contentType,
            "Expires": expires.toUTCString(),//强制缓存，设置expires过期时间
            "cache-control": cacheControl,//no-cache代表强制缓存无效
            "last-modified": lastModified,//设置协商缓存响应头last-modified,
            "ETag": ETag//设置协商缓存的响应头ETag
        });
        res.write(resource, 'binary');
        res.end();
        return;
    })
}

exports.staticFilter = staticFilter;