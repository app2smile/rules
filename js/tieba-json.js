const url = $request.url;
const method = $request.method;
const getMethod = "GET";
const postMethod = "POST";
const notifiTitle = "贴吧json脚本错误";

let body = JSON.parse($response.body);

if (url.indexOf("afd.baidu.com/afd/entry") != -1) {
    console.log('贴吧-开屏页');
    if (body.res == undefined || body.res.splash == undefined) {
        console.log("body:" + $response.body);
        $notification.post(notifiTitle, "贴吧-afd", "res-splash字段为undefined");
    } else {
        body.res.splash = null;
        console.log('成功');
    }
} else if (url.indexOf("c.tieba.baidu.com/tiebaads/commonbatch") != -1 && method == postMethod) {
    // 看图模式下的广告
    let adCmd = getUrlParamValue(url, "adcmd");
    if (adCmd == null) {
        console.log("url:" + url);
        $notification.post(notifiTitle, "贴吧-tiebaads/commonbatch", "adCmd参数为null");
    } else {
        console.log('commonbatch: ' + adCmd);
        if (body.error_code == 0) {
            if (body.res.ad === undefined) {
                console.log('ad字段为undefined');
            } else if (body.res.ad.length == 0) {
                console.log('ad字段为空');
            } else {
                body.res.ad = [];
                // 即使ad有内容 也不一定显示广告
                // 因为如果服务器下发的数据少了一些字段同样是无广告的
                console.log('成功');
            }
        } else {
            console.log('error_code不为0:' + body.error_code);
        }
    }
} else if (url.indexOf('c.tieba.baidu.com/c/s/sync') !== -1) {
    // get post(贴吧使用了post)均可访问
    console.log('贴吧-sync');
    if (body.hasOwnProperty('floating_icon')) {
        console.log('右下角悬浮icon');
        if (body.floating_icon !== null) {
            if (body.floating_icon.hasOwnProperty('homepage')
                && body.floating_icon.homepage !== null
                && body.floating_icon.homepage.hasOwnProperty('icon_url')
                && body.floating_icon.homepage.icon_url !== null && body.floating_icon.homepage.icon_url !== '') {
                console.log('homepage悬浮去除');
            } else {
                console.log('无需去除homepage悬浮');
            }
            if (body.floating_icon.hasOwnProperty('pb')
                && body.floating_icon.pb !== null
                && body.floating_icon.pb.hasOwnProperty('icon_url')
                && body.floating_icon.pb.icon_url !== null && body.floating_icon.pb.icon_url !== '') {
                console.log('pb悬浮去除');
            } else {
                console.log('无需去除pb悬浮');
            }
            body.floating_icon = null;
        } else {
            console.log('floating_icon字段值为null,无需修改');
        }
    } else {
        console.log("body:" + $response.body);
        $notification.post(notifiTitle, "贴吧-sync", "无floating_icon字段");
    }
    // 程序化广告屏蔽开启 防止加载穿山甲等广告
    if (body.hasOwnProperty('ad_sdk_priority')) {
        if (body.ad_sdk_priority != "0") {
            console.log(`ad_sdk_priority:${body.ad_sdk_priority}`);
            body.ad_sdk_priority = "0";
        } else {
            console.log('无需处理ad_sdk_priority');
        }
    } else {
        console.log("body:" + $response.body);
        $notification.post(notifiTitle, "贴吧-sync", "无ad_sdk_priority字段");
    }
    if (body.hasOwnProperty('bear_sid_type')) {
        if (body.bear_sid_type != "") {
            console.log(`bear_sid_type:${body.bear_sid_type}`);
            body.bear_sid_type = "";
        } else {
            console.log('无需处理bear_sid_type');
        }
    } else {
        console.log("body:" + $response.body);
        $notification.post(notifiTitle, "贴吧-sync", "无bear_sid_type字段");
    }

    // 回帖栏的广告
    if (body.hasOwnProperty('advertisement_config')) {
        if (body.advertisement_config == null) {
            console.log('无需处理advertisement_config');
        } else {
            console.log("advertisement_str:" + body.advertisement_config.advertisement_str);
            body.advertisement_config = null;
        }
    } else {
        console.log("body:" + $response.body);
        $notification.post(notifiTitle, "贴吧-sync", "无advertisement_config字段");
    }

} else {
    $notification.post(notifiTitle, "路径/请求方法匹配错误:", method + "," + url);
}

body = JSON.stringify(body);

$done({
    body
});


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
