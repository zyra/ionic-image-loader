import { Injectable } from '@angular/core';
import { File } from '@ionic-native/file';
import { Platform } from 'ionic-angular';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { first } from 'rxjs/operators';
import { ImageLoaderConfig } from './image-loader-config';
import { HTTP } from '@ionic-native/http/ngx';
import { fromPromise } from 'rxjs/observable/fromPromise';
var ImageLoader = (function () {
    function ImageLoader(config, file, http, platform) {
        var _this = this;
        this.config = config;
        this.file = file;
        this.http = http;
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
        this.processing = 0;
        /**
             * Fast accessible Object for currently processing items
             */
        this.currentlyProcessing = {};
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
            fromEvent(document, 'deviceready')
                .pipe(first())
                .subscribe(function (res) {
                if (_this.nativeAvailable) {
                    _this.initCache();
                }
                else {
                    // we are running on a browser, or using livereload
                    // plugin will not function in this case
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
            return File.installed();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ImageLoader.prototype, "isCacheSpaceExceeded", {
        get: function () {
            return (this.config.maxCacheSize > -1 &&
                this.currentCacheSize > this.config.maxCacheSize);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ImageLoader.prototype, "isWKWebView", {
        get: function () {
            return (this.platform.is('ios') &&
                window.webkit &&
                window.webkit.messageHandlers);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ImageLoader.prototype, "isIonicWKWebView", {
        get: function () {
            return ((this.isWKWebView || this.platform.is('android')) &&
                (location.host === 'localhost:8080' || window.LiveReload));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ImageLoader.prototype, "isDevServer", {
        get: function () {
            return window['IonicDevServer'] !== undefined;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ImageLoader.prototype, "canProcess", {
        /**
         * Check if we can process more items in the queue
         * @returns {boolean}
         */
        get: /**
             * Check if we can process more items in the queue
             * @returns {boolean}
             */
        function () {
            return this.queue.length > 0 && this.processing < this.concurrency;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Preload an image
     * @param {string} imageUrl Image URL
     * @returns {Promise<string>} returns a promise that resolves with the cached image URL
     */
    /**
         * Preload an image
         * @param {string} imageUrl Image URL
         * @returns {Promise<string>} returns a promise that resolves with the cached image URL
         */
    ImageLoader.prototype.preload = /**
         * Preload an image
         * @param {string} imageUrl Image URL
         * @returns {Promise<string>} returns a promise that resolves with the cached image URL
         */
    function (imageUrl) {
        return this.getImagePath(imageUrl);
    };
    ImageLoader.prototype.getFileCacheDirectory = function () {
        if (this.config.cacheDirectoryType == 'data') {
            return this.file.dataDirectory;
        }
        return this.file.cacheDirectory;
    };
    /**
     * Clears cache of a single image
     * @param {string} imageUrl Image URL
     */
    /**
         * Clears cache of a single image
         * @param {string} imageUrl Image URL
         */
    ImageLoader.prototype.clearImageCache = /**
         * Clears cache of a single image
         * @param {string} imageUrl Image URL
         */
    function (imageUrl) {
        var _this = this;
        if (!this.platform.is('cordova')) {
            return;
        }
        var clear = function () {
            if (!_this.isInit) {
                // do not run this method until our service is initialized
                setTimeout(clear.bind(_this), 500);
                return;
            }
            var fileName = _this.createFileName(imageUrl);
            var route = _this.getFileCacheDirectory() + _this.config.cacheDirectoryName;
            // pause any operations
            // pause any operations
            _this.isInit = false;
            _this.file.removeFile(route, fileName)
                .then(function () {
                if (_this.isWKWebView && !_this.isIonicWKWebView) {
                    _this.file.removeFile(_this.file.tempDirectory + _this.config.cacheDirectoryName, fileName)
                        .then(function () {
                        _this.initCache(true);
                    }).catch(function (err) {
                        // Handle error?
                    });
                }
                else {
                    _this.initCache(true);
                }
            }).catch(_this.throwError.bind(_this));
        };
        clear();
    };
    /**
     * Clears the cache
     */
    /**
         * Clears the cache
         */
    ImageLoader.prototype.clearCache = /**
         * Clears the cache
         */
    function () {
        var _this = this;
        if (!this.platform.is('cordova')) {
            return;
        }
        var clear = function () {
            if (!_this.isInit) {
                // do not run this method until our service is initialized
                setTimeout(clear.bind(_this), 500);
                return;
            }
            // pause any operations
            // pause any operations
            _this.isInit = false;
            _this.file.removeRecursively(_this.getFileCacheDirectory(), _this.config.cacheDirectoryName)
                .then(function () {
                if (_this.isWKWebView && !_this.isIonicWKWebView) {
                    // also clear the temp files
                    // also clear the temp files
                    _this.file
                        .removeRecursively(_this.file.tempDirectory, _this.config.cacheDirectoryName)
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
     * @param {string} imageUrl The remote URL of the image
     * @returns {Promise<string>} Returns a promise that will always resolve with an image URL
     */
    /**
         * Gets the filesystem path of an image.
         * This will return the remote path if anything goes wrong or if the cache service isn't ready yet.
         * @param {string} imageUrl The remote URL of the image
         * @returns {Promise<string>} Returns a promise that will always resolve with an image URL
         */
    ImageLoader.prototype.getImagePath = /**
         * Gets the filesystem path of an image.
         * This will return the remote path if anything goes wrong or if the cache service isn't ready yet.
         * @param {string} imageUrl The remote URL of the image
         * @returns {Promise<string>} Returns a promise that will always resolve with an image URL
         */
    function (imageUrl) {
        var _this = this;
        if (typeof imageUrl !== 'string' || imageUrl.length <= 0) {
            return Promise.reject('The image url provided was empty or invalid.');
        }
        return new Promise(function (resolve, reject) {
            var getImage = function () {
                if (_this.isImageUrlRelative(imageUrl)) {
                    resolve(imageUrl);
                }
                else {
                    _this.getCachedImagePath(imageUrl)
                        .then(resolve)
                        .catch(function () {
                        // image doesn't exist in cache, lets fetch it and save it
                        // image doesn't exist in cache, lets fetch it and save it
                        _this.addItemToQueue(imageUrl, resolve, reject);
                    });
                }
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
     * Returns if an imageUrl is an relative path
     * @param {string} imageUrl
     */
    /**
         * Returns if an imageUrl is an relative path
         * @param {string} imageUrl
         */
    ImageLoader.prototype.isImageUrlRelative = /**
         * Returns if an imageUrl is an relative path
         * @param {string} imageUrl
         */
    function (imageUrl) {
        return !/^(https?|file):\/\/\/?/i.test(imageUrl);
    };
    /**
     * Add an item to the queue
     * @param {string} imageUrl
     * @param resolve
     * @param reject
     */
    /**
         * Add an item to the queue
         * @param {string} imageUrl
         * @param resolve
         * @param reject
         */
    ImageLoader.prototype.addItemToQueue = /**
         * Add an item to the queue
         * @param {string} imageUrl
         * @param resolve
         * @param reject
         */
    function (imageUrl, resolve, reject) {
        this.queue.push({
            imageUrl: imageUrl,
            resolve: resolve,
            reject: reject,
        });
        this.processQueue();
    };
    /**
     * Processes one item from the queue
     */
    /**
         * Processes one item from the queue
         */
    ImageLoader.prototype.processQueue = /**
         * Processes one item from the queue
         */
    function () {
        var _this = this;
        // make sure we can process items first
        if (!this.canProcess) {
            return;
        }
        // increase the processing number
        this.processing++;
        // take the first item from queue
        var currentItem = this.queue.splice(0, 1)[0];
        // function to call when done processing this item
        // this will reduce the processing number
        // then will execute this function again to process any remaining items
        var done = function () {
            _this.processing--;
            _this.processQueue();
            // only delete if it's the last/unique occurrence in the queue
            if (_this.currentlyProcessing[currentItem.imageUrl] !== undefined && !_this.currentlyInQueue(currentItem.imageUrl)) {
                delete _this.currentlyProcessing[currentItem.imageUrl];
            }
        };
        var error = function (e) {
            currentItem.reject();
            _this.throwError(e);
            done();
        };
        if (this.currentlyProcessing[currentItem.imageUrl] === undefined) {
            this.currentlyProcessing[currentItem.imageUrl] = new Promise(function (resolve, reject) {
                // process more items concurrently if we can
                if (_this.canProcess) {
                    _this.processQueue();
                }
                var localDir = _this.getFileCacheDirectory() + _this.config.cacheDirectoryName + '/';
                var fileName = _this.createFileName(currentItem.imageUrl);
                fromPromise(_this.http.get(currentItem.imageUrl, {}, {
                    responseType: 'blob',
                    headers: _this.config.httpHeaders
                })).subscribe(function (data) {
                    _this.file.writeFile(localDir, fileName, JSON.parse(data.data), { replace: true }).then(function (file) {
                        if (_this.isCacheSpaceExceeded) {
                            _this.maintainCacheSize();
                        }
                        _this.addFileToIndex(file).then(function () {
                            _this.getCachedImagePath(currentItem.imageUrl).then(function (localUrl) {
                                currentItem.resolve(localUrl);
                                resolve();
                                done();
                                _this.maintainCacheSize();
                            });
                        });
                    }).catch(function (e) {
                        // Could not write image
                        error(e);
                        reject(e);
                    });
                }, function (e) {
                    // Could not get image via httpClient
                    error(e);
                    reject(e);
                });
            }).catch(function (e) { return _this.throwError(e); });
        }
        else {
            // Prevented same Image from loading at the same time
            this.currentlyProcessing[currentItem.imageUrl].then(function () {
                _this.getCachedImagePath(currentItem.imageUrl).then(function (localUrl) {
                    currentItem.resolve(localUrl);
                });
                done();
            }, function (e) {
                error(e);
            });
        }
    };
    /**
     * Search if the url is currently in the queue
     * @param imageUrl {string} Image url to search
     * @returns {boolean}
     */
    /**
         * Search if the url is currently in the queue
         * @param imageUrl {string} Image url to search
         * @returns {boolean}
         */
    ImageLoader.prototype.currentlyInQueue = /**
         * Search if the url is currently in the queue
         * @param imageUrl {string} Image url to search
         * @returns {boolean}
         */
    function (imageUrl) {
        return this.queue.some(function (item) { return item.imageUrl === imageUrl; });
    };
    /**
     * Initialize the cache service
     * @param [boolean] replace Whether to replace the cache directory if it already exists
     */
    /**
         * Initialize the cache service
         * @param [boolean] replace Whether to replace the cache directory if it already exists
         */
    ImageLoader.prototype.initCache = /**
         * Initialize the cache service
         * @param [boolean] replace Whether to replace the cache directory if it already exists
         */
    function (replace) {
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
     * @param {FileEntry} file File to index
     * @returns {Promise<any>}
     */
    /**
         * Adds a file to index.
         * Also deletes any files if they are older than the set maximum cache age.
         * @param {FileEntry} file File to index
         * @returns {Promise<any>}
         */
    ImageLoader.prototype.addFileToIndex = /**
         * Adds a file to index.
         * Also deletes any files if they are older than the set maximum cache age.
         * @param {FileEntry} file File to index
         * @returns {Promise<any>}
         */
    function (file) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            return file.getMetadata(resolve, reject);
        }).then(function (metadata) {
            if (_this.config.maxCacheAge > -1 &&
                Date.now() - metadata.modificationTime.getTime() >
                    _this.config.maxCacheAge) {
                // file age exceeds maximum cache age
                return _this.removeFile(file.name);
            }
            else {
                // file age doesn't exceed maximum cache age, or maximum cache age isn't set
                // file age doesn't exceed maximum cache age, or maximum cache age isn't set
                _this.currentCacheSize += metadata.size;
                // add item to index
                // add item to index
                _this.cacheIndex.push({
                    name: file.name,
                    modificationTime: metadata.modificationTime,
                    size: metadata.size,
                });
                return Promise.resolve();
            }
        });
    };
    /**
     * Indexes the cache if necessary
     * @returns {Promise<void>}
     */
    /**
         * Indexes the cache if necessary
         * @returns {Promise<void>}
         */
    ImageLoader.prototype.indexCache = /**
         * Indexes the cache if necessary
         * @returns {Promise<void>}
         */
    function () {
        var _this = this;
        this.cacheIndex = [];
        return this.file.listDir(this.getFileCacheDirectory(), this.config.cacheDirectoryName)
            .then(function (files) { return Promise.all(files.map(_this.addFileToIndex.bind(_this))); })
            .then(function () {
            // Sort items by date. Most recent to oldest.
            // Sort items by date. Most recent to oldest.
            _this.cacheIndex = _this.cacheIndex.sort(function (a, b) { return (a > b ? -1 : a < b ? 1 : 0); });
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
    /**
         * This method runs every time a new file is added.
         * It checks the cache size and ensures that it doesn't exceed the maximum cache size set in the config.
         * If the limit is reached, it will delete old images to create free space.
         */
    ImageLoader.prototype.maintainCacheSize = /**
         * This method runs every time a new file is added.
         * It checks the cache size and ensures that it doesn't exceed the maximum cache size set in the config.
         * If the limit is reached, it will delete old images to create free space.
         */
    function () {
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
                    if (typeof file_1 === 'undefined') {
                        return maintain_1();
                    }
                    // delete the file then process next file if necessary
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
     * @param {string} file The name of the file to remove
     * @returns {Promise<any>}
     */
    /**
         * Remove a file
         * @param {string} file The name of the file to remove
         * @returns {Promise<any>}
         */
    ImageLoader.prototype.removeFile = /**
         * Remove a file
         * @param {string} file The name of the file to remove
         * @returns {Promise<any>}
         */
    function (file) {
        var _this = this;
        return this.file
            .removeFile(this.getFileCacheDirectory() + this.config.cacheDirectoryName, file)
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
     * @param {string} url The remote URL of the image
     * @returns {Promise<string>} Returns a promise that resolves with the local path if exists, or rejects if doesn't exist
     */
    /**
         * Get the local path of a previously cached image if exists
         * @param {string} url The remote URL of the image
         * @returns {Promise<string>} Returns a promise that resolves with the local path if exists, or rejects if doesn't exist
         */
    ImageLoader.prototype.getCachedImagePath = /**
         * Get the local path of a previously cached image if exists
         * @param {string} url The remote URL of the image
         * @returns {Promise<string>} Returns a promise that resolves with the local path if exists, or rejects if doesn't exist
         */
    function (url) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            // make sure cache is ready
            if (!_this.isCacheReady) {
                return reject();
            }
            // if we're running with livereload, ignore cache and call the resource from it's URL
            if (_this.isDevServer) {
                return resolve(url);
            }
            // get file name
            var fileName = _this.createFileName(url);
            // get full path
            var dirPath = _this.getFileCacheDirectory() + _this.config.cacheDirectoryName, tempDirPath = _this.file.tempDirectory + _this.config.cacheDirectoryName;
            // check if exists
            // check if exists
            _this.file
                .resolveLocalFilesystemUrl(dirPath + '/' + fileName)
                .then(function (fileEntry) {
                // file exists in cache
                if (_this.config.imageReturnType === 'base64') {
                    // read the file as data url and return the base64 string.
                    // should always be successful as the existence of the file
                    // is already ensured
                    // read the file as data url and return the base64 string.
                    // should always be successful as the existence of the file
                    // is already ensured
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
                        // Use Ionic convertFileSrc to generate the right URL for Ionic WKWebView
                        resolve(Ionic.WebView.convertFileSrc(fileEntry.nativeURL));
                    }
                    else if (_this.isWKWebView) {
                        // check if file already exists in temp directory
                        // check if file already exists in temp directory
                        _this.file
                            .resolveLocalFilesystemUrl(tempDirPath + '/' + fileName)
                            .then(function (tempFileEntry) {
                            // file exists in temp directory
                            // return native path
                            resolve(Ionic.WebView.convertFileSrc(tempFileEntry.nativeURL));
                        })
                            .catch(function () {
                            // file does not yet exist in the temp directory.
                            // copy it!
                            // file does not yet exist in the temp directory.
                            // copy it!
                            _this.file
                                .copyFile(dirPath, fileName, tempDirPath, fileName)
                                .then(function (tempFileEntry) {
                                // now the file exists in the temp directory
                                // return native path
                                resolve(Ionic.WebView.convertFileSrc(tempFileEntry.nativeURL));
                            })
                                .catch(reject);
                        });
                    }
                    else {
                        // return native path
                        resolve(Ionic.WebView.convertFileSrc(fileEntry.nativeURL));
                    }
                }
            })
                .catch(reject); // file doesn't exist
        });
    };
    /**
     * Throws a console error if debug mode is enabled
     * @param {any[]} args Error message
     */
    /**
         * Throws a console error if debug mode is enabled
         * @param {any[]} args Error message
         */
    ImageLoader.prototype.throwError = /**
         * Throws a console error if debug mode is enabled
         * @param {any[]} args Error message
         */
    function () {
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
     * @param {any[]} args Error message
     */
    /**
         * Throws a console warning if debug mode is enabled
         * @param {any[]} args Error message
         */
    ImageLoader.prototype.throwWarning = /**
         * Throws a console warning if debug mode is enabled
         * @param {any[]} args Error message
         */
    function () {
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
     * @param directory {string} The directory to check. Either this.file.tempDirectory or this.getFileCacheDirectory()
     * @returns {Promise<boolean|FileError>} Returns a promise that resolves if exists, and rejects if it doesn't
     */
    /**
         * Check if the cache directory exists
         * @param directory {string} The directory to check. Either this.file.tempDirectory or this.getFileCacheDirectory()
         * @returns {Promise<boolean|FileError>} Returns a promise that resolves if exists, and rejects if it doesn't
         */
    ImageLoader.prototype.cacheDirectoryExists = /**
         * Check if the cache directory exists
         * @param directory {string} The directory to check. Either this.file.tempDirectory or this.getFileCacheDirectory()
         * @returns {Promise<boolean|FileError>} Returns a promise that resolves if exists, and rejects if it doesn't
         */
    function (directory) {
        return this.file.checkDir(directory, this.config.cacheDirectoryName);
    };
    /**
     * Create the cache directories
     * @param replace {boolean} override directory if exists
     * @returns {Promise<DirectoryEntry|FileError>} Returns a promise that resolves if the directories were created, and rejects on error
     */
    /**
         * Create the cache directories
         * @param replace {boolean} override directory if exists
         * @returns {Promise<DirectoryEntry|FileError>} Returns a promise that resolves if the directories were created, and rejects on error
         */
    ImageLoader.prototype.createCacheDirectory = /**
         * Create the cache directories
         * @param replace {boolean} override directory if exists
         * @returns {Promise<DirectoryEntry|FileError>} Returns a promise that resolves if the directories were created, and rejects on error
         */
    function (replace) {
        var _this = this;
        if (replace === void 0) { replace = false; }
        var cacheDirectoryPromise, tempDirectoryPromise;
        if (replace) {
            // create or replace the cache directory
            cacheDirectoryPromise = this.file.createDir(this.getFileCacheDirectory(), this.config.cacheDirectoryName, replace);
        }
        else {
            // check if the cache directory exists.
            // if it does not exist create it!
            cacheDirectoryPromise = this.cacheDirectoryExists(this.getFileCacheDirectory())
                .catch(function () { return _this.file.createDir(_this.getFileCacheDirectory(), _this.config.cacheDirectoryName, false); });
        }
        if (this.isWKWebView && !this.isIonicWKWebView) {
            if (replace) {
                // create or replace the temp directory
                tempDirectoryPromise = this.file.createDir(this.file.tempDirectory, this.config.cacheDirectoryName, replace);
            }
            else {
                // check if the temp directory exists.
                // if it does not exist create it!
                tempDirectoryPromise = this.cacheDirectoryExists(this.file.tempDirectory).catch(function () {
                    return _this.file.createDir(_this.file.tempDirectory, _this.config.cacheDirectoryName, false);
                });
            }
        }
        else {
            tempDirectoryPromise = Promise.resolve();
        }
        return Promise.all([cacheDirectoryPromise, tempDirectoryPromise]);
    };
    /**
     * Creates a unique file name out of the URL
     * @param {string} url URL of the file
     * @returns {string} Unique file name
     */
    /**
         * Creates a unique file name out of the URL
         * @param {string} url URL of the file
         * @returns {string} Unique file name
         */
    ImageLoader.prototype.createFileName = /**
         * Creates a unique file name out of the URL
         * @param {string} url URL of the file
         * @returns {string} Unique file name
         */
    function (url) {
        // hash the url to get a unique file name
        return (this.hashString(url).toString() +
            (this.config.fileNameCachedWithExtension
                ? this.getExtensionFromUrl(url)
                : ''));
    };
    /**
     * Converts a string to a unique 32-bit int
     * @param {string} string string to hash
     * @returns {number} 32-bit int
     */
    /**
         * Converts a string to a unique 32-bit int
         * @param {string} string string to hash
         * @returns {number} 32-bit int
         */
    ImageLoader.prototype.hashString = /**
         * Converts a string to a unique 32-bit int
         * @param {string} string string to hash
         * @returns {number} 32-bit int
         */
    function (string) {
        var hash = 0, char;
        if (string.length === 0) {
            return hash;
        }
        for (var i = 0; i < string.length; i++) {
            char = string.charCodeAt(i);
            // tslint:disable-next-line
            hash = (hash << 5) - hash + char;
            // tslint:disable-next-line
            hash = hash & hash;
        }
        return hash;
    };
    /**
     * Extract extension from filename or url
     *
     * @param {string} url
     * @returns {string}
     */
    /**
         * Extract extension from filename or url
         *
         * @param {string} url
         * @returns {string}
         */
    ImageLoader.prototype.getExtensionFromUrl = /**
         * Extract extension from filename or url
         *
         * @param {string} url
         * @returns {string}
         */
    function (url) {
        var urlWitoutParams = url.split(/\#|\?/)[0];
        return (urlWitoutParams.substr((~-urlWitoutParams.lastIndexOf('.') >>> 0) + 1) ||
            this.config.fallbackFileNameCachedExtension);
    };
    ImageLoader.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    ImageLoader.ctorParameters = function () { return [
        { type: ImageLoaderConfig, },
        { type: File, },
        { type: HTTP, },
        { type: Platform, },
    ]; };
    return ImageLoader;
}());
export { ImageLoader };
//# sourceMappingURL=image-loader.js.map