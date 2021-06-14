/*
多合一正则:
^https\:\/\/(mi\.gdt\.qq\.com\/gdt_mview\.fcg|mobads\.baidu\.com\/cpro\/ui\/mads\.php|api\.zhihu\.com\/commercial_api\/real_time_launch_v2|magev6\.if\.qidian\.com\/argus\/api\/v4\/client\/getsplashscreen)
贴吧正则 
^https\:\/\/(mi\.gdt\.qq\.com\/gdt_mview\.fcg|mobads\.baidu\.com\/cpro\/ui\/mads\.php)
知乎正则
^https\:\/\/api\.zhihu\.com\/commercial_api\/real_time_launch_v2
起点正则
^https\:\/\/magev6\.if\.qidian\.com\/argus\/api\/v4\/client\/getsplashscreen
*/

let url = $request.url;
let body;
let notifiTitle = "去广告脚本错误";

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
        bodybody.Data.List = null;
    }
    body = JSON.stringify(body);
} else {
    console.log("去广告脚本匹配路径:error");
}

console.log("修改后body:" + body);
$done({
    body
});
