/*

去广告surge脚本

注意:
1.vgtime开屏广告需要全新app没有缓存才可以,否则即使接口返回null,app也会加载之前的缓存

多合一正则:
^(https|http)\:\/\/(api-access\.pangolin-sdk-toutiao\.com\/api\/ad\/union\/sdk\/get_ads|afd\.baidu\.com\/afd\/entry|api\.zhihu\.com\/(topstory\/recommend|commercial_api\/real_time_launch_v2)|magev6\.if\.qidian\.com\/argus\/api\/v4\/client\/getsplashscreen|app02\.vgtime\.com\:8080\/vgtime-app\/api\/v2\/init\/ad\.json)
贴吧正则 
^https\:\/\/afd\.baidu\.com\/afd\/entry
知乎开屏页正则
^https\:\/\/api\.zhihu\.com\/commercial_api\/real_time_launch_v2
知乎推荐列表正则
^https\:\/\/api\.zhihu\.com\/topstory\/recommend
起点正则
^https\:\/\/magev6\.if\.qidian\.com\/argus\/api\/v4\/client\/getsplashscreen
穿山甲正则(如vgtime调用了)
^https\:\/\/api-access\.pangolin-sdk-toutiao\.com\/api\/ad\/union\/sdk\/get_ads
vgtime正则
^http\:\/\/app02\.vgtime\.com\:8080\/vgtime-app\/api\/v2\/init\/ad\.json
*/

let url = $request.url;
let method = $request.method;
let body = JSON.parse($response.body);

let notifiTitle = "去广告脚本错误";
let getMethod = "GET";
let postMethod = "POST";

if (url.indexOf("afd.baidu.com/afd/entry") != -1 && method == getMethod) {
    console.log('贴吧afd去广告');
    if (body.res == undefined || body.res.splash == undefined) {
        console.log("贴吧afd-body:" + $response.body);
        $notification.post(notifiTitle, "贴吧-afd", "res-splash字段为undefined");
    } else {
        //body.res.ad = [];
        body.res.splash = null;
        console.log('成功');
    }
} else if (url.indexOf("api.zhihu.com/commercial_api/real_time_launch_v2") != -1 && method == getMethod) {
    console.log('知乎开屏页去广告');
    let launch;
    if (body.launch == undefined) {
        console.log("知乎开屏页body:" + $response.body);
        $notification.post(notifiTitle, "知乎", "launch字段为undefined");
    } else {
        launch = JSON.parse(body.launch);
    }
    if (launch.ads == undefined) {
        $notification.post(notifiTitle, "知乎", "launch-ads字段为undefined");
    } else {
        launch.ads = [];
        console.log('成功');
    }
    body.launch = JSON.stringify(launch);
} else if (url.indexOf("api.zhihu.com/topstory/recommend") != -1 && method == getMethod) {
    console.log('知乎推荐列表去广告');
    let dataArr = body.data;
    if (dataArr == undefined) {
        console.log("知乎推荐body:" + $response.body);
        $notification.post(notifiTitle, "知乎推荐", "data字段为undefined");
    } else {
        body.data = dataArr.filter(item => item.type != 'feed_advert');
        console.log('成功');
    }
} else if (url.indexOf("magev6.if.qidian.com/argus/api/v4/client/getsplashscreen") != -1 && method == getMethod) {
    console.log('起点开屏页去广告');
    if (body.Data == undefined || body.Data.List == undefined) {
        console.log("起点body:" + $response.body);
        $notification.post(notifiTitle, "起点", "Data/List字段为undefined");
    } else {
        body.Data.List = null;
        console.log('成功');
    }
} else if (url.indexOf("api-access.pangolin-sdk-toutiao.com/api/ad/union/sdk/get_ads") != -1 && method == postMethod) {
    console.log('穿山甲get_ads去广告');
    if (body.message == undefined) {
        console.log("穿山甲body:" + $response.body);
        $notification.post(notifiTitle, "穿山甲", "message字段为undefined");
    } else {
        body.message = null;
        console.log('成功');
    }
} else if (url.indexOf("app02.vgtime.com:8080/vgtime-app/api/v2/init/ad.json") != -1 && method == postMethod) {
    console.log('vgtime开屏页去广告');
    if (body.data == undefined || body.data.ad === undefined) {
        console.log("vgtime-body:" + $response.body);
        $notification.post(notifiTitle, "vgtime", "data/ad字段为undefined");
    } else {
        body.data.ad = null;
        console.log('成功');
    }
} else {
    $notification.post(notifiTitle, "路径/请求方法匹配错误:", method + "," + url);
}

body = JSON.stringify(body);

$done({
    body
});

