let headers = $request.headers;
delete headers['if-none-match'];
console.log('2025.03.20-qx-spotify删除请求头')
$done({headers});
