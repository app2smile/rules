/*

去广告surge脚本

多合一正则:
^(https|http)\:\/\/(api-access\.pangolin-sdk-toutiao\.com\/api\/ad\/union\/sdk\/get_ads|afd\.baidu\.com\/afd\/entry|api\.zhihu\.com\/(topstory\/recommend|commercial_api\/(real_time_launch_v2|launch_v2)|v4\/questions\/[0-9]+\/answers)|magev6\.if\.qidian\.com\/argus\/api\/(v4\/client\/getsplashscreen|v2\/deeplink\/geturl|v1\/(client\/getconf|adv\/getadvlistbatch\?positions=iOS_tab))|app02\.vgtime\.com\:8080\/vgtime-app\/api\/v2\/init\/ad\.json|news\.ssp\.qq\.com\/app|r\.inews\.qq\.com\/(getQQNewsUnreadList|getQQNewsSpecialListItemsV2|getTopicSelectList))
贴吧开屏页正则 
^https\:\/\/afd\.baidu\.com\/afd\/entry
知乎开屏页正则
^https\:\/\/api\.zhihu\.com\/commercial_api\/real_time_launch_v2
知乎推荐列表正则
^https\:\/\/api\.zhihu\.com\/topstory\/recommend
知乎launch_v2
^https\:\/\/api\.zhihu\.com\/commercial_api\/launch_v2
知乎问题回答列表广告
^https\:\/\/api\.zhihu\.com\/v4\/questions\/[0-9]+\/answers
起点开屏页正则
^https\:\/\/magev6\.if\.qidian\.com\/argus\/api\/v4\/client\/getsplashscreen
起点强制跳转精选页面修改为不跳转
^https\:\/\/magev6\.if\.qidian\.com\/argus\/api\/v2\/deeplink\/geturl
起点客户端getconf
^https\:\/\/magev6\.if\.qidian\.com\/argus\/api\/v1\/client\/getconf
起点去除下方(精选 发现 中间的)活动tab
^https\:\/\/magev6\.if\.qidian\.com\/argus\/api\/v1\/adv\/getadvlistbatch\?positions=iOS_tab
穿山甲正则(如vgtime调用了)
^https\:\/\/api-access\.pangolin-sdk-toutiao\.com\/api\/ad\/union\/sdk\/get_ads
vgtime开屏页正则
^http\:\/\/app02\.vgtime\.com\:8080\/vgtime-app\/api\/v2\/init\/ad\.json
腾讯新闻开屏页正则
^https\:\/\/news\.ssp\.qq\.com\/app
腾讯新闻新闻列表正则
^https\:\/\/r\.inews\.qq\.com\/getQQNewsUnreadList
腾讯新闻专题新闻列表正则
^https\:\/\/r\.inews\.qq\.com\/getQQNewsSpecialListItemsV2
腾讯新闻话题新闻列表正则
^https\:\/\/r\.inews\.qq\.com\/getTopicSelectList
*/

let url = $request.url;
let method = $request.method;
let body = JSON.parse($response.body);

let notifiTitle = "去广告脚本错误";
let getMethod = "GET";
let postMethod = "POST";

if (url.indexOf("afd.baidu.com/afd/entry") != -1 && method == getMethod) {
    console.log('贴吧-afd');
    if (body.res == undefined || body.res.splash == undefined) {
        console.log("body:" + $response.body);
        $notification.post(notifiTitle, "贴吧-afd", "res-splash字段为undefined");
    } else {
        //body.res.ad = [];
        body.res.splash = null;
        console.log('成功');
    }
} else if (url.indexOf("api.zhihu.com/commercial_api/real_time_launch_v2") != -1 && method == getMethod) {
    zhihuAds(body, '知乎-开屏页');
} else if (url.indexOf("api.zhihu.com/topstory/recommend") != -1 && method == getMethod) {
    console.log('知乎-推荐列表');
    let dataArr = body.data;
    if (dataArr == undefined) {
        console.log("body:" + $response.body);
        $notification.post(notifiTitle, "知乎推荐", "data字段为undefined");
    } else {
        body.data = dataArr.filter(item => item.type != 'feed_advert');
        if (body.data.length == dataArr.length) {
            console.log('列表数据无广告');
        } else {
            console.log('成功');
        }
    }
} else if (url.indexOf("api.zhihu.com/commercial_api/launch_v2") != -1 && method == getMethod) {
    zhihuAds(body, '知乎-launch_v2');
} else if (url.indexOf("api.zhihu.com/v4/questions") != -1 && method == getMethod) {
    console.log('知乎-问题回答列表');
    if (body.ad_info === undefined) {
        // 个别问题回答列表无广告
        console.log("问题回答列表无广告");
    } else {
        body.ad_info = null;
        console.log('成功');
    }
} else if (url.indexOf("magev6.if.qidian.com/argus/api/v4/client/getsplashscreen") != -1 && method == getMethod) {
    console.log('起点-开屏页');
    if (body.Data == undefined || body.Data.List == undefined) {
        console.log("body:" + $response.body);
        $notification.post(notifiTitle, "起点", "Data/List字段为undefined");
    } else {
        body.Data.List = null;
        console.log('成功');
    }
} else if (url.indexOf("magev6.if.qidian.com/argus/api/v2/deeplink/geturl") != -1 && method == getMethod) {
    console.log('起点-不跳转精选');
    if (body.Data == undefined || body.Data.ActionUrl == undefined || body.Data.ActionUrl != 'QDReader://Bookstore') {
        console.log("body:" + $response.body);
        $notification.post(notifiTitle, "起点", "Data/ActionUrl字段为undefined或者不为QDReader://Bookstore");
    } else {
        body.Data = null;
        console.log('成功');
    }
} else if (url.indexOf("magev6.if.qidian.com/argus/api/v1/adv/getadvlistbatch?positions=iOS_tab") != -1 && method == getMethod) {
    console.log('起点-iOS_tab');
    if (body.Data === undefined || body.Data.iOS_tab === undefined) {
        console.log("body:" + $response.body);
        $notification.post(notifiTitle, "起点-iOS_tab", "Data/iOS_tab字段为undefined");
    } else {
        if (body.Data.iOS_tab.length == 0) {
            console.log('返回配置空');
        } else {
            body.Data.iOS_tab = [];
            console.log('成功');
        }
    }
} else if (url.indexOf("magev6.if.qidian.com/argus/api/v1/client/getconf") != -1 && method == postMethod) {
    console.log('起点-client/getconf');
    if (body.Data === undefined) {
        console.log("body:" + $response.body);
        $notification.post(notifiTitle, "起点-client/getconf", "Data字段为undefined");
    } else {
        if (body.Data.ActivityPopup === undefined || body.Data.ActivityPopup.Data == undefined) {
            console.log("body:" + $response.body);
            $notification.post(notifiTitle, "起点-client/getconf", "ActivityPopup/Data字段为undefined");
        } else {
            body.Data.ActivityPopup = null;
            console.log('ActivityPopup(活动弹窗)成功');
        }
        // TODO 待修复
        // if (body.Data.ActivityIcon === undefined || body.Data.ActivityIcon.EndTime === undefined) {
        //     console.log("body:" + $response.body);
        //     $notification.post(notifiTitle, "起点-client/getconf", "ActivityIcon/EndTime字段为undefined");
        // } else {
        //     body.Data.ActivityIcon.StartTime = 2711980800000;
        //     body.Data.ActivityIcon.EndTime = 2712067200000;
        //     body.Data.ActivityIcon.Actionurl = "QDReader://ataru.qidian.com/noah/202107086";
        //     console.log('ActivityIcon(右下角悬浮活动)成功');
        // }
    }
} else if (url.indexOf("api-access.pangolin-sdk-toutiao.com/api/ad/union/sdk") != -1 && method == postMethod) {
    console.log('穿山甲-get_ads');
    if (body.message == undefined) {
        console.log("body:" + $response.body);
        $notification.post(notifiTitle, "穿山甲", "message字段为undefined");
    } else {
        body.message = null;
        console.log('成功');
    }
} else if (url.indexOf("app02.vgtime.com:8080/vgtime-app/api/v2/init/ad.json") != -1 && method == postMethod) {
    console.log('vgtime-开屏页');
    if (body.data == undefined || body.data.ad === undefined) {
        console.log("body:" + $response.body);
        $notification.post(notifiTitle, "vgtime", "data/ad字段为undefined");
    } else {
        body.data.ad = null;
        console.log('成功');
    }
} else if (url.indexOf("news.ssp.qq.com/app") != -1 && method == postMethod) {
    qqNewsAdList(body, '腾讯新闻-开屏页');
} else if (url.indexOf("r.inews.qq.com/getQQNewsUnreadList") != -1 && method == postMethod) {
    qqNewsAdList(body, '腾讯新闻-要闻/财经等');
} else if (url.indexOf("r.inews.qq.com/getQQNewsSpecialListItemsV2") != -1 && method == postMethod) {
    console.log('腾讯新闻-专题新闻列表');
    if (body.adList === undefined) {
        // 部分专题列表无广告,没有adList字段
        console.log("adList字段为undefined");
        //console.log("body:" + $response.body);
        //$notification.post(notifiTitle, "腾讯新闻专题列表", "adList字段为undefined");
    } else {
        body.adList = null;
        console.log('成功');
    }
} else if (url.indexOf("r.inews.qq.com/getTopicSelectList") != -1 && method == postMethod) {
    qqNewsAdList(body, '腾讯新闻-话题新闻列表');
} else {
    $notification.post(notifiTitle, "路径/请求方法匹配错误:", method + "," + url);
}

body = JSON.stringify(body);

$done({
    body
});


/**
 * 处理腾讯新闻广告
 * @param {*} body body
 * @param {*} name 日志名称
 */
function qqNewsAdList(body, name) {
    console.log(name);
    if (body.adList === undefined) {
        console.log("body:" + $response.body);
        $notification.post(notifiTitle, name, "adList字段为undefined");
    } else {
        body.adList = null;
        console.log('成功');
    }
}

/**
 * 处理知乎ads广告
 * @param {*} body body
 * @param {*} name 日志名称
 */
function zhihuAds(body, name) {
    console.log(name);
    let launch;
    if (body.launch == undefined) {
        console.log("body:" + $response.body);
        $notification.post(notifiTitle, name, "launch字段为undefined");
    } else {
        launch = JSON.parse(body.launch);
    }
    if (launch.ads === undefined) {
        // ads字段有时候为空,有时候没有ads字段
        console.log("body:" + $response.body);
        $notification.post(notifiTitle, name, "launch-ads字段为undefined");
    } else {
        launch.ads = [];
        console.log('成功');
    }
    body.launch = JSON.stringify(launch);
}