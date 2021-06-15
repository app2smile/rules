/*

注意:
1.vgtime开屏广告需要全新app没有缓存才可以,否则及时接口返回null,app也会加载之前的缓存

多合一正则:
^(https|http)\:\/\/(api-access\.pangolin-sdk-toutiao\.com\/api\/ad\/union\/sdk\/get_ads|afd\.baidu\.com\/afd\/entry|api\.zhihu\.com\/commercial_api\/real_time_launch_v2|magev6\.if\.qidian\.com\/argus\/api\/v4\/client\/getsplashscreen|app02\.vgtime\.com\:8080\/vgtime-app\/api\/v2\/init\/ad\.json)
贴吧正则 
^https\:\/\/afd\.baidu\.com\/afd\/entry
知乎正则
^https\:\/\/api\.zhihu\.com\/commercial_api\/real_time_launch_v2
起点正则
^https\:\/\/magev6\.if\.qidian\.com\/argus\/api\/v4\/client\/getsplashscreen
穿山甲正则(如vgtime调用了)
^https\:\/\/api-access\.pangolin-sdk-toutiao\.com\/api\/ad\/union\/sdk\/get_ads
vgtime正则
^http\:\/\/app02\.vgtime\.com\:8080\/vgtime-app\/api\/v2\/init\/ad\.json
*/

let url = $request.url;
let body;
let notifiTitle = "去广告脚本错误";

if (url.indexOf("afd.baidu.com/afd/entry") != -1 && $request.method == "GET") {
    //console.log('贴吧-进入afd');
    body = JSON.parse($response.body);
    if (body.res == undefined || body.res.splash == undefined) {
        console.log("贴吧afd-body:" + body);
        $notification.post(notifiTitle, "贴吧-afd", "res-splash字段为undefined");
    } else {
        //body.res.ad = [];
        body.res.splash = null;
    }
    body = JSON.stringify(body);
} else if (url.indexOf("api.zhihu.com/commercial_api/real_time_launch_v2") != -1) {
    //console.log('进入知乎');
    body = JSON.parse($response.body);
    let launch;
    if (body.launch == undefined) {
        console.log("知乎body:" + body);
        $notification.post(notifiTitle, "知乎", "launch字段为undefined");
    } else {
        launch = JSON.parse(body.launch);
    }
    if (launch.ads == undefined) {
        $notification.post(notifiTitle, "知乎", "launch-ads字段为undefined");
    } else {
        launch.ads = [];
    }
    body.launch = JSON.stringify(launch);
    body = JSON.stringify(body);
} else if (url.indexOf("magev6.if.qidian.com/argus/api/v4/client/getsplashscreen") != -1) {
    //console.log('进入起点');
    body = JSON.parse($response.body);
    if (body.Data == undefined || body.Data.List == undefined) {
        console.log("起点body:" + body);
        $notification.post(notifiTitle, "起点", "Data/List字段为undefined");
    } else {
        body.Data.List = null;
    }
    body = JSON.stringify(body);
} else if (url.indexOf("api-access.pangolin-sdk-toutiao.com/api/ad/union/sdk/get_ads") != -1) {
    //console.log('进入穿山甲');
    body = JSON.parse($response.body);
    if (body.message == undefined) {
        console.log("穿山甲body:" + body);
        $notification.post(notifiTitle, "穿山甲", "message字段为undefined");
    } else {
        body.message = null;
    }
    body = JSON.stringify(body);
} else if (url.indexOf("app02.vgtime.com:8080/vgtime-app/api/v2/init/ad.json") != -1) {
    //console.log('进入vgtime');
    body = JSON.parse($response.body);
    if (body.data == undefined || body.data.ad == undefined) {
        console.log("vgtime-body:" + body);
        $notification.post(notifiTitle, "vgtime", "data/ad字段为undefined");
    } else {
        body.data.ad = null;
    }
    body = JSON.stringify(body);
} else {
    $notification.post(notifiTitle, "路径匹配错误", url);
}

$done({
    body
});
