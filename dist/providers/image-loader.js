import { Injectable } from '@angular/core';
import { File } from '@ionic-native/file';
import { FileTransfer } from '@ionic-native/file-transfer';
import { ImageLoaderConfig } from "./image-loader-config";
import { Platform } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/first';
var ImageLoader = (function () {
    function ImageLoader(config, file, fileTransfer, platform) {
        var _this = this;
        this.config = config;
        this.file = file;
        this.fileTransfer = fileTransfer;
        this.platform = platform;
        /**
         * Indicates if the cache service is ready.
         * When the cache service isn't ready, images are loaded via browser instead.
         * @type {boolean}
         */
        this.isCacheReady = false;
        /**
         * Indicates if this service is initialized.
         * This service is initialized once all the setup is done.
         * @type {boolean}
         */
        this.isInit = false;
        /**
         * Number of concurrent requests allowed
         * @type {number}
         */
        this.concurrency = 5;
        /**
         * Queue items
         * @type {Array}
         */
        this.queue = [];
        this.transferInstances = [];
        this.processing = 0;
        this.cacheIndex = [];
        this.currentCacheSize = 0;
        this.indexed = false;
        if (!platform.is('cordova')) {
            // we are running on a browser, or using livereload
            // plugin will not function in this case
            this.isInit = true;
            this.throwWarning('You are running on a browser or using livereload, IonicImageLoader will not function, falling back to browser loading.');
        }
        else {
            Observable.fromEvent(document, 'deviceready').first().subscribe(function (res) {
                if (_this.nativeAvailable) {
                    _this.initCache();
                }
                else {
                    // we are running on a browser, or using livereload
                    // plugin will not function in this case
                    _this.isInit = true;
                    _this.throwWarning('You are running on a browser or using livereload, IonicImageLoader will not function, falling back to browser loading.');
                }
            });
        }
    }
    Object.defineProperty(ImageLoader.prototype, "nativeAvailable", {
        get: function () {
            return File.installed() && FileTransfer.installed();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ImageLoader.prototype, "shouldIndex", {
        get: function () {
            return (this.config.maxCacheAge > -1) || (this.config.maxCacheSize > -1);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ImageLoader.prototype, "isWKWebView", {
        get: function () {
            return this.platform.is('ios') && window.webkit && window.webkit.messageHandlers;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ImageLoader.prototype, "isIonicWKWebView", {
        get: function () {
            return this.isWKWebView && (location.host === 'localhost:8080' || window.LiveReload);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Preload an image
     * @param imageUrl {string} Image URL
     * @returns {Promise<string>} returns a promise that resolves with the cached image URL
     */
    ImageLoader.prototype.preload = function (imageUrl) {
        return this.getImagePath(imageUrl);
    };
    /**
     * Clears the cache
     */
    ImageLoader.prototype.clearCache = function () {
        var _this = this;
        if (!this.platform.is('cordova'))
            return;
        var clear = function () {
            if (!_this.isInit) {
                // do not run this method until our service is initialized
                setTimeout(clear.bind(_this), 500);
                return;
            }
            // pause any operations
            _this.isInit = false;
            _this.file.removeRecursively(_this.file.cacheDirectory, _this.config.cacheDirectoryName)
                .then(function () {
                if (_this.isWKWebView && !_this.isIonicWKWebView) {
                    // also clear the temp files
                    _this.file.removeRecursively(_this.file.tempDirectory, _this.config.cacheDirectoryName)
                        .catch(function (error) {
                        // Noop catch. Removing the tempDirectory might fail,
                        // as it is not persistent.
                    })
                        .then(function () {
                        _this.initCache(true);
                    });
                }
                else {
                    _this.initCache(true);
                }
            })
                .catch(_this.throwError.bind(_this));
        };
        clear();
    };
    /**
     * Gets the filesystem path of an image.
     * This will return the remote path if anything goes wrong or if the cache service isn't ready yet.
     * @param imageUrl {string} The remote URL of the image
     * @returns {Promise<string>} Returns a promise that will always resolve with an image URL
     */
    ImageLoader.prototype.getImagePath = function (imageUrl) {
        var _this = this;
        if (typeof imageUrl !== 'string' || imageUrl.length <= 0) {
            return Promise.reject('The image url provided was empty or invalid.');
        }
        return new Promise(function (resolve, reject) {
            var getImage = function () {
                _this.getCachedImagePath(imageUrl)
                    .then(resolve)
                    .catch(function () {
                    // image doesn't exist in cache, lets fetch it and save it
                    _this.addItemToQueue(imageUrl, resolve, reject);
                });
            };
            var check = function () {
                if (_this.isInit) {
                    if (_this.isCacheReady) {
                        getImage();
                    }
                    else {
                        _this.throwWarning('The cache system is not running. Images will be loaded by your browser instead.');
                        resolve(imageUrl);
                    }
                }
                else {
                    setTimeout(function () { return check(); }, 250);
                }
            };
            check();
        });
    };
    /**
     * Add an item to the queue
     * @param imageUrl
     * @param resolve
     * @param reject
     */
    ImageLoader.prototype.addItemToQueue = function (imageUrl, resolve, reject) {
        this.queue.push({
            imageUrl: imageUrl,
            resolve: resolve,
            reject: reject
        });
        this.processQueue();
    };
    Object.defineProperty(ImageLoader.prototype, "canProcess", {
        /**
         * Check if we can process more items in the queue
         * @returns {boolean}
         */
        get: function () {
            return (this.queue.length > 0
                && this.processing < this.concurrency);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Processes one item from the queue
     */
    ImageLoader.prototype.processQueue = function () {
        var _this = this;
        // make sure we can process items first
        if (!this.canProcess)
            return;
        // increase the processing number
        this.processing++;
        // take the first item from queue
        var currentItem = this.queue.splice(0, 1)[0];
        // create FileTransferObject instance if needed
        // we would only reach here if current jobs < concurrency limit
        // so, there's no need to check anything other than the length of
        // the FileTransferObject instances we have in memory
        if (this.transferInstances.length === 0) {
            this.transferInstances.push(this.fileTransfer.create());
        }
        var transfer = this.transferInstances.splice(0, 1)[0];
        // process more items concurrently if we can
        if (this.canProcess)
            this.processQueue();
        // function to call when done processing this item
        // this will reduce the processing number
        // then will execute this function again to process any remaining items
        var done = function () {
            _this.processing--;
            _this.transferInstances.push(transfer);
            _this.processQueue();
        };
        var localPath = this.file.cacheDirectory + this.config.cacheDirectoryName + '/' + this.createFileName(currentItem.imageUrl);
        transfer.download(currentItem.imageUrl, localPath, Boolean(this.config.fileTransferOptions.trustAllHosts), this.config.fileTransferOptions)
            .then(function (file) {
            if (_this.shouldIndex) {
                _this.addFileToIndex(file).then(_this.maintainCacheSize.bind(_this));
            }
            return _this.getCachedImagePath(currentItem.imageUrl);
        })
            .then(function (localUrl) {
            currentItem.resolve(localUrl);
            done();
        })
            .catch(function (e) {
            currentItem.reject();
            _this.throwError(e);
            done();
        });
    };
    /**
     * Initialize the cache service
     * @param replace {boolean} Whether to replace the cache directory if it already exists
     */
    ImageLoader.prototype.initCache = function (replace) {
        var _this = this;
        this.concurrency = this.config.concurrency;
        // create cache directories if they do not exist
        this.createCacheDirectory(replace)
            .catch(function (e) {
            _this.throwError(e);
            _this.isInit = true;
        })
            .then(function () { return _this.indexCache(); })
            .then(function () {
            _this.isCacheReady = true;
            _this.isInit = true;
        });
    };
    /**
     * Adds a file to index.
     * Also deletes any files if they are older than the set maximum cache age.
     * @param file {FileEntry} File to index
     * @returns {Promise<any>}
     */
    ImageLoader.prototype.addFileToIndex = function (file) {
        var _this = this;
        return new Promise(function (resolve, reject) { return file.getMetadata(resolve, reject); })
            .then(function (metadata) {
            if (_this.config.maxCacheAge > -1
                && (Date.now() - metadata.modificationTime.getTime()) > _this.config.maxCacheAge) {
                // file age exceeds maximum cache age
                return _this.removeFile(file.name);
            }
            else {
                // file age doesn't exceed maximum cache age, or maximum cache age isn't set
                _this.currentCacheSize += metadata.size;
                // add item to index
                _this.cacheIndex.push({
                    name: file.name,
                    modificationTime: metadata.modificationTime,
                    size: metadata.size
                });
                return Promise.resolve();
            }
        });
    };
    /**
     * Indexes the cache if necessary
     * @returns {any}
     */
    ImageLoader.prototype.indexCache = function () {
        var _this = this;
        // only index if needed, to save resources
        if (!this.shouldIndex)
            return Promise.resolve();
        this.cacheIndex = [];
        return this.file.listDir(this.file.cacheDirectory, this.config.cacheDirectoryName)
            .then(function (files) { return Promise.all(files.map(_this.addFileToIndex.bind(_this))); })
            .then(function () {
            // Sort items by date. Most recent to oldest.
            _this.cacheIndex = _this.cacheIndex.sort(function (a, b) { return a > b ? -1 : a < b ? 1 : 0; });
            _this.indexed = true;
            return Promise.resolve();
        })
            .catch(function (e) {
            _this.throwError(e);
            return Promise.resolve();
        });
    };
    /**
     * This method runs every time a new file is added.
     * It checks the cache size and ensures that it doesn't exceed the maximum cache size set in the config.
     * If the limit is reached, it will delete old images to create free space.
     */
    ImageLoader.prototype.maintainCacheSize = function () {
        var _this = this;
        if (this.config.maxCacheSize > -1 && this.indexed) {
            var maintain_1 = function () {
                if (_this.currentCacheSize > _this.config.maxCacheSize) {
                    // called when item is done processing
                    var next_1 = function () {
                        _this.currentCacheSize -= file_1.size;
                        maintain_1();
                    };
                    // grab the first item in index since it's the oldest one
                    var file_1 = _this.cacheIndex.splice(0, 1)[0];
                    if (typeof file_1 == 'undefined')
                        return maintain_1();
                    // delete the file then process next file if necessary
                    _this.removeFile(file_1.name)
                        .then(function () { return next_1(); })
                        .catch(function () { return next_1(); }); // ignore errors, nothing we can do about it
                }
            };
            maintain_1();
        }
    };
    /**
     * Remove a file
     * @param file {string} The name of the file to remove
     */
    ImageLoader.prototype.removeFile = function (file) {
        var _this = this;
        return this.file
            .removeFile(this.file.cacheDirectory + this.config.cacheDirectoryName, file)
            .then(function () {
            if (_this.isWKWebView && !_this.isIonicWKWebView) {
                return _this.file
                    .removeFile(_this.file.tempDirectory + _this.config.cacheDirectoryName, file)
                    .catch(function () {
                    // Noop catch. Removing the files from tempDirectory might fail, as it is not persistent.
                });
            }
        });
    };
    /**
     * Get the local path of a previously cached image if exists
     * @param url {string} The remote URL of the image
     * @returns {Promise<string>} Returns a promise that resolves with the local path if exists, or rejects if doesn't exist
     */
    ImageLoader.prototype.getCachedImagePath = function (url) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            // make sure cache is ready
            if (!_this.isCacheReady) {
                return reject();
            }
            // get file name
            var fileName = _this.createFileName(url);
            // get full path
            var dirPath = _this.file.cacheDirectory + _this.config.cacheDirectoryName, tempDirPath = _this.file.tempDirectory + _this.config.cacheDirectoryName;
            // check if exists
            _this.file.resolveLocalFilesystemUrl(dirPath + '/' + fileName)
                .then(function (fileEntry) {
                // file exists in cache
                if (_this.config.imageReturnType === 'base64') {
                    // read the file as data url and return the base64 string.
                    // should always be successful as the existence of the file
                    // is alreay ensured
                    _this.file
                        .readAsDataURL(dirPath, fileName)
                        .then(function (base64) {
                        base64 = base64.replace('data:null', 'data:*/*');
                        resolve(base64);
                    })
                        .catch(reject);
                }
                else if (_this.config.imageReturnType === 'uri') {
                    // now check if iOS device & using WKWebView Engine.
                    // in this case only the tempDirectory is accessible,
                    // therefore the file needs to be copied into that directory first!
                    if (_this.isIonicWKWebView) {
                        // Ionic WKWebView can access all files, but we just need to replace file:/// with http://localhost:8080/
                        resolve(fileEntry.nativeURL.replace('file:///', 'http://localhost:8080/'));
                    }
                    else if (_this.isWKWebView) {
                        // check if file already exists in temp directory
                        _this.file.resolveLocalFilesystemUrl(tempDirPath + '/' + fileName)
                            .then(function (tempFileEntry) {
                            // file exists in temp directory
                            // return native path
                            resolve(tempFileEntry.nativeURL);
                        })
                            .catch(function () {
                            // file does not yet exist in the temp directory.
                            // copy it!
                            _this.file.copyFile(dirPath, fileName, tempDirPath, fileName)
                                .then(function (tempFileEntry) {
                                // now the file exists in the temp directory
                                // return native path
                                resolve(tempFileEntry.nativeURL);
                            })
                                .catch(reject);
                        });
                    }
                    else {
                        // return native path
                        resolve(fileEntry.nativeURL);
                    }
                }
            })
                .catch(reject); // file doesn't exist
        });
    };
    /**
     * Throws a console error if debug mode is enabled
     * @param args {any[]} Error message
     */
    ImageLoader.prototype.throwError = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (this.config.debugMode) {
            args.unshift('ImageLoader Error: ');
            console.error.apply(console, args);
        }
    };
    /**
     * Throws a console warning if debug mode is enabled
     * @param args {any[]} Error message
     */
    ImageLoader.prototype.throwWarning = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (this.config.debugMode) {
            args.unshift('ImageLoader Warning: ');
            console.warn.apply(console, args);
        }
    };
    /**
     * Check if the cache directory exists
     * @param directory {string} The directory to check. Either this.file.tempDirectory or this.file.cacheDirectory
     * @returns {Promise<boolean|FileError>} Returns a promise that resolves if exists, and rejects if it doesn't
     */
    ImageLoader.prototype.cacheDirectoryExists = function (directory) {
        return this.file.checkDir(directory, this.config.cacheDirectoryName);
    };
    /**
     * Create the cache directories
     * @param replace {boolean} override directory if exists
     * @returns {Promise<DirectoryEntry|FileError>} Returns a promise that resolves if the directories were created, and rejects on error
     */
    ImageLoader.prototype.createCacheDirectory = function (replace) {
        var _this = this;
        if (replace === void 0) { replace = false; }
        var cacheDirectoryPromise, tempDirectoryPromise;
        if (replace) {
            // create or replace the cache directory
            cacheDirectoryPromise = this.file.createDir(this.file.cacheDirectory, this.config.cacheDirectoryName, replace);
        }
        else {
            // check if the cache directory exists.
            // if it does not exist create it!
            cacheDirectoryPromise = this.cacheDirectoryExists(this.file.cacheDirectory)
                .catch(function () { return _this.file.createDir(_this.file.cacheDirectory, _this.config.cacheDirectoryName, false); });
        }
        if (this.isWKWebView && !this.isIonicWKWebView) {
            if (replace) {
                // create or replace the temp directory
                tempDirectoryPromise = this.file.createDir(this.file.tempDirectory, this.config.cacheDirectoryName, replace);
            }
            else {
                // check if the temp directory exists.
                // if it does not exist create it!
                tempDirectoryPromise = this.cacheDirectoryExists(this.file.tempDirectory)
                    .catch(function () { return _this.file.createDir(_this.file.tempDirectory, _this.config.cacheDirectoryName, false); });
            }
        }
        else {
            tempDirectoryPromise = Promise.resolve();
        }
        return Promise.all([cacheDirectoryPromise, tempDirectoryPromise]);
    };
    /**
     * Creates a unique file name out of the URL
     * @param url {string} URL of the file
     * @returns {string} Unique file name
     */
    ImageLoader.prototype.createFileName = function (url) {
        // hash the url to get a unique file name
        return this.hashString(url).toString();
    };
    /**
     * Converts a string to a unique 32-bit int
     * @param string {string} string to hash
     * @returns {number} 32-bit int
     */
    ImageLoader.prototype.hashString = function (string) {
        var hash = 0, char;
        if (string.length === 0)
            return hash;
        for (var i = 0; i < string.length; i++) {
            char = string.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return hash;
    };
    return ImageLoader;
}());
export { ImageLoader };
ImageLoader.decorators = [
    { type: Injectable },
];
/** @nocollapse */
ImageLoader.ctorParameters = function () { return [
    { type: ImageLoaderConfig, },
    { type: File, },
    { type: FileTransfer, },
    { type: Platform, },
]; };
//# sourceMappingURL=image-loader.js.map