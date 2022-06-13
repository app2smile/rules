let url = $request.url;
let method = $request.method;
let body = JSON.parse($response.body);

const postMethod = "POST";
if (url.indexOf("r.inews.qq.com/gw/page/event_detail") !== -1 && method === postMethod) {
    console.log('专题gw/page/event_detail');
    if (body.hasOwnProperty('data') && body.data.hasOwnProperty('widget_list')) {
        body.data.widget_list = body.data.widget_list.filter(item => {
            if (item.widget_type === 'ad_list') {
                console.log('去除ad_list广告');
                return false;
            }
            return true;
        });
    } else {
        console.log($response.body);
        $notification.post('腾讯新闻App脚本错误', "event_detail", '无widget_list字段');
    }
} else {
    let name = "";
    if (url.indexOf("news.ssp.qq.com/app") !== -1 && method === postMethod) {
        name = '开屏页';
    } else if (url.indexOf("r.inews.qq.com/getQQNewsUnreadList") !== -1 && method === postMethod) {
        name = '要闻/财经等';
// } else if (url.indexOf("r.inews.qq.com/getQQNewsMixedList") !== -1 && method === postMethod) {
//     qqNewsAdList(body, '腾讯新闻-专题列表-MixedList');
// } else if (url.indexOf("r.inews.qq.com/getTopicSelectList") !== -1 && method === postMethod) {
//     qqNewsAdList(body, '腾讯新闻-话题列表');
// } else if (url.indexOf("r.inews.qq.com/getQQNewsSpecialListItemsV2") !== -1 && method === postMethod) {
//     qqNewsAdList(body, '腾讯新闻-视频精选(专题)');
    } else if (url.indexOf("r.inews.qq.com/gw/event/list") !== -1 && method === postMethod) {
        name = '专题gw/event/list';
    } else if (url.indexOf("r.inews.qq.com/getTwentyFourHourNews") !== -1 && method === postMethod) {
        name = '热点精选getTwentyFourHourNews';
    } else if (url.indexOf("r.inews.qq.com/getQQNewsListItems") !== -1 && method === postMethod) {
        name = '热点精选getQQNewsListItems';
    } else if (url.indexOf("r.inews.qq.com/getTagFeedList") !== -1 && method === postMethod) {
        // 如地方专区下的 XX旅游 XX美食列表广告
        name = 'getTagFeedList';
    } else {
        $notification.post('腾讯新闻App脚本错误', "路径/请求方法匹配错误:", method + "," + url);
    }
    console.log(name);
    if (body.adList === undefined) {
        // 部分专题列表无广告,没有adList字段
        console.log('无广告');
        // console.log(`adList字段为undefined,body:${$response.body}`);
        // $notification.post(notifiTitle, name, "adList字段为undefined");
    } else {
        body.adList = null;
        console.log('成功');
    }
}

body = JSON.stringify(body);

$done({
    body
});
