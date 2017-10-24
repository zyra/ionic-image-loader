import { Component, Input, Output, ElementRef, Renderer, EventEmitter } from '@angular/core';
import { ImageLoader } from '../providers/image-loader';
import { ImageLoaderConfig } from '../providers/image-loader-config';
var propMap = {
    display: 'display',
    height: 'height',
    width: 'width',
    backgroundSize: 'background-size',
    backgroundRepeat: 'background-repeat'
};
var ImgLoader = (function () {
    function ImgLoader(_element, _renderer, _imageLoader, _config) {
        this._element = _element;
        this._renderer = _renderer;
        this._imageLoader = _imageLoader;
        this._config = _config;
        /**
         * Fallback URL to load when the image url fails to load or does not exist.
         */
        this.fallbackUrl = this._config.fallbackUrl;
        /**
         * Whether to show a spinner while the image loads
         */
        this.spinner = this._config.spinnerEnabled;
        /**
         * Whether to show the fallback image instead of a spinner while the image loads
         */
        this.fallbackAsPlaceholder = this._config.fallbackAsPlaceholder;
        this._useImg = this._config.useImg;
        /**
         * Attributes to pass through to img tag if _useImg == true
         */
        this.imgAttributes = [];
        /**
         * Enable/Disable caching
         * @type {boolean}
         */
        this.cache = true;
        /**
         * Width of the image. This will be ignored if using useImg.
         */
        this.width = this._config.width;
        /**
         * Height of the image. This will be ignored if using useImg.
         */
        this.height = this._config.height;
        /**
         * Display type of the image. This will be ignored if using useImg.
         */
        this.display = this._config.display;
        /**
         * Background size. This will be ignored if using useImg.
         */
        this.backgroundSize = this._config.backgroundSize;
        /**
         * Background repeat. This will be ignored if using useImg.
         */
        this.backgroundRepeat = this._config.backgroundRepeat;
        /**
         * Name of the spinner
         */
        this.spinnerName = this._config.spinnerName;
        /**
         * Color of the spinner
         */
        this.spinnerColor = this._config.spinnerColor;
        /**
         * Notify on image load..
         */
        this.load = new EventEmitter();
        /**
         * Indicates if the image is still loading
         * @type {boolean}
         */
        this.isLoading = true;
    }
    Object.defineProperty(ImgLoader.prototype, "src", {
        get: function () {
            return this._src;
        },
        /**
         * The URL of the image to load.
         */
        set: function (imageUrl) {
            this._src = this.processImageUrl(imageUrl);
            this.updateImage(this._src);
        },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(ImgLoader.prototype, "useImg", {
        /**
         * Use <img> tag
         */
        set: function (val) {
            this._useImg = val !== false;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ImgLoader.prototype, "noCache", {
        /**
         * Convenience attribute to disable caching
         * @param val
         */
        set: function (val) {
            this.cache = val !== false;
        },
        enumerable: true,
        configurable: true
    });
    ImgLoader.prototype.ngOnInit = function () {
        if (this.fallbackAsPlaceholder && this.fallbackUrl) {
            this.setImage(this.fallbackUrl, false);
        }
        if (!this.src) {
            // image url was not passed
            // this can happen when [src] is set to a variable that turned out to be undefined
            // one example could be a list of users with their profile pictures
            // in this case, it would be useful to use the fallback image instead
            // if fallbackUrl was used as placeholder we do not need to set it again
            if (!this.fallbackAsPlaceholder && this.fallbackUrl) {
                // we're not going to cache the fallback image since it should be locally saved
                this.setImage(this.fallbackUrl);
            }
            else {
                this.isLoading = false;
            }
        }
    };
    ImgLoader.prototype.updateImage = function (imageUrl) {
        var _this = this;
        this._imageLoader.getImagePath(imageUrl)
            .then(function (imageUrl) { return _this.setImage(imageUrl); })
            .catch(function (error) { return _this.setImage(_this.fallbackUrl || imageUrl); });
    };
    /**
     * Gets the image URL to be loaded and disables caching if necessary
     * @returns {string}
     */
    ImgLoader.prototype.processImageUrl = function (imageUrl) {
        if (this.cache === false) {
            // need to disable caching
            if (imageUrl.indexOf('?') === -1) {
                imageUrl += '?';
            }
            if (['&', '?'].indexOf(imageUrl.charAt(imageUrl.length)) === -1) {
                imageUrl += '&';
            }
            // append timestamp at the end to make URL unique
            imageUrl += 'cache_buster=' + Date.now();
        }
        return imageUrl;
    };
    /**
     * Set the image to be displayed
     * @param imageUrl {string} image src
     * @param stopLoading {boolean} set to true to mark the image as loaded
     */
    ImgLoader.prototype.setImage = function (imageUrl, stopLoading) {
        var _this = this;
        if (stopLoading === void 0) { stopLoading = true; }
        this.isLoading = !stopLoading;
        if (this._useImg) {
            // Using <img> tag
            if (!this.element) {
                // create img element if we dont have one
                this.element = this._renderer.createElement(this._element.nativeElement, 'img');
            }
            // set it's src
            this._renderer.setElementAttribute(this.element, 'src', imageUrl);
            // if imgAttributes are defined, add them to our img element
            this.imgAttributes.forEach(function (attribute, index, attributeArray) {
                _this._renderer.setElementAttribute(_this.element, attribute.element, attribute.value);
            });
            if (this.fallbackUrl && !this._imageLoader.nativeAvailable) {
                this._renderer.listen(this.element, 'error', function () { return _this._renderer.setElementAttribute(_this.element, 'src', _this.fallbackUrl); });
            }
        }
        else {
            // Not using <img> tag
            this.element = this._element.nativeElement;
            for (var prop in propMap) {
                if (this[prop]) {
                    this._renderer.setElementStyle(this.element, propMap[prop], this[prop]);
                }
            }
            this._renderer.setElementStyle(this.element, 'background-image', 'url(\'' + (imageUrl || this.fallbackUrl) + '\')');
        }
        this.load.emit(this);
    };
    return ImgLoader;
}());
export { ImgLoader };
ImgLoader.decorators = [
    { type: Component, args: [{
                selector: 'img-loader',
                template: '<ion-spinner *ngIf="spinner && isLoading && !fallbackAsPlaceholder" [name]="spinnerName" [color]="spinnerColor"></ion-spinner>' +
                    '<ng-content></ng-content>',
                styles: ['ion-spinner { float: none; margin-left: auto; margin-right: auto; display: block; }']
            },] },
];
/** @nocollapse */
ImgLoader.ctorParameters = function () { return [
    { type: ElementRef, },
    { type: Renderer, },
    { type: ImageLoader, },
    { type: ImageLoaderConfig, },
]; };
ImgLoader.propDecorators = {
    'src': [{ type: Input },],
    'fallbackUrl': [{ type: Input, args: ['fallback',] },],
    'spinner': [{ type: Input },],
    'fallbackAsPlaceholder': [{ type: Input },],
    'useImg': [{ type: Input },],
    'imgAttributes': [{ type: Input, args: ['imgAttributes',] },],
    'noCache': [{ type: Input },],
    'cache': [{ type: Input },],
    'width': [{ type: Input },],
    'height': [{ type: Input },],
    'display': [{ type: Input },],
    'backgroundSize': [{ type: Input },],
    'backgroundRepeat': [{ type: Input },],
    'spinnerName': [{ type: Input },],
    'spinnerColor': [{ type: Input },],
    'load': [{ type: Output },],
};
//# sourceMappingURL=img-loader.js.map