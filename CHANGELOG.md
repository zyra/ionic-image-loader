<a name="4.2.1"></a>
## [4.2.1](https://github.com/zyra/ionic-image-loader/compare/v4.2.0...v4.2.1) (2017-09-07)


### Bug Fixes

* **component:** revert to Renderer class to maintain backwards compatbility ([316fcb9](https://github.com/zyra/ionic-image-loader/commit/316fcb9)), closes [#95](https://github.com/zyra/ionic-image-loader/issues/95)
* **provider:** remove platform.ready ([#96](https://github.com/zyra/ionic-image-loader/issues/96)) ([6c3b20e](https://github.com/zyra/ionic-image-loader/commit/6c3b20e))



<a name="4.2.0"></a>
# [4.2.0](https://github.com/zyra/ionic-image-loader/compare/v4.1.1...v4.2.0) (2017-09-04)


### Bug Fixes

* **image-loader:** fix webkit related issue ([#82](https://github.com/zyra/ionic-image-loader/issues/82)) ([7ff88be](https://github.com/zyra/ionic-image-loader/commit/7ff88be)), closes [#80](https://github.com/zyra/ionic-image-loader/issues/80)


### Features

* **image-loader:** allow setting FileTransfer options ([6802a9b](https://github.com/zyra/ionic-image-loader/commit/6802a9b)), closes [#88](https://github.com/zyra/ionic-image-loader/issues/88)
* **img-loader:** allow adding content inside the image box ([366d42e](https://github.com/zyra/ionic-image-loader/commit/366d42e))



<a name="4.1.1"></a>
## [4.1.1](https://github.com/zyra/ionic-image-loader/compare/v4.1.0...v4.1.1) (2017-07-16)


### Bug Fixes

* **ImageLoader Provider:** do not attempt to fetch invalid url ([43223d8](https://github.com/zyra/ionic-image-loader/commit/43223d8)), closes [#76](https://github.com/zyra/ionic-image-loader/issues/76)



<a name="4.1.0"></a>
# [4.1.0](https://github.com/zyra/ionic-image-loader/compare/v4.0.2...v4.1.0) (2017-07-16)


### Features

* **ImageLoader Provider:** re-use FileTransferObject instances ([072da6c](https://github.com/zyra/ionic-image-loader/commit/072da6c)), closes [#79](https://github.com/zyra/ionic-image-loader/issues/79)



<a name="4.0.2"></a>
## [4.0.2](https://github.com/zyra/ionic-image-loader/compare/v4.0.1...v4.0.2) (2017-07-16)


### Bug Fixes

* revert [#61](https://github.com/zyra/ionic-image-loader/issues/61) to fix major issues ([3d7c204](https://github.com/zyra/ionic-image-loader/commit/3d7c204))



<a name="4.0.1"></a>
## [4.0.1](https://github.com/zyra/ionic-image-loader/compare/v4.0.0...v4.0.1) (2017-07-15)


### Bug Fixes

* add platform is cordova check for ionic serve / browser usage ([#78](https://github.com/zyra/ionic-image-loader/issues/78)) ([a42d1d8](https://github.com/zyra/ionic-image-loader/commit/a42d1d8))



<a name="4.0.0"></a>
# [4.0.0](https://github.com/zyra/ionic-image-loader/compare/v3.2.1...v4.0.0) (2017-07-12)


### Bug Fixes

* add URL resolver ([#61](https://github.com/zyra/ionic-image-loader/issues/61)) ([da78d60](https://github.com/zyra/ionic-image-loader/commit/da78d60))
* use deviceready and fix data:null issue ([#55](https://github.com/zyra/ionic-image-loader/issues/55)) ([fe1dca4](https://github.com/zyra/ionic-image-loader/commit/fe1dca4))
* **core:** update to use ionic-native v4 ([0b14443](https://github.com/zyra/ionic-image-loader/commit/0b14443)), closes [#74](https://github.com/zyra/ionic-image-loader/issues/74)


### BREAKING CHANGES

* **core:** this module no longer supports Ionic Native 3.x



<a name="3.2.1"></a>
## [3.2.1](https://github.com/zyra/ionic-image-loader/compare/3.2.0...v3.2.1) (2017-05-24)


### Features

* add fallback to img tag when loaded in browser ([#45](https://github.com/zyra/ionic-image-loader/issues/45)) ([ad049a9](https://github.com/zyra/ionic-image-loader/commit/ad049a9))
* handle ionic WKWebView better ([b17e182](https://github.com/zyra/ionic-image-loader/commit/b17e182))



<a name="3.1.1"></a>
## [3.1.1](https://github.com/zyra/ionic-image-loader/compare/v3.0.0...v3.1.1) (2017-04-20)


### Bug Fixes

* **image-loader:** create both cache directories independently ([#40](https://github.com/zyra/ionic-image-loader/issues/40)) ([a9c330f](https://github.com/zyra/ionic-image-loader/commit/a9c330f))
* **image-loader:** use tempDirectory on iOS ([#39](https://github.com/zyra/ionic-image-loader/issues/39)) ([f29d630](https://github.com/zyra/ionic-image-loader/commit/f29d630))


### Features

* ability to use fallbackUrl as placeholder instead of spinner ([#36](https://github.com/zyra/ionic-image-loader/issues/36)) ([c2686c7](https://github.com/zyra/ionic-image-loader/commit/c2686c7))
* add ability to customize spinner ([5d0566d](https://github.com/zyra/ionic-image-loader/commit/5d0566d)), closes [#38](https://github.com/zyra/ionic-image-loader/issues/38)



<a name="3.0.0"></a>
# [3.0.0](https://github.com/zyra/ionic-image-loader/compare/v2.0.2...v3.0.0) (2017-04-04)


### Bug Fixes

* remove BrowserModule import ([508e8cc](https://github.com/zyra/ionic-image-loader/commit/508e8cc))


### Features

* add forRoot method for module ([6881a1f](https://github.com/zyra/ionic-image-loader/commit/6881a1f))



<a name="2.0.2"></a>
## [2.0.2](https://github.com/zyra/ionic-image-loader/compare/v1.6.0...v2.0.2) (2017-03-22)


### Bug Fixes

* always use getCachedImagePath to get image path ([#25](https://github.com/zyra/ionic-image-loader/issues/25)) ([09ed878](https://github.com/zyra/ionic-image-loader/commit/09ed878))
* **image-loader:** delete one file at once to maintain cache size ([f37f1e9](https://github.com/zyra/ionic-image-loader/commit/f37f1e9))
* **image-loader:** delete one file at once to maintain cache size ([09871bd](https://github.com/zyra/ionic-image-loader/commit/09871bd))
* **image-loader:** ignore errors when maintaining cache size ([4c14ee6](https://github.com/zyra/ionic-image-loader/commit/4c14ee6))
* **image-loader:** trust all hosts ([6411b1c](https://github.com/zyra/ionic-image-loader/commit/6411b1c)), closes [#23](https://github.com/zyra/ionic-image-loader/issues/23)
* **img-loader:** center align spinner ([8655454](https://github.com/zyra/ionic-image-loader/commit/8655454))


### Features

* **img-loader:** add load output ([981dc69](https://github.com/zyra/ionic-image-loader/commit/981dc69)), closes [#24](https://github.com/zyra/ionic-image-loader/issues/24)
* use ion-spinner and ionic native v3 ([50b6b7b](https://github.com/zyra/ionic-image-loader/commit/50b6b7b))



<a name="1.6.0"></a>
# [1.6.0](https://github.com/zyra/ionic-image-loader/compare/v1.4.0...v1.6.0) (2017-02-17)


### Bug Fixes

* fixes code that prevents caching ([8476f6b](https://github.com/zyra/ionic-image-loader/commit/8476f6b)), closes [#13](https://github.com/zyra/ionic-image-loader/issues/13)


### Features

* **core:** maximum cache size and age ([d49f69a](https://github.com/zyra/ionic-image-loader/commit/d49f69a)), closes [#14](https://github.com/zyra/ionic-image-loader/issues/14)
* **image-loader-config:** add setMaximumCacheSize and setMaximumCacheAge ([c9e5fae](https://github.com/zyra/ionic-image-loader/commit/c9e5fae))
* **img-loader:** ability to disable caching and update images ([0cc2c22](https://github.com/zyra/ionic-image-loader/commit/0cc2c22))



<a name="1.4.0"></a>
# [1.4.0](https://github.com/zyra/ionic-image-loader/compare/v1.3.0...v1.4.0) (2017-02-07)


### Bug Fixes

* **image-loader:** only clear cache on Cordova platform ([61a5032](https://github.com/zyra/ionic-image-loader/commit/61a5032))


### Features

* **image-loader:** add preload method ([a83f143](https://github.com/zyra/ionic-image-loader/commit/a83f143)), closes [#16](https://github.com/zyra/ionic-image-loader/issues/16)



<a name="1.3.0"></a>
# [1.3.0](https://github.com/zyra/ionic-image-loader/compare/v1.2.0...v1.3.0) (2017-01-18)


### Features

* read cached images as base64 encoded strings for iOS/WkWebView ([#12](https://github.com/zyra/ionic-image-loader/issues/12)) ([4b612a2](https://github.com/zyra/ionic-image-loader/commit/4b612a2))



<a name="1.2.0"></a>
# [1.2.0](https://github.com/zyra/ionic-image-loader/compare/v1.1.0...v1.2.0) (2016-12-30)


### Features

* add clearCache method ([6bcc799](https://github.com/zyra/ionic-image-loader/commit/6bcc799))



<a name="1.1.0"></a>
# [1.1.0](https://github.com/zyra/ionic-image-loader/compare/v1.0.0...v1.1.0) (2016-12-30)


### Bug Fixes

* useImg can be used without setting value to true ([d91d35a](https://github.com/zyra/ionic-image-loader/commit/d91d35a)), closes [#7](https://github.com/zyra/ionic-image-loader/issues/7)


### Features

* implement queue mechanisim ([51c2e35](https://github.com/zyra/ionic-image-loader/commit/51c2e35))



<a name="1.0.0"></a>
# [1.0.0](https://github.com/zyra/ionic-image-loader/compare/v0.4.1...v1.0.0) (2016-11-24)


### Bug Fixes

* **image-loader-spinner:** make spinner responsive and use svg ([e2616c3](https://github.com/zyra/ionic-image-loader/commit/e2616c3))
* use fallback image if image fails to load ([#6](https://github.com/zyra/ionic-image-loader/issues/6)) ([d57f395](https://github.com/zyra/ionic-image-loader/commit/d57f395))



<a name="0.4.1"></a>
## [0.4.1](https://github.com/zyra/ionic-image-loader/compare/v0.4.0...v0.4.1) (2016-10-13)


### Bug Fixes

* show spinner only if spinner property is true ([ebc8b1d](https://github.com/zyra/ionic-image-loader/commit/ebc8b1d))



<a name="0.4.0"></a>
# [0.4.0](https://github.com/zyra/ionic-image-loader/compare/2ad79ad...v0.4.0) (2016-10-13)


### Bug Fixes

* export all from index ([2ad79ad](https://github.com/zyra/ionic-image-loader/commit/2ad79ad))


### Features

* almost stable provider with full functionality ([810bc32](https://github.com/zyra/ionic-image-loader/commit/810bc32))
* extend global config and add fallback image ([72a2a37](https://github.com/zyra/ionic-image-loader/commit/72a2a37))



