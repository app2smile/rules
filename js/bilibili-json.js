const url = $request.url;
const method = $request.method;
const getMethod = "GET";
const notifiTitle = "bilibili-json";
let body = JSON.parse($response.body);


if (!body.hasOwnProperty('data')) {
    console.log(url);
    console.log("body:" + $response.body);
    $notification.post(notifiTitle, url, "data字段错误");
} else {
    if (url.indexOf("x/v2/splash") !== -1 && method === getMethod) {
        console.log('开屏页' + (url.indexOf("splash/show") !== -1 ? 'show' : 'list'));
        if (!body.data.hasOwnProperty('show')) {
            // 有时候返回的数据没有show字段
            console.log('数据无show字段');
        } else {
            delete body.data.show;
            console.log('成功');
        }
    } else if (url.indexOf("x/v2/feed/index") !== -1 && method === getMethod) {
        console.log('推荐页');
        if (!body.data.hasOwnProperty('items')) {
            console.log("body:" + $response.body);
            $notification.post(notifiTitle, '推荐页', "items字段错误");
        } else {
            body.data.items = body.data.items.filter(i => {
                if (i.hasOwnProperty('card_type') && i.hasOwnProperty('card_goto')) {
                    const cardType = i.card_type;
                    const cardGoto = i.card_goto;
                    if (cardType === 'banner_v8' && cardGoto === 'banner') {
                        if (!i.hasOwnProperty('banner_item')) {
                            console.log("body:" + $response.body);
                            $notification.post(notifiTitle, '推荐页', "banner_item错误");
                        } else {
                            for (const v of i.banner_item) {
                                if (!v.hasOwnProperty('type')) {
                                    console.log("body:" + $response.body);
                                    $notification.post(notifiTitle, '推荐页', "type错误");
                                } else {
                                    if (v.type === 'ad') {
                                        console.log('banner广告');
                                        return false;
                                    }
                                }
                            }
                        }
                    } else if (cardType === 'cm_v2') {
                        if (cardGoto === 'ad_web_s') {
                            console.log('广告');
                            return false;
                        } else if (cardGoto === 'ad_av') {
                            console.log('创作推广广告');
                            return false;
                        }
                    }
                } else {
                    console.log("body:" + $response.body);
                    $notification.post(notifiTitle, '推荐页', "无card_type/card_goto");
                }
                return true;
            });
        }
    } else {
        $notification.post(notifiTitle, "路径/请求方法匹配错误:", method + "," + url);
    }
}

body = JSON.stringify(body);
$done({
    body
});
