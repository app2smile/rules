# 目录
- [广告联盟](#广告联盟)
- [知乎](#知乎)
- [vgTime](#vgtime)
- [腾讯新闻](#腾讯新闻)
- [起点](#起点)
- [Spotify](#spotify)
- [Spotify歌词翻译](#spotify歌词翻译)
- [哔哩哔哩](#哔哩哔哩)
- [贴吧](#贴吧)
- [YouTube](#youTube)

**_点击下方各自链接,查看能去哪些广告_**

## 广告联盟
> 快手联盟,优量汇,穿山甲

| 软件 | 链接 |
| :-----| :---- |
| Surge | https://raw.githubusercontent.com/app2smile/rules/master/module/adsense.sgmodule |
| Loon | https://raw.githubusercontent.com/app2smile/rules/master/plugin/adsense.plugin |
| qx | Rewrite:https://raw.githubusercontent.com/app2smile/rules/master/module/adsense.conf |

## 知乎
| 软件 | 链接 |
| :-----| :---- |
| Surge | https://raw.githubusercontent.com/app2smile/rules/master/module/zhihu.sgmodule |
| Loon | https://raw.githubusercontent.com/app2smile/rules/master/plugin/zhihu.plugin |
| qx | Filter:https://raw.githubusercontent.com/app2smile/rules/master/rule/zhihu-ad-qx.list  <br> Rewrite:https://raw.githubusercontent.com/app2smile/rules/master/module/zhihu.conf |

## vgTime
> 去开屏广告需要全新应用  
> 若要去新闻列表穿山甲的广告需要搭配`广告联盟`模块

| 软件 | 链接 |
| :-----| :---- |
| Surge | https://raw.githubusercontent.com/app2smile/rules/master/module/vgtime.sgmodule |
| Loon | https://raw.githubusercontent.com/app2smile/rules/master/plugin/vgtime.plugin |
| qx | Rewrite:https://raw.githubusercontent.com/app2smile/rules/master/module/vgtime.conf |

## 腾讯新闻
> 去开屏广告需要全新应用

| 软件 | 链接 |
| :-----| :---- |
| Surge | https://raw.githubusercontent.com/app2smile/rules/master/module/qqnews.sgmodule |
| Loon | https://raw.githubusercontent.com/app2smile/rules/master/plugin/qqnews.plugin |
| qx | Rewrite:https://raw.githubusercontent.com/app2smile/rules/master/module/qqnews.conf |


## 起点
> Loon和Surge均支持对tcp链接进行解密,可以完美去广告(Loon无需额外设置,Surge需打开`MITM`的`用于TCP链接`,否则需全程开启Surge)  
> qx目前不支持对TCP链接进行MITM,需全程开启代理软件

去广告无效的解决办法(任选其一):
1. (推荐,*仅限Surge*): 打开Surge -> MITM的`配置根证书` -> `用于TCP链接` (保持开启状态), 然后杀掉起点app后台再重新打开一次. 随后就可以关闭`用于TCP链接`开关)
2. (*仅限Surge*): 若对自己手机上已MITM的域名比较了解,可以始终打开Surge -> MITM的`配置根证书` -> `用于TCP链接`
3. qx: 目前只能删除起点app,重新下载安装使用

| 软件 | 链接 |
| :-----| :---- |
| Surge | https://raw.githubusercontent.com/app2smile/rules/master/module/qidian.sgmodule |
| Loon | https://raw.githubusercontent.com/app2smile/rules/master/plugin/qidian.plugin |
| qx | Rewrite:https://raw.githubusercontent.com/app2smile/rules/master/module/qidian.conf |


## Spotify
> 需要系统版本>=iOS15  
> Spotify音质不能设置为超高

| 软件 | 链接 |
| :-----| :---- |
| Surge | https://raw.githubusercontent.com/app2smile/rules/master/module/spotify.module |
| Loon | https://raw.githubusercontent.com/app2smile/rules/master/plugin/spotify.plugin |
| qx | Rewrite:https://raw.githubusercontent.com/app2smile/rules/master/module/spotify.conf |


## Spotify歌词翻译
> https://raw.githubusercontent.com/app2smile/rules/master/js/spotify-lyric.js


## 哔哩哔哩
> 需要系统版本>=iOS15

| 软件 | 链接 |
| :-----| :---- |
| Surge | https://raw.githubusercontent.com/app2smile/rules/master/module/bilibili.sgmodule |
| Loon | https://raw.githubusercontent.com/app2smile/rules/master/plugin/bilibili.plugin |
| qx | Filter:https://raw.githubusercontent.com/app2smile/rules/master/rule/bilibili-ad-qx.list  <br> Rewrite:https://raw.githubusercontent.com/app2smile/rules/master/module/bilibili-qx.conf |


## 贴吧
> 需要系统版本>=iOS15

| 软件 | 链接 |
| :-----| :---- |
| Surge | https://raw.githubusercontent.com/app2smile/rules/master/module/tieba.sgmodule |
| Loon | https://raw.githubusercontent.com/app2smile/rules/master/plugin/tieba.plugin |
| qx | Filter:https://raw.githubusercontent.com/app2smile/rules/master/rule/tieba-ad-qx.list  <br> Rewrite:https://raw.githubusercontent.com/app2smile/rules/master/module/tieba-qx.conf |


## YouTube
> 需要系统版本>=iOS15

| 软件 | 链接                                                                                                                                                                                  |
| :-----|:------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Surge | https://raw.githubusercontent.com/app2smile/rules/master/module/youtube.sgmodule                                                                                                    |
| Loon | https://raw.githubusercontent.com/app2smile/rules/master/plugin/youtube.plugin                                                                                                      |
| qx | Rewrite:https://raw.githubusercontent.com/app2smile/rules/master/module/youtube-qx.conf   |

