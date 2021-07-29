import { jsonp } from "./utils/request.js";
import axios from "axios";
//jsonp请求跨域
jsonp({
    url: "http://localhost:8080/api/jsonp", params: {
        name: 'test'
    }, callback: "jsonp"
}).then(data => {
    console.log(data,'jsonp-data');
});

//简单请求
axios('http://localhost:8080/api/cors',{
    headers:{
        'content-type': 'application/x-www-form-urlencoded'
    },
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    data: {
        'user':'wangyuan'
    },
}).then((response) => {
    console.log(response.data);
});

//非简单请求,可以清楚看到多了一个options请求
axios('http://localhost:8080/api/cors',{
    headers:{
        'content-type': 'application/json'
    },
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    data: {
        'user':'wangyuan'
    },
}).then((response) => {
    console.log(response.data);
});
//携带cookie的请求
axios('http://localhost:8080/api/cookie',{
    headers:{
        'content-type': 'application/x-www-form-urlencoded',
        'withCredentials':true//跨域携带cookie，前端必须设置withCredentials
    },
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    data: {
        'user':'wangyuan'
    },
}).then((response) => {
    console.log(response.data);
});