/*
* 贴吧请求重写surge request脚本
* 脚本正则: ^http\:\/\/c\.tieba\.baidu\.com\/c\/f\/((frs|pb)\/page|excellent\/personalized)
* */

// 若自己部署的项目访问路径为 192.168.1.10:8052/tieba
// 那么serverUrl填写192.168.1.10:8052
let serverUrl = "自己的服务器ip:端口";
let url = $request.url;
let method = $request.method;

let notifiTitle = "贴吧去广告脚本错误";
let postMethod = "POST";


if (url.indexOf("frs/page") != -1 && method == postMethod) {
    console.log('贴吧-FrsPage');
} else if (url.indexOf("pb/page") != -1 && method == postMethod) {
    console.log('贴吧-PbPage');
} else if (url.indexOf("excellent/personalized") != -1 && method == postMethod) {
    console.log('贴吧-personalized');
} else {
    $notification.post(notifiTitle, "路径/请求方法匹配错误:", method + "," + url);
}
url = url.replace("c.tieba.baidu.com", serverUrl);

$done({
    url
});