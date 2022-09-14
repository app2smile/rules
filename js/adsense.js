const url = $request.url;
const method = $request.method;
if (!$response.body) {
    // 穿山甲有概率会有此情况
    console.log('$response.body为空');
    $done({});
}
let body = JSON.parse($response.body);

const getMethod = "GET";
const postMethod = "POST";
const noticeTitle = "广告联盟";

if ((url.includes("api-access.pangolin-sdk-toutiao.com/api/ad/union/sdk")
        || url.includes("is.snssdk.com/api/ad/union/sdk"))
    && method === postMethod) {
    console.log('穿山甲-get_ads');
    if (!body.message) {
        console.log(`body:${$response.body}`);
        // 错误码 https://www.csjplatform.com/supportcenter/5421
        if (!('status_code' in body)) {
            $notification.post(noticeTitle, "穿山甲", "message/status_code字段错误");
        } else {
            console.log('广告为空');
        }
    } else {
        console.log(Object.keys(body));
        body = {
            "request_id": 'F5617E54-3FF4-4052-9B09-4227D09B5105',
            "status_code": 20001,
            "reason": 112,
            "desc": "该代码位请求量过大且消耗过低，因此填充率控制在10%以内，该策略每日生效，如果当天该代码位的消耗上涨或请求量小于5000，则次日不会命中该策略"
        };
        console.log('成功');
    }
} else if (url.includes('mi.gdt.qq.com') && method === getMethod) {
    console.log('优量汇');
    if ('ret' in body) {
        if (body.ret === 0) {
            // https://developers.adnet.qq.com/doc/android/union/union_debug#sdk%20%E9%94%99%E8%AF%AF%E7%A0%81
            body.ret = 102006;
            console.log('修改ret成功');
        } else {
            console.log(`ret不为0,不处理`);
        }
    } else {
        console.log(`body:${$response.body}`);
        $notification.post(noticeTitle, "优量汇", "无ret");
    }
} else if (url.includes('open.e.kuaishou.com') && method === postMethod) {
    console.log('快手联盟');
    if (body.result === 1) {
        // 错误码: https://u.kuaishou.com/home/detail/1158
        body.result = 40003;
        console.log('修改result成功');
    } else {
        console.log('无需修改result');
    }
} else {
    $notification.post(noticeTitle, "路径/请求方法匹配错误:", method + "," + url);
}

body = JSON.stringify(body);

$done({
    body
});
