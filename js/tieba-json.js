const url = $request.url;
const method = $request.method;
const postMethod = "POST";
const notifiTitle = "贴吧json脚本错误";

let body = JSON.parse($response.body);

if (url.indexOf("tiebaads/commonbatch") !== -1 && method === postMethod) {
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
} else if (url.indexOf('c/s/sync') !== -1) {
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

    if (body.hasOwnProperty('config')) {
        if (body.config == null) {
            console.log('无需处理config');
        } else {
            if (body.config.hasOwnProperty('switch')) {
                for (let i = 0; i < body.config.switch.length; i++) {
                    let item = body.config.switch[i];
                    if (['platform_csj_init', 'platform_ks_init', 'platform_gdt_init'].includes(item.name)) {
                        body.config.switch[i].type = '0';
                        // 禁止初始化穿山甲/广点通/快手
                        console.log(`禁止初始化${item.name}`);
                    }
                }
            }
        }
    } else {
        console.log("body:" + $response.body);
        $notification.post(notifiTitle, "贴吧-sync", "无config字段");
    }

    if (body.hasOwnProperty('screen_fill_data_result')) {
        if (body.screen_fill_data_result.screen_fill_advertisement_bear_switch === "1") {
            body.screen_fill_data_result.screen_fill_advertisement_bear_switch = '0';
            console.log('开屏不展示小熊广告');
        } else {
            console.log('无需修改screen_fill_advertisement_bear_switch');
        }
        if (body.screen_fill_data_result.screen_fill_advertisement_plj_cpc_switch === "1") {
            body.screen_fill_data_result.screen_fill_advertisement_plj_cpc_switch = '0';
            console.log('开屏不展示序章CPC');
        } else {
            console.log('无需修改screen_fill_advertisement_plj_cpc_switch');
        }
        if (body.screen_fill_data_result.screen_fill_advertisement_plj_switch === "1") {
            body.screen_fill_data_result.screen_fill_advertisement_plj_switch = '0';
            console.log('开屏不展示序章');
        } else {
            console.log('无需修改screen_fill_advertisement_plj_switch');
        }
    } else {
        console.log("body:" + $response.body);
        $notification.post(notifiTitle, "贴吧-sync", "无screen_fill_data_result字段");
    }

    if (body.hasOwnProperty('ad_stlog_switch')) {
        if (body.ad_stlog_switch === '1') {
            body.ad_stlog_switch = '0';
            console.log('修改ad_stlog_switch');
        } else {
            console.log('无需修改ad_stlog_switch');
        }
    } else {
        console.log("body:" + $response.body);
        $notification.post(notifiTitle, "贴吧-sync", "无ad_stlog_switch字段");
    }

    if (body.hasOwnProperty('lcs_strategy')) {
        // 控制长连接开关 开启时帖子会走socket
        if (body.lcs_strategy.conn_conf === '0') {
            // 关闭
            body.lcs_strategy.conn_conf = '1';
            console.log('修改conn_conf');
        } else {
            console.log('无需修改conn_conf');
        }
    } else {
        console.log("body:" + $response.body);
        $notification.post(notifiTitle, "贴吧-sync", "无lcs_strategy字段");
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
