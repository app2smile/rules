const method = $request.method;
const url = $request.url;
const status = $response.status;
let headers = $response.headers;
const notifiTitle = "百度搜索防跳转AppStore错误";

if (method !== "GET" || status !== 302 || !headers.hasOwnProperty('Location')) {
    console.log(`method:${method},status:${status},url:${url}`);
    $notification.post(notifiTitle, "百度防跳转AppStore", "method/status有误");
} else {
    if (headers.Location.indexOf('.apple.com') !== -1) {
        let tokenData = getUrlParamValue(url, 'tokenData');
        if (tokenData == null) {
            console.log(`未获取到tokenData,url:${url}`);
            $notification.post(notifiTitle, "getUrlParamValue", "未获取到tokenData");
        } else {
            let tokenDataObj = JSON.parse(decodeURIComponent(tokenData));
            headers.Location = tokenDataObj.url;
            console.log('成功');
        }
    } else {
        console.log('无需修改Location');
    }
}
$done({
    headers
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
