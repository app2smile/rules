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
    } else if (url.indexOf("resource/show/tab/v2") !== -1 && method === getMethod) {
        console.log('tab修改');
        // 顶部右上角
        if (!body.data.hasOwnProperty('top')) {
            console.log("body:" + $response.body);
            $notification.post(notifiTitle, 'tab', "top字段错误");
        } else {
            body.data.top = body.data.top.filter(item => {
                if (item.name === '游戏中心') {
                    console.log('去除右上角游戏中心');
                    return false;
                }
                return true;
            });
            fixPos(body.data.top);
        }
        // 底部tab栏
        // if (!body.data.hasOwnProperty('bottom')) {
        //     console.log("body:" + $response.body);
        //     $notification.post(notifiTitle, 'tab', "bottom字段错误");
        // } else {
        //     body.data.bottom = body.data.bottom.filter(item => {
        //         if (item.name === '发布') {
        //             console.log('去除发布');
        //             return false;
        //         } else if (item.name === '会员购') {
        //             console.log('去除会员购');
        //             return false;
        //         }
        //         return true;
        //     });
        //     fixPos(body.data.bottom);
        // }
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
                    } else if (cardType === 'cm_v2' && ['ad_web_s', 'ad_av', 'ad_web_gif', 'ad_player'].includes(cardGoto)) {
                        // ad_player大视频广告 ad_web_gif大gif广告 ad_web_s普通小广告 ad_av创作推广广告
                        console.log(`${cardGoto}广告去除)`);
                        return false;
                    } else if (cardType === 'small_cover_v10' && cardGoto === 'game') {
                        console.log('游戏广告去除');
                        return false;
                    } else if (cardType === 'cm_double_v9' && cardGoto === 'ad_inline_av') {
                        console.log('创作推广-大视频广告');
                        return false;
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


function fixPos(arr) {
    for (let i = 0; i < arr.length; i++) {
        // 修复pos
        arr[i].pos = i + 1;
    }
}
