const url = $request.url;
const method = $request.method;
const postMethod = "POST";
const notifyTitle = "贴吧json脚本错误";

let body = JSON.parse($response.body);
// 直接全局搜索 @Modify(
if (url.includes("tiebaads/commonbatch") && method === postMethod) {
    // 看图模式下的广告
    let adCmd = getUrlParamValue(url, "adcmd");
    if (!adCmd) {
        console.log(`url:${url}`);
        $notification.post(notifyTitle, "贴吧-tiebaads/commonbatch", "adCmd参数不存在");
    } else {
        console.log(`commonbatch:${adCmd}`);
        if (body.error_code === 0) {
            if (!body.res.ad?.length) {
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
} else if (url.includes('c/s/sync')) {
    // get post(贴吧使用了post)均可访问
    console.log('贴吧-sync');
    if ('floating_icon' in body) {
        console.log('右下角悬浮icon');
        if (body.floating_icon) {
            if (body.floating_icon.homepage?.icon_url) {
                console.log('homepage悬浮去除');
            } else {
                console.log('无需去除homepage悬浮');
            }
            if (body.floating_icon.pb?.icon_url) {
                console.log('pb悬浮去除');
            } else {
                console.log('无需去除pb悬浮');
            }
            body.floating_icon = null;
        } else {
            console.log('无需修改floating_icon字段值');
        }
    } else {
        console.log(`body:${$response.body}`);
        $notification.post(notifyTitle, "贴吧-sync", "无floating_icon字段");
    }

    // 回帖栏的广告
    if ('advertisement_config' in body) {
        if (!body.advertisement_config?.advertisement_str) {
            console.log('无需处理advertisement_config');
        } else {
            console.log(`advertisement_str:${body.advertisement_config.advertisement_str}`);
            body.advertisement_config = null;
        }
    } else {
        console.log(`body:${$response.body}`);
        $notification.post(notifyTitle, "贴吧-sync", "无advertisement_config字段");
    }

    if ('config' in body) {
        if (body.config?.switch) {
            for (const item of body.config.switch) {
                if (['platform_csj_init', 'platform_ks_init', 'platform_gdt_init'].includes(item.name)) {
                    item.type = '0';
                    // 禁止初始化穿山甲/广点通/快手
                    console.log(`禁止初始化${item.name}`);
                }
            }
        }
    } else {
        console.log(`body:${$response.body}`);
        $notification.post(notifyTitle, "贴吧-sync", "无config字段");
    }

    if ('screen_fill_data_result' in body) {
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
        console.log(`body:${$response.body}`);
        $notification.post(notifyTitle, "贴吧-sync", "无screen_fill_data_result字段");
    }

    if ('ad_stlog_switch' in body) {
        if (body.ad_stlog_switch === '1') {
            body.ad_stlog_switch = '0';
            console.log('修改ad_stlog_switch');
        } else {
            console.log('无需修改ad_stlog_switch');
        }
    } else {
        console.log(`body:${$response.body}`);
        $notification.post(notifyTitle, "贴吧-sync", "无ad_stlog_switch字段");
    }

    if ('lcs_strategy' in body) {
        // 控制长连接开关 开启时帖子会走socket
        if (body.lcs_strategy.conn_conf === '0') {
            // 关闭
            body.lcs_strategy.conn_conf = '1';
            console.log('修改conn_conf');
        } else {
            console.log('无需修改conn_conf');
        }
    } else {
        console.log(`body:${$response.body}`);
        $notification.post(notifyTitle, "贴吧-sync", "无lcs_strategy字段");
    }
} else {
    $notification.post(notifyTitle, "路径/请求方法匹配错误:", method + "," + url);
}

body = JSON.stringify(body);

$done({
    body
});


function getUrlParamValue(url, queryName) {
    return Object.fromEntries(url.substring(url.indexOf("?") + 1)
        .split("&")
        .map(pair => pair.split("="))
    )[queryName];
}