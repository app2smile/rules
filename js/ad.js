let url = $request.url;
let body;

if(url.indexOf("mobads.baidu.com/cpro/ui/mads.php") != -1) {
	console.log('贴吧-进入mobads');
	body = $response.body;
	body['ad'] = [];
	body = JSON.stringify(body);
} else if(url.indexOf("mi.gdt.qq.com/gdt_mview.fcg") != -1) {
	console.log('贴吧-进入qq');
	body = $response.body;
	body['data'] = null;
	body = JSON.stringify(body);
} else if(url.indexOf("api.zhihu.com/commercial_api/real_time_launch_v2") != -1) {
	console.log('进入zhihu');
	body = JSON.parse($response.body);
	let launch = JSON.parse(body['launch']);

	launch['ads'] = [];
	//launch['mobile_experiment']['ad_backPlugin'] = "0";
	//launch['mobile_experiment']['ad_bannerShow'] = "0";
	//launch['mobile_experiment']['ad_bannerView'] = "0";
	//launch['mobile_experiment']['ad_ht'] = "0";
	//launch['mobile_experiment']['ad_markPlugin'] = "0";
	//launch['mobile_experiment']['ad_new_rt'] = "0";
	//launch['mobile_experiment']['ad_pausePlugin'] = "0";
	//launch['mobile_experiment']['ad_pre_web'] = "0";
	//launch['mobile_experiment']['ad_resume_ab'] = "0";
	//launch['mobile_experiment']['new_ad_logo'] = "0";

	body = JSON.stringify({launch:JSON.stringify(launch)});
} else if(url.indexOf("magev6.if.qidian.com/argus/api/v4/client/getsplashscreen") != -1) {
	console.log('进入qidian');
	body = $response.body;
	body['Data']['List'] = null;
	body = JSON.stringify(body);
} else {
  console.log("去广告脚本:error");
}

console.log(body);
$done({body});
