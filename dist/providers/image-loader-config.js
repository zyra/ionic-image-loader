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
    ImageLoaderConfig.prototype.enableDebugMode = function () {
        this.debugMode = true;
    };
    /**
     * Enable/Disable the spinner by default. Defaults to true.
     * @param enable {boolean} set to true to enable
     */
    ImageLoaderConfig.prototype.enableSpinner = function (enable) {
        this.spinnerEnabled = enable;
    };
    /**
     * Enable/Disable the fallback image as placeholder instead of the spinner. Defaults to false.
     * @param enable {boolean} set to true to enable
     */
    ImageLoaderConfig.prototype.enableFallbackAsPlaceholder = function (enable) {
        this.fallbackAsPlaceholder = enable;
    };
    /**
     * Sets the cache directory name. Defaults to 'image-loader-cache'
     * @param name {string} name of directory
     */
    ImageLoaderConfig.prototype.setCacheDirectoryName = function (name) {
        this.cacheDirectoryName = name;
    };
    /**
     * Set default height for images that are not using <img> tag
     * @param height {string} height
     */
    ImageLoaderConfig.prototype.setHeight = function (height) {
        this.height = height;
    };
    /**
     * Set default width for images that are not using <img> tag
     * @param width {string} Width
     */
    ImageLoaderConfig.prototype.setWidth = function (width) {
        this.width = width;
    };
    /**
     * Enable display mode for images that are not using <img> tag
     * @param display {string} Display mode
     */
    ImageLoaderConfig.prototype.setDisplay = function (display) {
        this.display = display;
    };
    /**
     * Use <img> tag by default
     * @param use {boolean} set to true to use <img> tag by default
     */
    ImageLoaderConfig.prototype.useImageTag = function (use) {
        this.useImg = use;
    };
    /**
     * Set default background size for images that are not using <img> tag
     * @param backgroundSize {string} Background size
     */
    ImageLoaderConfig.prototype.setBackgroundSize = function (backgroundSize) {
        this.backgroundSize = backgroundSize;
    };
    /**
     * Set background repeat for images that are not using <img> tag
     * @param backgroundRepeat {string} Background repeat
     */
    ImageLoaderConfig.prototype.setBackgroundRepeat = function (backgroundRepeat) {
        this.backgroundRepeat = backgroundRepeat;
    };
    /**
     * Set fallback URL to use when image src is undefined or did not resolve.
     * This image will not be cached. This should ideally be a locally saved image.
     * @param fallbackUrl {string} The remote or local URL of the image
     */
    ImageLoaderConfig.prototype.setFallbackUrl = function (fallbackUrl) {
        this.fallbackUrl = fallbackUrl;
    };
    /**
     * Set the maximum number of allowed connections at the same time.
     * @param concurrency
     */
    ImageLoaderConfig.prototype.setConcurrency = function (concurrency) {
        this.concurrency = concurrency;
    };
    /**
     * Sets the maximum allowed cache size
     * @param cacheSize {number} Cache size in bytes
     */
    ImageLoaderConfig.prototype.setMaximumCacheSize = function (cacheSize) {
        this.maxCacheSize = cacheSize;
    };
    /**
     * Sets the maximum allowed cache age
     * @param cacheAge {number} Maximum cache age in milliseconds
     */
    ImageLoaderConfig.prototype.setMaximumCacheAge = function (cacheAge) {
        this.maxCacheAge = cacheAge;
    };
    /**
     * Set the return type of cached images
     * @param imageReturnType {string} The return type; either 'base64' or 'uri'
     */
    ImageLoaderConfig.prototype.setImageReturnType = function (imageReturnType) {
        this.imageReturnType = imageReturnType;
    };
    /**
     * Set the default spinnern ame
     * @param name
     */
    ImageLoaderConfig.prototype.setSpinnerName = function (name) {
        this.spinnerName = name;
    };
    /**
     * Set the default spinner color
     * @param color
     */
    ImageLoaderConfig.prototype.setSpinnerColor = function (color) {
        this.spinnerColor = color;
    };
    return ImageLoaderConfig;
}());
export { ImageLoaderConfig };
ImageLoaderConfig.decorators = [
    { type: Injectable },
];
/** @nocollapse */
ImageLoaderConfig.ctorParameters = function () { return []; };
//# sourceMappingURL=image-loader-config.js.map