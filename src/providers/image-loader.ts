import { Injectable } from '@angular/core';
import { File, FileEntry, Transfer } from 'ionic-native';
import { ImageLoaderConfig } from "./image-loader-config";

declare var cordova: any;

@Injectable()
export class ImageLoader {

  /**
   * Indicates if the cache service is ready.
   * When the cache service isn't ready, images are loaded via browser instead.
   * @type {boolean}
   */
  private isCacheReady: boolean = false;

  /**
   * Indicates if this service is initialized.
   * This service is initialized once all the setup is done.
   * @type {boolean}
   */
  private isInit: boolean = false;

  /**
   * Number of concurrent requests allowed
   * @type {number}
   */
  private concurrency: number = 5;

  /**
   * Queue items
   * @type {Array}
   */
  private queue: Array<{
    imageUrl: string;
    resolve: Function;
    reject: Function;
  }> = [];

  private processing: number = 0;

  constructor(private config: ImageLoaderConfig) {
    if (window.location.protocol === 'http:' || window.location.protocol === 'https:') {
      // we are running on a browser, or using livereload
      // plugin will not function in this case
      this.isInit = true;
      this.throwWarning('You are running on a browser or using livereload, IonicImageLoader will not function, falling back to browser loading.');
    } else {
      document.addEventListener('deviceready', () => {
        this.initCache();
      }, false);
    }
  }

  /**
   * Clears the cache
   */
  clearCache(): void {

    const clear = () => {

      if (!this.isInit) {
        // do not run this method until our service is initialized
        setTimeout(clear.bind(this), 500);
        return;
      }

      // pause any operations
      this.isInit = false;

      File.removeRecursively(cordova.file.cacheDirectory, this.config.cacheDirectoryName)
        .then(() => {
          this.initCache(true);
        })
        .catch(this.throwError.bind(this));

    };

    clear();

  }

  /**
   * Downloads an image via cordova-plugin-file-transfer
   * @param imageUrl {string} The remote URL of the image
   * @param localPath {string} The local path to store the image at
   * @returns {Promise<any>} Returns a promise that resolves when the download is complete, or rejects on error.
   */
  private downloadImage(imageUrl: string, localPath: string): Promise<any> {
    let transfer = new Transfer();
    return transfer.download(imageUrl, localPath);
  }

  /**
   * Gets the filesystem path of an image.
   * This will return the remote path if anything goes wrong or if the cache service isn't ready yet.
   * @param imageUrl {string} The remote URL of the image
   * @returns {Promise<string>} Returns a promise that will always resolve with an image URL
   */
  getImagePath(imageUrl: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {

      let getImage = () => {
        this.getCachedImagePath(imageUrl)
          .then(imagePath => {
            resolve(imagePath);
          })
          .catch(() => {
            // image doesn't exist in cache, lets fetch it and save it
            this.addItemToQueue(imageUrl, resolve, reject);
          });

      };

      let check = () => {
        if (this.isInit) {
          if (this.isCacheReady) {
            getImage();
          } else {
            this.throwWarning('The cache system is not running. Images will be loaded by your browser instead.');
            resolve(imageUrl);
          }
        } else  {
          setTimeout(() => check(), 250);
        }
      };

      check();

    });

  }

  /**
   * Add an item to the queue
   * @param imageUrl
   * @param resolve
   * @param reject
   */
  private addItemToQueue(imageUrl: string, resolve, reject): void {

    this.queue.push({
      imageUrl,
      resolve,
      reject
    });

    this.processQueue();

  }

  /**
   * Check if we can process more items in the queue
   * @returns {boolean}
   */
  private get canProcess(): boolean {
    return (
      this.queue.length > 0
      && this.processing < this.concurrency
    );
  }

  /**
   * Processes one item from the queue
   */
  private processQueue() {

    // make sure we can process items first
    if (!this.canProcess) return;

    // increase the processing number
    this.processing++;

    // take the first item from queue
    const currentItem = this.queue.splice(0,1)[0];

    // process more items concurrently if we can
    if (this.canProcess) this.processQueue();

    // function to call when done processing this item
    // this will reduce the processing number
    // then will execute this function again to process any remaining items
    const done = () => {
      this.processing--;
      this.processQueue();
    };

    let localPath = cordova.file.cacheDirectory + this.config.cacheDirectoryName + '/' + this.createFileName(currentItem.imageUrl);
    this.downloadImage(currentItem.imageUrl, localPath)
      .then(() => {
        currentItem.resolve(localPath);

        done();
      })
      .catch((e) => {
        currentItem.reject();
        this.throwError(e);

        done();
      });

  }

  /**
   * Initialize the cache service
   * @param replace {boolean} Whether to replace the cache directory if it already exists
   */
  private initCache(replace?: boolean): void {

    this.concurrency = this.config.concurrency;

    if (!this.filePluginExists) {
      this.isInit = true;
      return;
    }

    this.cacheDirectoryExists
      .then(() => {

        // exists

        this.isCacheReady = true;
        this.isInit = true;

      })
      .catch(() => {

        // doesn't exist

        this.createCacheDirectory(replace)
          .then(() => {

            this.isCacheReady = true;
            this.isInit = true;

          })
          .catch(e => {

            this.throwError(e);
            this.isInit = true;

          });

      });

  }

  /**
   * Get the local path of a previously cached image if exists
   * @param url {string} The remote URL of the image
   * @returns {Promise<string>} Returns a promise that resolves with the local path if exists, or rejects if doesn't exist
   */
  private getCachedImagePath(url: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {

      // make sure cache is ready
      if (!this.isCacheReady) {
        return reject();
      }

      // get file name
      let fileName = this.createFileName(url);

      // get full path
      let dirPath = cordova.file.cacheDirectory + this.config.cacheDirectoryName;

      // check if exists
      File.resolveLocalFilesystemUrl(dirPath + '/' + fileName)
        .then((fileEntry: FileEntry) => {
          // file exists in cache
          resolve(fileEntry.nativeURL);
        })
        .catch(reject); // file doesn't exist

    });
  }

  /**
   * Throws a console error if debug mode is enabled
   * @param error {string} Error message
   */
  private throwError(error: any): void {
    if (this.config.debugMode) {
      console.error('ImageLoader Error', error);
    }
  }

  /**
   * Throws a console warning if debug mode is enabled
   * @param error {string} Error message
   */
  private throwWarning(error: any): void {
    if (this.config.debugMode) {
      console.warn('ImageLoader Warning', error);
    }
  }

  /**
   * Check if file plugin exists
   * @returns {boolean} returns a boolean that indicates whether the plugin exists
   */
  private get filePluginExists(): boolean {
    if (!cordova || !cordova.file) {
      this.throwWarning('Unable to find the cordova file plugin. ImageLoader will not cache images.');
      return false;
    }
    return true;
  }

  /**
   * Check if the cache directory exists
   * @returns {Promise<boolean|FileError>} Returns a promise that resolves if exists, and rejects if it doesn't
   */
  private get cacheDirectoryExists(): Promise<boolean> {
    return <Promise<boolean>>File.checkDir(cordova.file.cacheDirectory, this.config.cacheDirectoryName);
  }

  /**
   * Creates the cache directory
   * @param replace {boolean} override directory if exists
   * @returns {Promise<DirectoryEntry|FileError>} Returns a promise that resolves if the directory was created, and rejects on error
   */
  private createCacheDirectory(replace: boolean = false): Promise<any> {
    return File.createDir(cordova.file.cacheDirectory, this.config.cacheDirectoryName, replace);
  }

  /**
   * Creates a unique file name out of the URL
   * @param url {string} URL of the file
   * @returns {string} Unique file name
   */
  private createFileName(url: string): string {
    // hash the url to get a unique file name
    return this.hashString(url).toString();
  }

  /**
   * Converts a string to a unique 32-bit int
   * @param string {string} string to hash
   * @returns {number} 32-bit int
   */
  private hashString(string: string): number {
    let hash = 0;
    let char;
    if (string.length === 0) return hash;
    for (let i = 0; i < string.length; i++) {
      char = string.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return hash;
  }

}
