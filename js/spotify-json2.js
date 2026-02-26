let url = $request.url;
const method = $request.method;
console.log(`spotifyjson2-2026.02.26`);
if (!$response.body) {
    console.log(`$response.body为undefined:${url}`);
    $done({});
}
let body = JSON.parse($response.body);

if (url.includes("/device-capabilities/v1/capabilities")) {
    console.log('capabilities');
    body.effective_license = 'premium';
    //body.audio_quality = 'HIFI_24';
    if (!body.supports_hifi?.fully_supported) {
        body.supports_hifi.fully_supported = true;
    }
    if (!body.supports_hifi?.user_eligible) {
        body.supports_hifi.user_eligible = true;
    }
}

if (url.includes('com:443')) {
    url = url.replace(/com:443/, 'com');
}
body = JSON.stringify(body);
$done({
    body,
    url
});


