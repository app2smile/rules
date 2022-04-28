const url = $request.url;
const method = $request.method;
let body = JSON.parse($response.body);

const noticeTitle = "去广告脚本错误";
const getMethod = "GET";

if (url.indexOf("api.zhihu.com/commercial_api/real_time_launch_v2") !== -1 && method === getMethod) {
    zhihuAds(body, '知乎-开屏页');
} else if (url.indexOf("api.zhihu.com/topstory/recommend") !== -1 && method === getMethod) {
    console.log('知乎-推荐列表');
    let dataArr = body.data;
    if (dataArr === undefined) {
        console.log("body:" + $response.body);
        $notification.post(noticeTitle, "知乎推荐", "data字段为undefined");
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
                    console.log(`videoID处理成功,原始:${item.common_card.feed_content.video.id},修改为:${videoID}`);
                    item.common_card.feed_content.video.id = videoID;
                }
            } else if (item.hasOwnProperty("type") && item.type === 'market_card'
                && item.hasOwnProperty("fields") && item.fields.hasOwnProperty("header")
                && item.fields.header.hasOwnProperty("url") && item.fields.hasOwnProperty("body")
                && item.fields.body.hasOwnProperty("video") && item.fields.body.video.hasOwnProperty("id")) {
                let videoID = getUrlParamValue(item.fields.header.url, "videoID");
                if (videoID == null) {
                    console.log("body:" + $response.body);
                    $notification.post(noticeTitle, "知乎推荐列表视频", "videoID获取错误");
                } else {
                    console.log(`market_card-videoID处理成功,原始:${item.fields.body.video.id},修改为:${videoID}`);
                    item.fields.body.video.id = videoID;
                }
            } else if (item.hasOwnProperty("common_card") && item.common_card.hasOwnProperty("feed_content")
                && item.common_card.feed_content.hasOwnProperty("video") && item.common_card.feed_content.video.hasOwnProperty("id")) {
                let search = '"feed_content":{"video":{"id":';
                let str = $response.body.substring($response.body.indexOf(search) + search.length);
                let videoID = str.substring(0, str.indexOf(','));
                console.log(`其他-videoID处理成功,原始:${item.common_card.feed_content.video.id},修改为:${videoID}`);
                item.common_card.feed_content.video.id = videoID;
            }
            return item.type !== 'feed_advert';
        });
        if (body.data.length === dataArr.length) {
            console.log('列表数据无广告');
        } else {
            console.log('成功');
        }
    }
} else if ((url.indexOf("api.zhihu.com/questions") !== -1 || url.indexOf("api.zhihu.com/v4/questions") !== -1)
    && method === getMethod) {
    if (url.indexOf("v4/questions") !== -1) {
        console.log('v4/questions');
    } else {
        console.log('questions');
    }
    console.log('知乎-问题回答列表');
    if (body.ad_info === undefined) {
        // 个别问题回答列表无广告
        console.log("问题回答列表无广告");
    } else {
        body.ad_info = null;
        console.log('成功');
    }
    body.data = body.data.filter(item => {
        if (item.hasOwnProperty("target_type") && item.target_type === 'answer'
            && item.hasOwnProperty("target") && item.target.hasOwnProperty('attachment')
            && item.target.attachment.hasOwnProperty('type') && item.target.attachment.type === 'video'
            && item.target.attachment.hasOwnProperty('video') && item.target.attachment.video.hasOwnProperty('video_info')
            && item.target.attachment.video.video_info.hasOwnProperty('video_id')) {
            let videoID = item.target.attachment.attachment_id;
            console.log(`feeds-video_id处理成功,原始:${item.target.attachment.video.video_info.video_id},修改为:${videoID}`);
            item.target.attachment.video.video_info.video_id = videoID;
        } else if (item.hasOwnProperty("answer_type") && item.answer_type === 'normal'
            && item.hasOwnProperty("attachment") && item.attachment.hasOwnProperty('type')
            && item.attachment.type === 'video' && item.attachment.hasOwnProperty('attachment_id')
            && item.attachment.hasOwnProperty('video') && item.attachment.video.hasOwnProperty('video_info')
            && item.attachment.video.video_info.hasOwnProperty('video_id')) {
            let videoID = item.attachment.attachment_id;
            console.log(`v4-answers-video_id处理成功,原始:${item.attachment.video.video_info.video_id},修改为:${videoID}`);
            item.attachment.video.video_info.video_id = videoID;
        }
        return true;
    });
} else if (url.indexOf("www.zhihu.com/api/v4/answers") !== -1 && method === getMethod) {
    console.log('知乎-回答下的广告');
    if (body.paging === undefined || body.data === undefined) {
        console.log("body:" + $response.body);
        $notification.post(noticeTitle, '知乎回答下广告', "paging/data字段为undefined");
    } else {
        body.paging = null;
        body.data = null;
        console.log('成功');
    }
} else if (url.indexOf("appcloud2.zhihu.com/v3/config") !== -1 && method === getMethod) {
    console.log('知乎-appcloud2 config配置');
    if (body.hasOwnProperty('config') && body.config.hasOwnProperty('zhcnh_thread_sync')
        && body.config.zhcnh_thread_sync.hasOwnProperty('ZHBackUpIP_Switch_Open')) {
        if (body.config.zhcnh_thread_sync.ZHBackUpIP_Switch_Open === '1') {
            body.config.zhcnh_thread_sync.ZHBackUpIP_Switch_Open = '0';
            console.log('ZHBackUpIP_Switch_Open改为0');
        } else {
            console.log('无需更改ZHBackUpIP_Switch_Open');
        }
    } else {
        console.log("body:" + $response.body);
        $notification.post(noticeTitle, '知乎-appcloud2 config配置', "字段错误");
    }
} else if (url.indexOf("api.zhihu.com/commercial_api/app_float_layer") !== -1 && method === getMethod) {
    console.log('知乎-首页右下角悬浮框');
    if (body.hasOwnProperty('feed_egg')) {
        console.log('成功');
        body = {};
    } else {
        console.log('无需处理');
    }
} else {
    $notification.post(noticeTitle, "路径/请求方法匹配错误:", method + "," + url);
}

body = JSON.stringify(body);

$done({
    body
});

/**
 * 处理知乎ads广告
 * @param {*} body body
 * @param {*} name 日志名称
 */
function zhihuAds(body, name) {
    console.log(name);
    let launch;
    if (body.launch === undefined) {
        console.log("body:" + $response.body);
        $notification.post(noticeTitle, name, "launch字段为undefined");
    } else {
        launch = JSON.parse(body.launch);
    }
    if (launch.ads === undefined) {
        // ads字段有时候为空,有时候没有ads字段
        console.log("body:" + $response.body);
        $notification.post(noticeTitle, name, "launch-ads字段为undefined");
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
    if (i !== -1 && i !== url.length - 1) {
        let arr = url.substring(i + 1).split('&');
        for (let x = 0; x < arr.length; x++) {
            let pair = arr[x].split('=');
            if (pair.length === 2) {
                if (pair[0] == queryName) {
                    return pair[1];
                }
            } else {
                console.log('url:' + url);
                $notification.post(noticeTitle, '获取url参数', "pair错误");
            }
        }
    } else {
        console.log('url:' + url);
        $notification.post(noticeTitle, '获取url参数', "i错误");
        return null;
    }
    // 未匹配到queryName
    return null;
}
