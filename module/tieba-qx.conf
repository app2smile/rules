# 贴吧去广告-qx(>=iOS15)
# qx加载本重写前,须同时加载对应的贴吧分流,否则不能完全去广告
# 仓库地址 https://github.com/app2smile/rules
# 开屏广告;推荐和吧内帖子列表的直播及广告;详情页直播/关联商品/广告;看图模式广告;首页和帖子详情页右下角悬浮广告;部分吧内的置顶/最新中间的广告/head图片广告/head直播

hostname = tiebac.baidu.com
^http(s:\/\/tiebac|:\/\/c\.tieba)\.baidu\.com\/(c\/f\/(frs\/(page|threadlist|generalTabList)|pb\/page|excellent\/personalized)$|tiebaads\/commonbatch|c\/s\/sync$) url script-response-body https://raw.githubusercontent.com/app2smile/rules/master/js/tieba-json.js
^http(s:\/\/tiebac|:\/\/c\.tieba)\.baidu\.com\/c\/f\/(frs\/(page|threadlist|generalTabList)|pb\/page|excellent\/personalized)\?cmd url script-response-body https://raw.githubusercontent.com/app2smile/rules/master/js/tieba-proto.js
