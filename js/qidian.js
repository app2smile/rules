let url = $request.url;
let method = $request.method;
let body = JSON.parse($response.body);

const noticeTitle = "起点App脚本错误";
const getMethod = "GET";
const postMethod = "POST";

if (!body.Data) {
    console.log("body:" + $response.body);
    $notification.post(noticeTitle, "起点", "Data为空");
} else {
    if (url.indexOf("v4/client/getsplashscreen") !== -1 && method === getMethod) {
        console.log('起点-开屏页');
        if (!body.Data.List) {
            console.log("body:" + $response.body);
            $notification.post(noticeTitle, "起点", "List字段空");
        } else {
            body.Data.List = null;
            console.log('List成功');
        }
        if (body.Data.hasOwnProperty('EnableGDT')) {
            if (body.Data.EnableGDT === 1) {
                body.Data.EnableGDT = 0;
                console.log('EnableGDT成功');
            } else {
                console.log('无需修改EnableGDT');
            }
        } else {
            console.log("body:" + $response.body);
            $notification.post(noticeTitle, "起点", "EnableGDT字段为空");
        }

    } else if (url.indexOf("v2/deeplink/geturl") !== -1 && method === getMethod) {
        console.log('起点-不跳转精选页');
        if (body.Data.hasOwnProperty('ActionUrl') && body.Data.ActionUrl === 'QDReader://Bookstore') {
            body.Data = null;
            console.log('成功');
        } else {
            console.log('无需处理,body:' + $response.body);
        }
    } else if (url.indexOf("v1/adv/getadvlistbatch?positions=iOS_tab") !== -1 && method === getMethod) {
        console.log('起点-iOS_tab');
        if (!body.Data.iOS_tab) {
            console.log("body:" + $response.body);
            $notification.post(noticeTitle, "起点-iOS_tab", "iOS_tab字段为空");
        } else {
            if (body.Data.iOS_tab.length === 0) {
                console.log('返回配置空');
            } else {
                body.Data.iOS_tab = [];
                console.log('成功');
            }
        }
    } else if (url.indexOf("v1/dailyrecommend/getdailyrecommend") !== -1 && method === getMethod) {
        // 需全新应用
        console.log('起点-每日导读');
        if (body.Data.length !== 0) {
            body.Data = [];
            console.log('成功');
        } else {
            console.log('每日导读无数据');
        }
    } else if (url.indexOf("v1/client/getconf") !== -1 && method === postMethod) {
        console.log('起点-getconf');
        // 精选 和 发现 中间的活动配置
        if (!body.Data.hasOwnProperty('ActivityPopup') || !body.Data.ActivityPopup.hasOwnProperty('Data')) {
            console.log("body:" + $response.body);
            $notification.post(noticeTitle, "起点-getconf", "ActivityPopup/Data字段为空");
        } else {
            body.Data.ActivityPopup = null;
            console.log('ActivityPopup(活动弹窗)成功');
        }
        if (body.Data.WolfEye === 1) {
            // 使5.9.196版本 tcp强制走https
            console.log('WolfEye修改为0');
            body.Data.WolfEye = 0;
        } else {
            console.log(`无需修改WolfEye:${body.Data.WolfEye}`);
        }

        // QDReader://Bookshelf 书架右下角悬浮活动
        if (!body.Data.hasOwnProperty('ActivityIcon') || body.Data.ActivityIcon.Type !== 0) {
            console.log("body:" + $response.body);
            $notification.post(noticeTitle, "起点-getconf", "ActivityIcon/Type字段错误");
        } else {
            // 无活动icon的情况下为{"EndTime":0,"StartTime":0,"Type":0}
            if (body.Data.ActivityIcon.EndTime === 0) {
                console.log('无ActivityIcon配置');
            } else {
                body.Data.ActivityIcon.StartTime = 0;
                body.Data.ActivityIcon.EndTime = 0;
                delete body.Data.ActivityIcon.Actionurl;
                delete body.Data.ActivityIcon.Icon;
                console.log('ActivityIcon成功');
            }
        }

        // 功能增强:搜索页可以搜索用户
        if (body.Data.EnableSearchUser !== "0") {
            console.log("body:" + $response.body);
            $notification.post(noticeTitle, "起点-getconf", "EnableSearchUser字段错误");
        } else {
            body.Data.EnableSearchUser = "1";
            console.log('允许搜索用户成功');
        }

        // if (body.Data.hasOwnProperty('EnableClipboardReading')) {
        //     if (body.Data.EnableClipboardReading === 1) {
        //         body.Data.EnableClipboardReading = 0;
        //         console.log('不允许读取剪切板');
        //     } else {
        //         console.log('无需修改剪切板配置');
        //     }
        // } else {
        //     console.log("body:" + $response.body);
        //     $notification.post(notifiTitle, "起点-getconf", "EnableClipboardReading字段错误");
        // }
        // QDReader://UserCenter   我
        // QDReader://Bookshelf    书架
        // QDReader://Bookstore    精选
    } else {
        $notification.post(noticeTitle, "起点App路径/请求方法匹配错误:", method + "," + url);
    }
}
body = JSON.stringify(body);

$done({
    body
});

