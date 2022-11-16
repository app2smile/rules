let url = $request.url;
let method = $request.method;
if (!$response.body) {
    console.log(`$response.body为undefined:${url}`);
    $done({});
}

let body = JSON.parse($response.body);

if (method !== "POST") {
    $notification.post("腾讯新闻App脚本错误", "method错误:", method);
}

if (url.includes("r.inews.qq.com/gw/page/event_detail")) {
    removeAdList('event_detail');
} else if (url.includes("r.inews.qq.com/gw/page/channel_feed")) {
    removeAdList('channel_feed');
} else {
    let name = "";
    if (url.includes("news.ssp.qq.com/app")) {
        name = '开屏页';
    } else if (url.includes("r.inews.qq.com/getQQNewsUnreadList")) {
        // 是否弃用,还需要验证
        name = '要闻/财经等';
    } else if (url.includes("r.inews.qq.com/news_feed/hot_module_list")) {
        name = '财经精选-更多';
    } else if (url.includes("r.inews.qq.com/gw/event/list")) {
        // 弃用
        name = '专题gw/event/list';
    } else if (url.includes("r.inews.qq.com/getTwentyFourHourNews")) {
        // 弃用
        name = '热点精选getTwentyFourHourNews';
    } else if (url.includes("r.inews.qq.com/getQQNewsListItems")) {
        // 弃用
        name = '热点精选getQQNewsListItems';
    } else if (url.includes("r.inews.qq.com/getTagFeedList")) {
        // 如地方专区下的 XX旅游 XX美食列表广告
        name = 'getTagFeedList';
    } else {
        $notification.post('腾讯新闻App脚本错误', "路径匹配错误:", url);
    }
    console.log(name);
    if (!body.adList) {
        // 部分专题列表无广告,没有adList字段
        console.log('无广告');
    } else {
        body.adList = null;
        console.log('成功');
    }
}

body = JSON.stringify(body);

$done({
    body
});

function removeAdList(name) {
    console.log(`gw/page/${name}`);
    if (body.data.widget_list) {
        body.data.widget_list = body.data.widget_list.filter(item => {
            if (item.widget_type === 'ad_list') {
                console.log('去除ad_list广告');
                return false;
            }
            return true;
        });
    } else {
        console.log($response.body);
        $notification.post('腾讯新闻App脚本错误', name, '无widget_list字段');
    }
}
