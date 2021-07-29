export const jsonp = ({url,params,callback}) =>{
    const generateUrl =()=>{
        let dataStr = Object.keys(params).reduce((pre,cur)=>{
            return pre+`${cur}=${params[cur]}&`;
        },`${url}?`);
        return dataStr+`callback=${callback}`
    }
    return new Promise((resolve,reject) =>{
         callback = callback||Math.random().toString().replace(',','');
         let scriptEle = document.createElement('script');
         scriptEle.src = generateUrl(url,params,callback);
         document.body.appendChild(scriptEle);
         window[callback] = (data) =>{
             resolve(data);
             document.body.removeChild(scriptEle);
             delete window[callback];
         }
    })
};

