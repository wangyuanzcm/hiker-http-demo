## 环境搭建：

html文件服务器为pure，js等资源文件和接口等server使用nodemon开启  

js资源使用的是es6的语法，所以需要使用webpack+babel进行打包（babel把es6语法编译成commonjs语法，  webpack内部实现来一个loader来实现require加载）  
## 运行流程：
    `npm install`
    `npm start`

## 复习知识内容：

1. 网络缓存机制
    强制缓存和协商缓存,这部分内容在`libs/static.js`里面
2. cookie的使用（和session，但是session一般用来做身份验证，考察的不多）
    非跨域携带cookie打开`http://localhost:8080/`，但是携带cookie跨域并没有实验成功
    session暂缺
3. 跨域问题及解决方案，包括jsonp和cors
    跨域主要指的是接口的跨域，页面里面的资源文件的请求是不存在跨域的
    简单请求和复杂请求。CORS设置的响应头
4. http1.1和http2的区别（待完成）

5. https加密原理（待完成）



6. 动态polyfil（待完成）
直接在网站配置生成需要的prolyfil：https://polyfill.io/v3/url-builder/