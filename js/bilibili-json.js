const url = $request.url;
const method = $request.method;
const getMethod = "GET";
const notifiTitle = "bilibili-json";
let body = JSON.parse($response.body);

if (url.indexOf("app.bilibili.com/x/v2/splash") !== -1 && method === getMethod) {
    console.log('bilibili-开屏页' + (url.indexOf("splash/show") !== -1 ? 'show' : 'list'));
    if (!body.hasOwnProperty('data')) {
        console.log("body:" + $response.body);
        $notification.post(notifiTitle, "bilibili开屏", "data字段错误");
    } else {
        if (!body.data.hasOwnProperty('show')) {
            // 有时候返回的数据没有show字段
            console.log('数据无show字段');
        } else {
            delete body.data.show;
            console.log('成功');
        }
    }
} else {
    $notification.post(notifiTitle, "路径/请求方法匹配错误:", method + "," + url);
}

body = JSON.stringify(body);
$done({
    body
});
