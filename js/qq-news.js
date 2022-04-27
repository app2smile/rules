let url = $request.url;
let method = $request.method;
let body = JSON.parse($response.body);

const postMethod = "POST";
let name = "";
if (url.indexOf("news.ssp.qq.com/app") !== -1 && method === postMethod) {
    name = '腾讯新闻-开屏页';
} else if (url.indexOf("r.inews.qq.com/getQQNewsUnreadList") !== -1 && method === postMethod) {
    name = '腾讯新闻-要闻/财经等';
// } else if (url.indexOf("r.inews.qq.com/getQQNewsMixedList") !== -1 && method === postMethod) {
//     qqNewsAdList(body, '腾讯新闻-专题列表-MixedList');
// } else if (url.indexOf("r.inews.qq.com/getTopicSelectList") !== -1 && method === postMethod) {
//     qqNewsAdList(body, '腾讯新闻-话题列表');
// } else if (url.indexOf("r.inews.qq.com/getQQNewsSpecialListItemsV2") !== -1 && method === postMethod) {
//     qqNewsAdList(body, '腾讯新闻-视频精选(专题)');
} else if (url.indexOf("r.inews.qq.com/getTwentyFourHourNews") !== -1 && method === postMethod) {
    name = '腾讯新闻-热点精选';
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

body = JSON.stringify(body);

$done({
    body
});
