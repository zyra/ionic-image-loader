import { Injectable } from '@angular/core';
var ImageLoaderConfig = (function () {
    function ImageLoaderConfig() {
        this.debugMode = false;
        this.spinnerEnabled = true;
        this.fallbackAsPlaceholder = false;
        this.backgroundSize = 'contain';
        this.backgroundRepeat = 'no-repeat';
        this.display = 'block';
        this.width = '100%';
        this.height = '100%';
        this.useImg = false;
        this.concurrency = 5;
        this.maxCacheSize = -1;
        this.maxCacheAge = -1;
        this.imageReturnType = 'uri';
        this.fileNameCachedWithExtension = false;
        this.fallbackFileNameCachedExtension = '.jpg';
        this.cacheDirectoryType = 'cache';
        this._cacheDirectoryName = 'image-loader-cache';
    }
    Object.defineProperty(ImageLoaderConfig.prototype, "cacheDirectoryName", {
        get: function () {
            return this._cacheDirectoryName;
        },
        set: function (name) {
            name.replace(/\W/g, '');
            this._cacheDirectoryName = name;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Enables debug mode to receive console logs, errors, warnings
     */
    /**
       * Enables debug mode to receive console logs, errors, warnings
       */
    ImageLoaderConfig.prototype.enableDebugMode = /**
       * Enables debug mode to receive console logs, errors, warnings
       */
    function () {
        this.debugMode = true;
    };
    /**
     * Enable/Disable the spinner by default. Defaults to true.
     * @param {boolean} enable set to true to enable
     */
    /**
       * Enable/Disable the spinner by default. Defaults to true.
       * @param {boolean} enable set to true to enable
       */
    ImageLoaderConfig.prototype.enableSpinner = /**
       * Enable/Disable the spinner by default. Defaults to true.
       * @param {boolean} enable set to true to enable
       */
    function (enable) {
        this.spinnerEnabled = enable;
    };
    /**
     * Enable/Disable the fallback image as placeholder instead of the spinner. Defaults to false.
     * @param {boolean} enable set to true to enable
     */
    /**
       * Enable/Disable the fallback image as placeholder instead of the spinner. Defaults to false.
       * @param {boolean} enable set to true to enable
       */
    ImageLoaderConfig.prototype.enableFallbackAsPlaceholder = /**
       * Enable/Disable the fallback image as placeholder instead of the spinner. Defaults to false.
       * @param {boolean} enable set to true to enable
       */
    function (enable) {
        this.fallbackAsPlaceholder = enable;
    };
    /**
     * Sets the cache directory name. Defaults to 'image-loader-cache'
     * @param {string} name name of directory
     */
    /**
       * Sets the cache directory name. Defaults to 'image-loader-cache'
       * @param {string} name name of directory
       */
    ImageLoaderConfig.prototype.setCacheDirectoryName = /**
       * Sets the cache directory name. Defaults to 'image-loader-cache'
       * @param {string} name name of directory
       */
    function (name) {
        this.cacheDirectoryName = name;
    };
    /**
     * Set default height for images that are not using <img> tag
     * @param {string} height height
     */
    /**
       * Set default height for images that are not using <img> tag
       * @param {string} height height
       */
    ImageLoaderConfig.prototype.setHeight = /**
       * Set default height for images that are not using <img> tag
       * @param {string} height height
       */
    function (height) {
        this.height = height;
    };
    /**
     * Set default width for images that are not using <img> tag
     * @param {string} width Width
     */
    /**
       * Set default width for images that are not using <img> tag
       * @param {string} width Width
       */
    ImageLoaderConfig.prototype.setWidth = /**
       * Set default width for images that are not using <img> tag
       * @param {string} width Width
       */
    function (width) {
        this.width = width;
    };
    /**
     * Enable display mode for images that are not using <img> tag
     * @param {string} display Display mode
     */
    /**
       * Enable display mode for images that are not using <img> tag
       * @param {string} display Display mode
       */
    ImageLoaderConfig.prototype.setDisplay = /**
       * Enable display mode for images that are not using <img> tag
       * @param {string} display Display mode
       */
    function (display) {
        this.display = display;
    };
    /**
     * Use <img> tag by default
     * @param {boolean} use set to true to use <img> tag by default
     */
    /**
       * Use <img> tag by default
       * @param {boolean} use set to true to use <img> tag by default
       */
    ImageLoaderConfig.prototype.useImageTag = /**
       * Use <img> tag by default
       * @param {boolean} use set to true to use <img> tag by default
       */
    function (use) {
        this.useImg = use;
    };
    /**
     * Set default background size for images that are not using <img> tag
     * @param {string} backgroundSize Background size
     */
    /**
       * Set default background size for images that are not using <img> tag
       * @param {string} backgroundSize Background size
       */
    ImageLoaderConfig.prototype.setBackgroundSize = /**
       * Set default background size for images that are not using <img> tag
       * @param {string} backgroundSize Background size
       */
    function (backgroundSize) {
        this.backgroundSize = backgroundSize;
    };
    /**
     * Set background repeat for images that are not using <img> tag
     * @param {string} backgroundRepeat Background repeat
     */
    /**
       * Set background repeat for images that are not using <img> tag
       * @param {string} backgroundRepeat Background repeat
       */
    ImageLoaderConfig.prototype.setBackgroundRepeat = /**
       * Set background repeat for images that are not using <img> tag
       * @param {string} backgroundRepeat Background repeat
       */
    function (backgroundRepeat) {
        this.backgroundRepeat = backgroundRepeat;
    };
    /**
     * Set fallback URL to use when image src is undefined or did not resolve.
     * This image will not be cached. This should ideally be a locally saved image.
     * @param {string} fallbackUrl The remote or local URL of the image
     */
    /**
       * Set fallback URL to use when image src is undefined or did not resolve.
       * This image will not be cached. This should ideally be a locally saved image.
       * @param {string} fallbackUrl The remote or local URL of the image
       */
    ImageLoaderConfig.prototype.setFallbackUrl = /**
       * Set fallback URL to use when image src is undefined or did not resolve.
       * This image will not be cached. This should ideally be a locally saved image.
       * @param {string} fallbackUrl The remote or local URL of the image
       */
    function (fallbackUrl) {
        this.fallbackUrl = fallbackUrl;
    };
    /**
     * Set the maximum number of allowed connections at the same time.
     * @param {number} concurrency
     */
    /**
       * Set the maximum number of allowed connections at the same time.
       * @param {number} concurrency
       */
    ImageLoaderConfig.prototype.setConcurrency = /**
       * Set the maximum number of allowed connections at the same time.
       * @param {number} concurrency
       */
    function (concurrency) {
        this.concurrency = concurrency;
    };
    /**
     * Sets the maximum allowed cache size
     * @param {number} cacheSize Cache size in bytes
     */
    /**
       * Sets the maximum allowed cache size
       * @param {number} cacheSize Cache size in bytes
       */
    ImageLoaderConfig.prototype.setMaximumCacheSize = /**
       * Sets the maximum allowed cache size
       * @param {number} cacheSize Cache size in bytes
       */
    function (cacheSize) {
        this.maxCacheSize = cacheSize;
    };
    /**
     * Sets the maximum allowed cache age
     * @param {number} cacheAge Maximum cache age in milliseconds
     */
    /**
       * Sets the maximum allowed cache age
       * @param {number} cacheAge Maximum cache age in milliseconds
       */
    ImageLoaderConfig.prototype.setMaximumCacheAge = /**
       * Sets the maximum allowed cache age
       * @param {number} cacheAge Maximum cache age in milliseconds
       */
    function (cacheAge) {
        this.maxCacheAge = cacheAge;
    };
    /**
     * Set the return type of cached images
     * @param imageReturnType {string} The return type; either 'base64' or 'uri'
     */
    /**
       * Set the return type of cached images
       * @param imageReturnType {string} The return type; either 'base64' or 'uri'
       */
    ImageLoaderConfig.prototype.setImageReturnType = /**
       * Set the return type of cached images
       * @param imageReturnType {string} The return type; either 'base64' or 'uri'
       */
    function (imageReturnType) {
        this.imageReturnType = imageReturnType;
    };
    /**
     * Set the default spinner name
     * @param {string} name
     */
    /**
       * Set the default spinner name
       * @param {string} name
       */
    ImageLoaderConfig.prototype.setSpinnerName = /**
       * Set the default spinner name
       * @param {string} name
       */
    function (name) {
        this.spinnerName = name;
    };
    /**
     * Set the default spinner color
     * @param {string} color
     */
    /**
       * Set the default spinner color
       * @param {string} color
       */
    ImageLoaderConfig.prototype.setSpinnerColor = /**
       * Set the default spinner color
       * @param {string} color
       */
    function (color) {
        this.spinnerColor = color;
    };
    /**
     * Set headers options for the HttpClient transfers.
     * @param {HttpHeaders} headers
     */
    /**
       * Set headers options for the HttpClient transfers.
       * @param {HttpHeaders} headers
       */
    ImageLoaderConfig.prototype.setHttpHeaders = /**
       * Set headers options for the HttpClient transfers.
       * @param {HttpHeaders} headers
       */
    function (headers) {
        this.httpHeaders = headers;
    };
    /**
     * Set options for the FileTransfer plugin
     * @param options
     * @deprecated FileTransfer plugin removed.
     */
    /**
       * Set options for the FileTransfer plugin
       * @param options
       * @deprecated FileTransfer plugin removed.
       */
    ImageLoaderConfig.prototype.setFileTransferOptions = /**
       * Set options for the FileTransfer plugin
       * @param options
       * @deprecated FileTransfer plugin removed.
       */
    function (options) {
        // do nothing, plugin deprecated.
    };
    /**
     * Enable/Disable the save filename of cached images with extension.  Defaults to false.
     * @param {boolean} enable set to true to enable
     */
    /**
       * Enable/Disable the save filename of cached images with extension.  Defaults to false.
       * @param {boolean} enable set to true to enable
       */
    ImageLoaderConfig.prototype.setFileNameCachedWithExtension = /**
       * Enable/Disable the save filename of cached images with extension.  Defaults to false.
       * @param {boolean} enable set to true to enable
       */
    function (enable) {
        this.fileNameCachedWithExtension = enable;
    };
    /**
     * Set fallback extension filename of cached images.  Defaults to '.jpg'.
     * @param {string} extension fallback extension (e.x .jpg)
     */
    /**
       * Set fallback extension filename of cached images.  Defaults to '.jpg'.
       * @param {string} extension fallback extension (e.x .jpg)
       */
    ImageLoaderConfig.prototype.setFallbackFileNameCachedExtension = /**
       * Set fallback extension filename of cached images.  Defaults to '.jpg'.
       * @param {string} extension fallback extension (e.x .jpg)
       */
    function (extension) {
        this.fallbackFileNameCachedExtension = extension;
    };
    ImageLoaderConfig.decorators = [
        { type: Injectable },
    ];
    return ImageLoaderConfig;
}());
export { ImageLoaderConfig };
//# sourceMappingURL=image-loader-config.js.map