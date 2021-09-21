let headers = $response.headers;
let status = $response.status;

const htmlStr = $response.body;
const startStr = 'var cgiData = ';
const str = htmlStr.substring(htmlStr.indexOf(startStr) + startStr.length, htmlStr.indexOf('</script>'));
const cgiDataStr = str.substring(0, str.lastIndexOf(';'));
// 使用eval而不是JSON.parse,否则Surge有JSON Parse error: Invalid escape character '
const cgiData = eval(`(${cgiDataStr})`);

if (cgiData === undefined || cgiData === null || !cgiData.hasOwnProperty('url')) {
    console.log(`获取cgiData/url失败,html:${htmlStr}`);
    $notification.post('微信外链跳转', "获取cgiData/url失败", "获取cgiData/url失败");
} else {
    // &#x2f;的处理取自返回页面中js内的方法
    const url = cgiData.url.replace(/&#x2f;/g, "/").replace(/&amp;/g, "&");
    console.log(url);
    status = 302;
    headers.Location = url;
    console.log('成功');
}
$done({
    status,
    headers
});
