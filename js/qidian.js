let url = $request.url;
let method = $request.method;
if (!$response.body) {
    console.log(`$response.body为undefined:${url}`);
    $done({});
}

let body = JSON.parse($response.body);

const noticeTitle = "起点App脚本错误";
const getMethod = "GET";
const postMethod = "POST";

if (!body.Data) {
    console.log(`body:${$response.body}`);
    $notification.post(noticeTitle, "起点", "Data为空");
} else {
    if (url.includes("v4/client/getsplashscreen") && method === getMethod) {
        console.log('起点-开屏页');
        if (!body.Data.List) {
            console.log(`body:${$response.body}`);
            $notification.post(noticeTitle, "起点", "List字段空");
        } else {
            body.Data.List = null;
            console.log('List成功');
        }
        if ('EnableGDT' in body.Data) {
            if (body.Data.EnableGDT === 1) {
                body.Data.EnableGDT = 0;
                console.log('EnableGDT成功');
            } else {
                console.log('无需修改EnableGDT');
            }
        } else {
            console.log(`body:${$response.body}`);
            $notification.post(noticeTitle, "起点", "EnableGDT字段为空");
        }

    } else if (url.includes("v2/deeplink/geturl") && method === getMethod) {
        console.log(`起点-不跳转精选页:${body.Data.ActionUrl}`);
        if (body.Data.ActionUrl) {
            // QDReader://Bookstore
            // QDReader://Bookstore?query={"abGroupId": "b", "lastReadBarEnabled": "1"}
            console.log('成功');
            body.Data.ActionUrl = '';
        } else {
            console.log('无需处理');
        }
    } else if (url.includes("v1/adv/getadvlistbatch?positions=iOS_tab") && method === getMethod) {
        console.log('起点-iOS_tab');
        if (!body.Data.iOS_tab) {
            console.log(`body:${$response.body}`);
            $notification.post(noticeTitle, "起点-iOS_tab", "iOS_tab字段为空");
        } else {
            if (body.Data.iOS_tab.length === 0) {
                console.log('返回配置空');
            } else {
                body.Data.iOS_tab = [];
                console.log('成功');
            }
        }
    } else if (url.includes("v2/dailyrecommend/getdailyrecommend") && method === getMethod) {
        console.log('起点-每日导读');
        if (body.Data.Items?.length) {
            body.Data.Items = [];
            console.log('成功');
        } else {
            console.log('每日导读无数据');
        }
    } else if (url.includes("v1/bookshelf/getHoverAdv") && method === getMethod) {
        console.log('起点-书架悬浮广告');
        if (body.Data.ItemList?.length) {
            console.log('成功' + body.Data.ItemList.length);
            body.Data.ItemList = [];
        } else {
            console.log('无需处理');
        }
    } else if (url.includes("v1/client/getconf") && method === postMethod) {
        console.log('起点-client/getconf');
        // 精选 和 发现 中间的活动配置
        if (!body.Data.ActivityPopup?.Data) {
            console.log(`body:${$response.body}`);
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
        if(body.Data.CloudSetting?.TeenShowFreq === '1'){
            body.Data.CloudSetting.TeenShowFreq = '0';
            console.log('去除青少年模式弹框');
        }
        // QDReader://Bookshelf 书架右下角悬浮活动
        if (body.Data.ActivityIcon?.Type !== 0) {
            console.log(`body:${$response.body}`);
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
        if (body.Data.EnableSearchUser === "1") {
            console.log(`无需修改搜索用户配置`);
        } else {
            body.Data.EnableSearchUser = "1";
            console.log(`允许搜索用户成功:${body.Data.EnableSearchUser}`);
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

