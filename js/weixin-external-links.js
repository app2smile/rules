let headers = $response.headers;
let status = $response.status;

const htmlStr = $response.body;
const startStr = 'var cgiData = ';
const str = htmlStr.substring(htmlStr.indexOf(startStr) + startStr.length, htmlStr.indexOf('</script>'));
const cgiDataStr = str.substring(0, str.lastIndexOf(';'));
// 使用eval而不是JSON.parse,否则Surge有JSON Parse error: Invalid escape character '
const cgiData = eval(`(${cgiDataStr})`);

if (cgiData === undefined || cgiData === null) {
    console.log(`获取cgiData失败,html:${htmlStr}`);
    $notification.post('微信外链跳转', "获取cgiData失败", "");
} else {
    if (cgiData.hasOwnProperty('type')) {
        console.log('type:' + cgiData.type);
        if (cgiData.type === 'empty') {
            if (cgiData.hasOwnProperty('desc')) {
                process(cgiData.desc);
            } else {
                console.log(`获取desc失败,html:${htmlStr}`);
                $notification.post('微信外链跳转', "empty获取desc失败", "");
            }
        } else if (cgiData.type === 'newgray') {
            if (cgiData.hasOwnProperty('url')) {
                process(cgiData.url);
            } else {
                console.log(`获取url失败,html:${htmlStr}`);
                $notification.post('微信外链跳转', "newgray获取url失败", "");
            }
        } else {
            console.log(`未匹配到type,html:${htmlStr}`);
            $notification.post('微信外链跳转', "未匹配到type", "");
        }
    } else {
        console.log(`获取type失败,html:${htmlStr}`);
        $notification.post('微信外链跳转', "获取type失败", "");
    }
}

$done({
    status,
    headers
});


function process(url) {
    // &#x2f;的处理取自返回页面中js内的方法
    const replaceUrl = url.replace(/&#x2f;/g, "/").replace(/&amp;/g, "&");
    console.log(replaceUrl);
    status = 302;
    headers.Location = replaceUrl;
    console.log('成功');
}
