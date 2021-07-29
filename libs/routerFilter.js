var url = require('url');
//处理jsonp后台响应
function jsonpFilter(req, res, pathName) {
    var query = url.parse(req.url).query;//获取文件名
    let params = query.split('&').reduce((pre, cur) => {
        let temp = cur.split('=');
        return { ...pre, [temp[0]]: temp[1] }
    }, {});
    //服务端将返回数据做为参数传入回调函数，由于script请求的js会直接执行，所以不需要json.parse，前端在window上
    // 挂载的同名函数上即可获取到返回数据
    let result = `{user:'wangyuan'}`;
    res.writeHead(200, { 'content-type': 'text/plain' });
    res.write(`${params.callback}(` + result + `)`);
    res.end();
}
// 处理cors后台响应
function corsFilter(req, res, pathName) {
    var post = '';
    //监听数据的传输
    req.on('data', function (chunk) {
        post += chunk;
    })
    //绑定数据完成的回调
    req.on('end', function () {
        res.writeHead(200, {
            "Access-Control-Allow-Origin": "http://localhost:8000",//设置允许跨域请求的网址，不能省略
            "Access-Control-Allow-Headers": "Content-type",//允许跨域的header，不能省略
            "Access-Control-Allow-Methods": "PUT,POST,GET,DELETE,OPTIONS,PATCH",//可以省略
            "Access-Control-Max-Age": 1000,//可以省略，预检信息有效时间
            'content-type': 'text/plain',
        });
        res.write(post);
        res.end();
    })

}
//跨域无法将cookie携带到本地
function cookieFilter(req, res, pathName) {
    let data = req.headers.cookie ? req.headers.cookie : '请求头中没有cookie'
    //setCookie可以设置多个cookie，但是每个cookie必须用逗号加空格分离开
    // res.setHeader('Set-Cookie', `Domain:http://localhost:8000, Path:/, HttpOnly, Expires=${new Date(Date.now() + 1000 * 10).toGMTString()}, max-age=10, SameSite:None, address=${encodeURIComponent("回龙观")}`);
    res.setHeader('Set-Cookie', [
        "Domain:.localhost",
        "Path:/",
        "HttpOnly",
        `Expires=${new Date(Date.now() + 1000 * 10).toGMTString()}`,
        `max-age=10`,
        "SameSite:None",
        `address=${encodeURIComponent("回龙观")} `
    ].join(', '));
    res.writeHead(200, {
        "Access-Control-Allow-Origin": "http://localhost:8000",//设置允许跨域请求的网址，不能省略
        "Access-Control-Allow-Headers": "Content-type,withCredentials",//允许跨域的header，不能省略
        "Access-Control-Allow-Methods": "PUT,POST,GET,DELETE,OPTIONS,PATCH",//可以省略
        "Access-Control-Allow-Credentials": true,
        'content-type': 'text/plain',
    });
    res.write(data);
    res.end();

}
exports.jsonpFilter = jsonpFilter;
exports.corsFilter = corsFilter;
exports.cookieFilter = cookieFilter;