/*

去广告surge脚本

多合一正则:
^(https\:\/\/(api-access\.pangolin-sdk-toutiao\.com\/api\/ad\/union\/sdk\/get_ads|www\.zhihu\.com\/api\/v4\/answers\/\d+\/recommendations|api\.zhihu\.com\/(topstory\/recommend|commercial_api\/real_time_launch_v2|v4\/questions\/\d+\/answers)|magev6\.if\.qidian\.com\/argus\/api\/(v4\/client\/getsplashscreen|v2\/deeplink\/geturl|v1\/(client\/getconf|adv\/getadvlistbatch\?positions=iOS_tab|popup\/getlist))|news\.ssp\.qq\.com\/app|r\.inews\.qq\.com\/(getQQNewsUnreadList|getQQNewsSpecialListItemsV2|getTopicSelectList)|app\.bilibili\.com\/x\/v2\/splash\/list|us\.l\.qq\.com\/exapp)|http\:\/\/app02\.vgtime\.com\:8080\/vgtime-app\/api\/v2\/init\/ad\.json)
知乎开屏页正则
^https\:\/\/api\.zhihu\.com\/commercial_api\/real_time_launch_v2
知乎推荐列表正则
^https\:\/\/api\.zhihu\.com\/topstory\/recommend
知乎问题回答列表广告
^https\:\/\/api\.zhihu\.com\/v4\/questions\/\d+\/answers
知乎回答下的广告
^https\:\/\/www\.zhihu\.com\/api\/v4\/answers\/\d+\/recommendations
起点开屏页正则
^https\:\/\/magev6\.if\.qidian\.com\/argus\/api\/v4\/client\/getsplashscreen
起点强制跳转精选页面修改为不跳转
^https\:\/\/magev6\.if\.qidian\.com\/argus\/api\/v2\/deeplink\/geturl
起点客户端getconf
^https\:\/\/magev6\.if\.qidian\.com\/argus\/api\/v1\/client\/getconf
起点一本书最新章节看完之后的页面弹窗
^https\:\/\/magev6\.if\.qidian\.com\/argus\/api\/v1\/popup\/getlist
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
哔哩哔哩bilibili开屏广告
^https\:\/\/app\.bilibili\.com\/x\/v2\/splash\/list
QQ音乐开屏广告
^https\:\/\/us\.l\.qq\.com\/exapp
*/

let url = $request.url;
let method = $request.method;
let body = JSON.parse($response.body);

let notifiTitle = "去广告脚本错误";
let getMethod = "GET";
let postMethod = "POST";

if (url.indexOf("api.zhihu.com/commercial_api/real_time_launch_v2") != -1 && method == getMethod) {
    zhihuAds(body, '知乎-开屏页');
} else if (url.indexOf("api.zhihu.com/topstory/recommend") != -1 && method == getMethod) {
    console.log('知乎-推荐列表');
    let dataArr = body.data;
    if (dataArr == undefined) {
        console.log("body:" + $response.body);
        $notification.post(notifiTitle, "知乎推荐", "data字段为undefined");
    } else {
        body.data = dataArr.filter(item => {
            if (item.hasOwnProperty("extra") &&
                item.extra.hasOwnProperty("type") &&
                item.extra.type === "zvideo") {
                let videoUrl = item.common_card.feed_content.video.customized_page_url;
                let videoID = getUrlParamValue(videoUrl, "videoID");
                if (videoID == null) {
                    console.log('zvideo未获取到videoID');
                    console.log("body:" + $response.body);
                    // 部分获取不到videoId并且视频可以播放
                    //$notification.post(notifiTitle, "知乎推荐列表视频", "videoID获取错误");
                } else {
                    item.common_card.feed_content.video.id = videoID;
                    console.log('videoID处理成功');
                }
            } else if (item.hasOwnProperty("type") && item.type == 'market_card'
                && item.hasOwnProperty("fields") && item.fields.hasOwnProperty("header")
                && item.fields.header.hasOwnProperty("url") && item.fields.hasOwnProperty("body")
                && item.fields.body.hasOwnProperty("video") && item.fields.body.video.hasOwnProperty("id")) {
                let videoID = getUrlParamValue(item.fields.header.url, "videoID");
                if (videoID == null) {
                    console.log("body:" + $response.body);
                    $notification.post(notifiTitle, "知乎推荐列表视频", "videoID获取错误");
                } else {
                    item.fields.body.video.id = videoID;
                    console.log('market_card-videoID处理成功');
                }
            } else if (item.hasOwnProperty("common_card") && item.common_card.hasOwnProperty("feed_content")
                && item.common_card.feed_content.hasOwnProperty("video") && item.common_card.feed_content.video.hasOwnProperty("id")) {
                let search = '"feed_content":{"video":{"id":';
                let str = $response.body.substring($response.body.indexOf(search) + search.length);
                item.common_card.feed_content.video.id = str.substring(0, str.indexOf(','));
                console.log('其他-videoID处理成功');
            }
            return item.type != 'feed_advert';
        });
        if (body.data.length == dataArr.length) {
            console.log('列表数据无广告');
        } else {
            console.log('成功');
        }
    }
} else if (url.indexOf("api.zhihu.com/v4/questions") != -1 && method == getMethod) {
    console.log('知乎-问题回答列表');
    if (body.ad_info === undefined) {
        // 个别问题回答列表无广告
        console.log("问题回答列表无广告");
    } else {
        body.ad_info = null;
        console.log('成功');
    }
} else if (url.indexOf("www.zhihu.com/api/v4/answers") != -1 && method == getMethod) {
    console.log('知乎-回答下的广告');
    if (body.paging === undefined || body.data === undefined) {
        console.log("body:" + $response.body);
        $notification.post(notifiTitle, '知乎回答下广告', "paging/data字段为undefined");
    } else {
        body.paging = null;
        body.data = null;
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
} else if (url.indexOf("magev6.if.qidian.com/argus/api/v1/popup/getlist?") != -1 && method == getMethod) {
    if (body.Data === undefined) {
        console.log("body:" + $response.body);
        $notification.post(notifiTitle, "起点-popup", "Data字段错误");
    } else {
        let locationValue = getUrlParamValue(url, 'location');
        if (locationValue == 100) {
            // 一本书最新章节看完之后的页面弹窗
            console.log('起点-书籍最新章节看完弹窗');
            if (body.Data.length == 0) {
                console.log('无弹窗数据');
            } else if (body.Data.length == 1 && body.Data[0].Source == 'BOSSAD') {
                body.Data = [];
                console.log('成功');
            } else {
                console.log("body:" + $response.body);
                $notification.post(notifiTitle, "起点-书籍弹窗", "Data/Source字段错误");
            }
        } else if (getUrlParamValue(url, 'roleId') != null && locationValue == 101) {
            // 排行-角色榜-点击具体角色出现
            console.log('起点-书籍角色弹窗');
            if (body.Data === undefined || body.Data.length !== 0) {
                console.log("body:" + $response.body);
                $notification.post(notifiTitle, "起点-书籍角色弹窗", "Data字段错误");
            } else {
                console.log('无弹窗数据');
            }
        } else {
            // 出现未知
            console.log("body:" + $response.body);
            $notification.post(notifiTitle, "起点-popup", "未知匹配");
        }
    }
} else if (url.indexOf("magev6.if.qidian.com/argus/api/v1/client/getconf") != -1 && method == postMethod) {
    console.log('起点-getconf');
    if (body.Data === undefined) {
        console.log("body:" + $response.body);
        $notification.post(notifiTitle, "起点-getconf", "Data字段为undefined");
    } else {
        // 精选 和 发现 中间的活动配置
        if (body.Data.ActivityPopup === undefined || body.Data.ActivityPopup.Data == undefined) {
            console.log("body:" + $response.body);
            $notification.post(notifiTitle, "起点-getconf", "ActivityPopup/Data字段为undefined");
        } else {
            body.Data.ActivityPopup = null;
            console.log('ActivityPopup(活动弹窗)成功');
        }

        // QDReader://Bookshelf 书架右下角悬浮活动
        if (body.Data.ActivityIcon === undefined || body.Data.ActivityIcon.Type !== 0) {
            console.log("body:" + $response.body);
            $notification.post(notifiTitle, "起点-getconf", "ActivityIcon/Type字段错误");
        } else {
            // 无活动icon的情况下为{"EndTime":0,"StartTime":0,"Type":0}
            if (body.Data.ActivityIcon.EndTime === 0) {
                console.log('无ActivityIcon配置');
            } else {
                body.Data.ActivityIcon.StartTime = 0;
                body.Data.ActivityIcon.EndTime = 0;
                delete body.Data.ActivityIcon.Actionurl;
                delete body.Data.ActivityIcon.Icon;
                console.log('ActivityIcon成功');
            }
        }

        // 功能增强:搜索页可以搜索用户
        if (body.Data.EnableSearchUser === undefined || body.Data.EnableSearchUser != "0") {
            console.log("body:" + $response.body);
            $notification.post(notifiTitle, "起点-getconf", "EnableSearchUser字段错误");
        } else {
            body.Data.EnableSearchUser = "1";
            console.log('允许搜索用户成功');
        }
        // QDReader://UserCenter   我
        // QDReader://Bookshelf    书架
        // QDReader://Bookstore    精选
    }
} else if (url.indexOf("api-access.pangolin-sdk-toutiao.com/api/ad/union/sdk") != -1 && method == postMethod) {
    console.log('穿山甲-get_ads');
    if (body.message === undefined) {
        console.log("body:" + $response.body);
        // 错误码 https://www.pangle.cn/support/doc/5de4cc6d78c8690012a90aa5
        if (body.status_code === undefined) {
            $notification.post(notifiTitle, "穿山甲", "message/status_code字段错误");
        } else {
            console.log('广告为空');
        }
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
    console.log('腾讯新闻-专题列表-SpecialListItemsV2');
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
    qqNewsAdList(body, '腾讯新闻-话题列表');
} else if (url.indexOf("app.bilibili.com/x/v2/splash/list") != -1 && method == getMethod) {
    console.log('bilibili-开屏页');
    if (body.data === undefined) {
        console.log("body:" + $response.body);
        $notification.post(notifiTitle, "bilibili开屏", "data字段错误");
    } else {
        if (body.data.show === undefined) {
            // 有时候返回的数据没有show字段
            console.log('数据无show字段');
        } else {
            delete body.data.show;
            console.log('成功');
        }
    }
} else if (url.indexOf('us.l.qq.com/exapp?') != -1 && method == getMethod) {
    console.log('qq音乐-开屏页');
    if (body.data === undefined) {
        console.log("body:" + $response.body);
        $notification.post(notifiTitle, "qq音乐-开屏页", "data字段错误");
    } else {
        let dataObj = body.data;
        let count = 0;
        for (const k in dataObj) {
            let listObj = dataObj[k].list;
            for (let i = 0; i < listObj.length; i++) {
                if (listObj[i].is_empty === undefined) {
                    console.log("body:" + $response.body);
                    $notification.post(notifiTitle, "qq音乐-开屏", "is_empty字段错误");
                    break;
                }
                if (listObj[i].is_empty === 0) {
                    listObj[i].is_empty = 1;
                    count++;
                }
            }
        }
        // 冷启动有一条广告 热启动有多条
        console.log('成功count:' + count);
    }
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


/**
 * 根据参数名称获取url地址中的参数值
 * @param {*} url url
 * @param {*} queryName 参数名称
 * @returns 参数值 未获取到返回null
 */
function getUrlParamValue(url, queryName) {
    let i = url.indexOf("?");
    if (i != -1 && i != url.length - 1) {
        let arr = url.substring(i + 1).split('&');
        for (let x = 0; x < arr.length; x++) {
            let pair = arr[x].split('=');
            if (pair.length == 2) {
                if (pair[0] == queryName) {
                    return pair[1];
                }
            } else {
                console.log('url:' + url);
                $notification.post(notifiTitle, '获取url参数', "pair错误");
            }
        }
    } else {
        console.log('url:' + url);
        $notification.post(notifiTitle, '获取url参数', "i错误");
        return null;
    }
    // 未匹配到queryName
    return null;
}
