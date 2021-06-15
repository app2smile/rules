/*
多合一正则:
^https\:\/\/(api-access\.pangolin-sdk-toutiao\.com\/api\/ad\/union\/sdk\/get_ads|mi\.gdt\.qq\.com\/gdt_mview\.fcg|afd\.baidu\.com\/afd\/entry|api\.zhihu\.com\/commercial_api\/real_time_launch_v2|magev6\.if\.qidian\.com\/argus\/api\/v4\/client\/getsplashscreen|news\.ssp\.qq\.com\/app)
贴吧正则 
^https\:\/\/mi\.gdt\.qq\.com\/gdt_mview\.fcg
^https\:\/\/afd\.baidu\.com\/afd\/entry
知乎正则
^https\:\/\/api\.zhihu\.com\/commercial_api\/real_time_launch_v2
起点正则
^https\:\/\/magev6\.if\.qidian\.com\/argus\/api\/v4\/client\/getsplashscreen
穿山甲正则
^https\:\/\/api-access\.pangolin-sdk-toutiao\.com\/api\/ad\/union\/sdk\/get_ads
腾讯新闻正则
^https\:\/\/news\.ssp\.qq\.com\/app
*/

let url = $request.url;
let body;
let notifiTitle = "去广告脚本错误";
console.log("请求method:" + $request.method);

//console.log("url:" + url);
if (url.indexOf("mi.gdt.qq.com/gdt_mview.fcg") != -1) {
    //console.log('贴吧-进入qq');
    body = JSON.parse($response.body);
    if (body.data == undefined) {
        console.log("贴吧qq-body:" + body);
        $notification.post(notifiTitle, "贴吧-qq", "data字段为undefined");
    } else {
        body.data = null;
    }
    body = JSON.stringify(body);
} else if (url.indexOf("afd.baidu.com/afd/entry") != -1) {
    console.log('贴吧-进入afd');
    body = JSON.parse($response.body);
    if (body.res == undefined || body.res.ad == undefined) {
        console.log("贴吧afd-body:" + body);
        $notification.post(notifiTitle, "贴吧-afd", "res-ad字段为undefined");
    } else {
        body.res.ad = null;
    }
    body = JSON.stringify(body);
} else if (url.indexOf("api.zhihu.com/commercial_api/real_time_launch_v2") != -1) {
    //console.log('进入zhihu');
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
        //launch['mobile_experiment']['ad_backPlugin'] = "0";
        //launch['mobile_experiment']['ad_bannerShow'] = "0";
        //launch['mobile_experiment']['ad_bannerView'] = "0";
        //launch['mobile_experiment']['ad_ht'] = "0";
        //launch['mobile_experiment']['ad_markPlugin'] = "0";
        //launch['mobile_experiment']['ad_new_rt'] = "0";
        //launch['mobile_experiment']['ad_pausePlugin'] = "0";
        //launch['mobile_experiment']['ad_pre_web'] = "0";
        //launch['mobile_experiment']['ad_resume_ab'] = "0";
        //launch['mobile_experiment']['new_ad_logo'] = "0";
    }

    body = JSON.stringify({
        launch: JSON.stringify(launch)
    });
} else if (url.indexOf("magev6.if.qidian.com/argus/api/v4/client/getsplashscreen") != -1) {
    //console.log('进入qidian');
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
} else if (url.indexOf("news.ssp.qq.com/app") != -1) {
    //console.log('进入腾讯新闻');
    body = JSON.parse($response.body);
    if (body.adList == undefined) {
        console.log("腾讯新闻body:" + body);
        $notification.post(notifiTitle, "腾讯新闻", "adList字段为undefined");
    } else {
        body.adList = null;
    }
    body = JSON.stringify(body);
} else {
    $notification.post(notifiTitle, "路径匹配错误", url);
}

//console.log("修改后body:" + body);
$done({
    body
});
