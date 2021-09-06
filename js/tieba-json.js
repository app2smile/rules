/*
^(http\:\/\/c\.tieba\.baidu\.com\/tiebaads\/commonbatch|https\:\/\/afd\.baidu\.com\/afd\/entry)
* 贴吧开屏页正则
^https\:\/\/afd\.baidu\.com\/afd\/entry
贴吧看图模式下面出现的picbanner广告
^http\:\/\/c\.tieba\.baidu\.com\/tiebaads\/commonbatch
* */
let url = $request.url;
let method = $request.method;
let body = JSON.parse($response.body);

let notifiTitle = "去广告脚本错误";
let getMethod = "GET";
let postMethod = "POST";

if (url.indexOf("afd.baidu.com/afd/entry") != -1 && method == getMethod) {
    console.log('贴吧-开屏页');
    if (body.res == undefined || body.res.splash == undefined) {
        console.log("body:" + $response.body);
        $notification.post(notifiTitle, "贴吧-afd", "res-splash字段为undefined");
    } else {
        body.res.splash = null;
        console.log('成功');
    }
} else if (url.indexOf("c.tieba.baidu.com/tiebaads/commonbatch") != -1 && method == postMethod) {
    let adCmd = getUrlParamValue(url, "adcmd");
    if (adCmd == null) {
        console.log("url:" + url);
        $notification.post(notifiTitle, "贴吧-tiebaads/commonbatch", "adCmd参数为null");
    } else {
        console.log('tiebaads/commonbatch,adCmd = ' + adCmd);
        if (body.error_code == 0) {
            if (body.res.ad === undefined) {
                console.log('ad字段为undefined');
            } else if (body.res.ad.length == 0) {
                console.log('ad字段为空');
            } else {
                body.res.ad = [];
                console.log('成功');
            }
        } else {
            console.log('error_code不为0:' + body.error_code);
        }
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
