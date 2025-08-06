console.log(`JumpApp-json-20250806`);
const resStatus = $response.status ? $response.status : $response.statusCode;
if (resStatus !== 200) {
    console.log(`$response.status不为200:${resStatus}`);
    $done({});
}
const url = $request.url;
if (!$response.body) {
    console.log(`$response.body为undefined:${url}`);
    $done({});
}
let body = JSON.parse($response.body);
if (!body.success) {
    console.log(`success不为true:${$response.body}`);
    $done({});
}

const notifyTitle = "JumpApp-json";
if (!$response.body) {
    console.log(`$response.body为undefined:${url}`);
    $done({});
}
if (url.includes("jump/mainweb/v3")) {
    console.log('mainweb/v3');
    if (body.data?.length) {
        body.data.forEach((item) => {
            console.log(`去除不需要的菜单栏:${item.webTitle}`);
        })
        body.data = [];
    }
} else {
    $notification.post(notifyTitle, "路径匹配错误:", url);
}
body = JSON.stringify(body);
$done({
    body
});