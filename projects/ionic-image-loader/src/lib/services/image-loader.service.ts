import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { File, FileEntry } from '@ionic-native/file/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { Platform } from '@ionic/angular';
import { fromEvent, Subject } from 'rxjs';
import { filter, first, take } from 'rxjs/operators';
import { ImageLoaderConfigService } from './image-loader-config.service';

interface IndexItem {
  name: string;
  modificationTime: Date;
  size: number;
}

interface QueueItem {
  imageUrl: string;
  resolve: Function;
  reject: Function;
}

declare const Ionic: any;

const EXTENSIONS = ['jpg', 'png', 'jpeg', 'gif', 'svg', 'tiff'];

@Injectable({
  providedIn: 'root',
})
export class ImageLoaderService {

  /**
   * Indicates if the cache service is ready.
   * When the cache service isn't ready, images are loaded via browser instead.
   */
  private isCacheReady = false;
  /**
   * Indicates if this service is initialized.
   * This service is initialized once all the setup is done.
   */
  private isInit = false;
  private initPromiseResolve: Function;
  private initPromise = new Promise<void>(resolve => this.initPromiseResolve = resolve);
  private lockSubject = new Subject<boolean>();
  private lock$ = this.lockSubject.asObservable();
  /**
   * Number of concurrent requests allowed
   */
  private concurrency = 5;
  /**
   * Queue items
   */
  private queue: QueueItem[] = [];
  private processing = 0;
  /**
   * Fast accessible Object for currently processing items
   */
  private currentlyProcessing: { [index: string]: Promise<any> } = {};
  private cacheIndex: IndexItem[] = [];
  private currentCacheSize = 0;
  private indexed = false;
  private lockedCallsQueue: Function[] = [];

  constructor(
    private config: ImageLoaderConfigService,
    private file: File,
    private http: HttpClient,
    private platform: Platform,
    private webview: WebView,
  ) {
    if (!platform.is('cordova')) {
      // we are running on a browser, or using livereload
      // plugin will not function in this case
      this.isInit = true;
      this.throwWarning(
        'You are running on a browser or using livereload, IonicImageLoader will not function, falling back to browser loading.',
      );
      this.initPromiseResolve();
    } else {
      fromEvent(document, 'deviceready')
        .pipe(first())
        .subscribe(res => {
          if (this.nativeAvailable) {
            this.initCache();
          } else {
            // we are running on a browser, or using livereload
            // plugin will not function in this case
            this.isInit = true;
            this.initPromiseResolve();
            this.throwWarning(
              'You are running on a browser or using livereload, IonicImageLoader will not function, falling back to browser loading.',
            );
          }
        });
    }
  }

  get nativeAvailable(): boolean {
    return File.installed();
  }

  private get isCacheSpaceExceeded(): boolean {
    return (
      this.config.maxCacheSize > -1 &&
      this.currentCacheSize > this.config.maxCacheSize
    );
  }

  private get isWKWebView(): boolean {
    return (
      this.platform.is('ios') &&
      (<any>window).webkit &&
      (<any>window).webkit.messageHandlers
    );
  }

  private get isIonicWKWebView(): boolean {
    return (
      //  Important: isWKWebview && isIonicWKWebview must be mutually excluse.
      //  Otherwise the logic for copying to tmp under IOS will fail.
      (this.platform.is('android') && this.webview) ||
      (this.platform.is('android')) && (location.host === 'localhost:8080') ||
      (<any>window).LiveReload);
  }

  private get isDevServer(): boolean {
    return window['IonicDevServer'] !== undefined;
  }

  /**
   * Check if we can process more items in the queue
   */
  private get canProcess(): boolean {
    return this.queue.length > 0 && this.processing < this.concurrency;
  }

  ready(): Promise<void> {
    return this.initPromise;
  }

  /**
   * Preload an image
   * @param imageUrl Image URL
   * @returns returns a promise that resolves with the cached image URL
   */
  preload(imageUrl: string): Promise<string> {
    return this.getImagePath(imageUrl);
  }

  getFileCacheDirectory() {
    if (this.config.cacheDirectoryType === 'data') {
      return this.file.dataDirectory;
    } else if (this.config.cacheDirectoryType === 'external') {
      return this.platform.is('android') ? this.file.externalDataDirectory : this.file.documentsDirectory;
    }
    return this.file.cacheDirectory;
  }

  /**
   * Clears cache of a single image
   * @param imageUrl Image URL
   */
  async clearImageCache(imageUrl: string) {
    if (!this.platform.is('cordova')) {
      return;
    }

    await this.ready();

    this.runLocked(async () => {
      const fileName = this.createFileName(imageUrl);
      const route = this.getFileCacheDirectory() + this.config.cacheDirectoryName;
      // pause any operations
      this.isInit = false;

      try {
        await this.file.removeFile(route, fileName);

        if (this.isWKWebView && !this.isIonicWKWebView) {
          await this.file.removeFile(this.file.tempDirectory + this.config.cacheDirectoryName, fileName);
        }
      } catch (err) {
        this.throwError(err);
      }

      return this.initCache(true);
    });
  }

  /**
   * Clears the cache
   */
  async clearCache() {
    if (!this.platform.is('cordova')) {
      return;
    }

    await this.ready();

    this.runLocked(async () => {
      try {
        await this.file.removeRecursively(this.getFileCacheDirectory(), this.config.cacheDirectoryName);

        if (this.isWKWebView && !this.isIonicWKWebView) {
          // also clear the temp files
          try {
            this.file.removeRecursively(this.file.tempDirectory, this.config.cacheDirectoryName);
          } catch (err) {
            // Noop catch. Removing the tempDirectory might fail,
            // as it is not persistent.
          }
        }
      } catch (err) {
        this.throwError(err);
      }

      return this.initCache(true);
    });
  }

  /**
   * Gets the filesystem path of an image.
   * This will return the remote path if anything goes wrong or if the cache service isn't ready yet.
   * @param imageUrl The remote URL of the image
   * @returns Returns a promise that will always resolve with an image URL
   */
  async getImagePath(imageUrl: string): Promise<string> {
    if (typeof imageUrl !== 'string' || imageUrl.length <= 0) {
      throw new Error('The image url provided was empty or invalid.');
    }

    await this.ready();

    if (!this.isCacheReady) {
      this.throwWarning('The cache system is not running. Images will be loaded by your browser instead.');
      return imageUrl;
    }

    if (this.isImageUrlRelative(imageUrl)) {
      return imageUrl;
    }

    try {
      return await this.getCachedImagePath(imageUrl);
    } catch (err) {
      // image doesn't exist in cache, lets fetch it and save it
      return this.addItemToQueue(imageUrl);
    }
  }

  private async processLockedQueue() {
    if (await this.getLockedState()) {
      return;
    }

    if (this.lockedCallsQueue.length > 0) {
      await this.setLockedState(true);

      try {
        await this.lockedCallsQueue.slice(0, 1)[0]();
      } catch (err) {
        console.log('Error running locked function: ', err);
      }

      await this.setLockedState(false);
      return this.processLockedQueue();
    }
  }

  private getLockedState(): Promise<boolean> {
    return this.lock$
      .pipe(take(1))
      .toPromise();
  }

  private awaitUnlocked(): Promise<boolean> {
    return this.lock$
      .pipe(
        filter(locked => !!locked),
        take(1),
      )
      .toPromise();
  }

  private async setLockedState(locked: boolean) {
    this.lockSubject.next(locked);
  }

  private runLocked(fn: Function) {
    this.lockedCallsQueue.push(fn);
    this.processLockedQueue();
  }

  /**
   * Returns if an imageUrl is an relative path
   * @param imageUrl
   */
  private isImageUrlRelative(imageUrl: string) {
    return !/^(https?|file):\/\/\/?/i.test(imageUrl);
  }

  /**
   * Add an item to the queue
   * @param imageUrl
   * @param resolve
   * @param reject
   */
  private addItemToQueue(imageUrl: string, resolve?, reject?): void | Promise<any> {
    let p: void | Promise<any>;

    if (!resolve && !reject) {
      p = new Promise<any>((res, rej) => {
        resolve = res;
        reject = rej;
      });
    } else {
      resolve = resolve || (() => {
      });
      reject = reject || (() => {
      });
    }

    this.queue.push({
      imageUrl,
      resolve,
      reject,
    });

    this.processQueue();

    return p;
  }

  /**
   * Processes one item from the queue
   */
  private async processQueue() {
    // make sure we can process items first
    if (!this.canProcess) {
      return;
    }

    // increase the processing number
    this.processing++;

    // take the first item from queue
    const currentItem: QueueItem = this.queue.splice(0, 1)[0];

    // function to call when done processing this item
    // this will reduce the processing number
    // then will execute this function again to process any remaining items
    const done = () => {
      this.processing--;
      this.processQueue();

      // only delete if it's the last/unique occurrence in the queue
      if (this.currentlyProcessing[currentItem.imageUrl] !== undefined && !this.currentlyInQueue(currentItem.imageUrl)) {
        delete this.currentlyProcessing[currentItem.imageUrl];
      }
    };

    const error = (e) => {
      currentItem.reject();
      this.throwError(e);
      done();
    };

    if (this.currentlyProcessing[currentItem.imageUrl] !== undefined) {
      try {
        // Prevented same Image from loading at the same time
        await this.currentlyProcessing[currentItem.imageUrl];
        const localUrl = await this.getCachedImagePath(currentItem.imageUrl);
        currentItem.resolve(localUrl);
        done();
      } catch (err) {
        error(err);
      }
      return;
    }

    this.currentlyProcessing[currentItem.imageUrl] = (async () => {
      // process more items concurrently if we can
      if (this.canProcess) {
        this.processQueue();
      }

      const localDir = this.getFileCacheDirectory() + this.config.cacheDirectoryName + '/';
      const fileName = this.createFileName(currentItem.imageUrl);

      try {
        const data: Blob = await this.http.get(currentItem.imageUrl, {
          responseType: 'blob',
          headers: this.config.httpHeaders,
        }).toPromise();

        const file = await this.file.writeFile(localDir, fileName, data, {replace: true}) as FileEntry;

        if (this.isCacheSpaceExceeded) {
          this.maintainCacheSize();
        }

        await this.addFileToIndex(file);
        const localUrl = await this.getCachedImagePath(currentItem.imageUrl);
        currentItem.resolve(localUrl);
        done();
        this.maintainCacheSize();
      } catch (err) {
        error(err);
        throw err;
      }
    })();

  }

  /**
   * Search if the url is currently in the queue
   * @param imageUrl Image url to search
   */
  private currentlyInQueue(imageUrl: string) {
    return this.queue.some(item => item.imageUrl === imageUrl);
  }

  /**
   * Initialize the cache service
   * @param [replace] Whether to replace the cache directory if it already exists
   */
  private async initCache(replace?: boolean) {
    this.concurrency = this.config.concurrency;

    // create cache directories if they do not exist
    try {
      await this.createCacheDirectory(replace);
      await this.indexCache();
      this.isCacheReady = true;
    } catch (err) {
      this.throwError(err);
    }

    this.isInit = true;
    this.initPromiseResolve();
  }

  /**
   * Adds a file to index.
   * Also deletes any files if they are older than the set maximum cache age.
   * @param file FileEntry to index
   */
  private async addFileToIndex(file: FileEntry): Promise<any> {
    const metadata = await new Promise<any>((resolve, reject) => file.getMetadata(resolve, reject));

    if (
      this.config.maxCacheAge > -1 &&
      Date.now() - metadata.modificationTime.getTime() >
      this.config.maxCacheAge
    ) {
      // file age exceeds maximum cache age
      return this.removeFile(file.name);
    } else {
      // file age doesn't exceed maximum cache age, or maximum cache age isn't set
      this.currentCacheSize += metadata.size;

      // add item to index
      this.cacheIndex.push({
        name: file.name,
        modificationTime: metadata.modificationTime,
        size: metadata.size,
      });
    }
  }

  /**
   * Indexes the cache if necessary
   */
  private async indexCache(): Promise<void> {
    this.cacheIndex = [];

    try {
      const files = await this.file.listDir(this.getFileCacheDirectory(), this.config.cacheDirectoryName);
      await Promise.all(files.map(this.addFileToIndex.bind(this)));
      // Sort items by date. Most recent to oldest.
      this.cacheIndex = this.cacheIndex.sort(
        (a: IndexItem, b: IndexItem): number => (a > b ? -1 : a < b ? 1 : 0),
      );
      this.indexed = true;
    } catch (err) {
      this.throwError(err);
    }
  }

  /**
   * This method runs every time a new file is added.
   * It checks the cache size and ensures that it doesn't exceed the maximum cache size set in the config.
   * If the limit is reached, it will delete old images to create free space.
   */
  private async maintainCacheSize() {
    if (this.config.maxCacheSize > -1 && this.indexed) {
      const maintain = async () => {
        if (this.currentCacheSize > this.config.maxCacheSize) {
          // grab the first item in index since it's the oldest one
          const file: IndexItem = this.cacheIndex.splice(0, 1)[0];

          if (typeof file === 'undefined') {
            return maintain();
          }

          // delete the file then process next file if necessary
          try {
            await this.removeFile(file.name);
          } catch (err) {
            // ignore errors, nothing we can do about it
          }

          this.currentCacheSize -= file.size;
          return maintain();
        }
      };

      return maintain();
    }
  }

  /**
   * Remove a file
   * @param file The name of the file to remove
   */
  private async removeFile(file: string): Promise<any> {
    await this.file.removeFile(this.getFileCacheDirectory() + this.config.cacheDirectoryName, file);

    if (this.isWKWebView && !this.isIonicWKWebView) {
      try {
        return this.file.removeFile(this.file.tempDirectory + this.config.cacheDirectoryName, file);
      } catch (err) {
        // Noop catch. Removing the files from tempDirectory might fail, as it is not persistent.
      }
    }
  }

  /**
   * Get the local path of a previously cached image if exists
   * @param url The remote URL of the image
   * @returns Returns a promise that resolves with the local path if exists, or rejects if doesn't exist
   */
  private async getCachedImagePath(url: string): Promise<string> {
    await this.ready();

    if (!this.isCacheReady) {
      throw new Error('Cache is not ready');
    }

    // if we're running with livereload, ignore cache and call the resource from it's URL
    if (this.isDevServer) {
      return url;
    }

    // get file name
    const fileName = this.createFileName(url);

    // get full path
    const dirPath = this.getFileCacheDirectory() + this.config.cacheDirectoryName,
      tempDirPath = this.file.tempDirectory + this.config.cacheDirectoryName;

    try {
      // check if exists
      const fileEntry = await this.file.resolveLocalFilesystemUrl(dirPath + '/' + fileName) as FileEntry;

      // file exists in cache
      if (this.config.imageReturnType === 'base64') {
        // read the file as data url and return the base64 string.
        // should always be successful as the existence of the file
        // is already ensured
        const base64: string = await this.file.readAsDataURL(dirPath, fileName);
        return base64.replace('data:null', 'data:*/*');
      } else if (this.config.imageReturnType !== 'uri') {
        return;
      }

      // now check if iOS device & using WKWebView Engine.
      // in this case only the tempDirectory is accessible,
      // therefore the file needs to be copied into that directory first!
      if (this.isIonicWKWebView) {
        return this.normalizeUrl(fileEntry);
      }

      if (!this.isWKWebView) {
        // return native path
        return fileEntry.nativeURL;
      }

      // check if file already exists in temp directory
      try {
        const tempFileEntry = await this.file.resolveLocalFilesystemUrl(tempDirPath + '/' + fileName) as FileEntry;
        // file exists in temp directory
        // return native path
        return this.normalizeUrl(tempFileEntry);
      } catch (err) {
        // file does not yet exist in the temp directory.
        // copy it!
        const tempFileEntry = await this.file
          .copyFile(dirPath, fileName, tempDirPath, fileName) as FileEntry;

        // now the file exists in the temp directory
        // return native path
        return this.normalizeUrl(tempFileEntry);
      }
    } catch (err) {
      throw new Error('File does not exist');
    }
  }

  /**
   * Normalizes the image uri to a version that can be loaded in the webview
   * @param fileEntry the FileEntry of the image file
   * @returns the normalized Url
   */

  private normalizeUrl(fileEntry: FileEntry): string {
    // Use Ionic normalizeUrl to generate the right URL for Ionic WKWebView
    if (Ionic && typeof Ionic.normalizeURL === 'function') {
      return Ionic.normalizeURL(fileEntry.nativeURL);
    }
    // use new webview function to do the trick
    if (this.webview) {
      return this.webview.convertFileSrc(fileEntry.nativeURL);
    }
    return fileEntry.nativeURL;
  }

  /**
   * Throws a console error if debug mode is enabled
   * @param args Error message
   */
  private throwError(...args: any[]) {
    if (this.config.debugMode) {
      args.unshift('ImageLoader Error: ');
      console.error.apply(console, args);
    }
  }

  /**
   * Throws a console warning if debug mode is enabled
   * @param args Error message
   */
  private throwWarning(...args: any[]) {
    if (this.config.debugMode) {
      args.unshift('ImageLoader Warning: ');
      console.warn.apply(console, args);
    }
  }

  /**
   * Check if the cache directory exists
   * @param directory The directory to check. Either this.file.tempDirectory or this.getFileCacheDirectory()
   * @returns Returns a promise that resolves if exists, and rejects if it doesn't
   */
  private cacheDirectoryExists(directory: string): Promise<boolean> {
    return this.file.checkDir(directory, this.config.cacheDirectoryName);
  }

  /**
   * Create the cache directories
   * @param replace override directory if exists
   * @returns Returns a promise that resolves if the directories were created, and rejects on error
   */
  private createCacheDirectory(replace: boolean = false): Promise<any> {
    let cacheDirectoryPromise: Promise<any>, tempDirectoryPromise: Promise<any>;

    if (replace) {
      // create or replace the cache directory
      cacheDirectoryPromise = this.file.createDir(this.getFileCacheDirectory(), this.config.cacheDirectoryName, replace);
    } else {
      // check if the cache directory exists.
      // if it does not exist create it!
      cacheDirectoryPromise = this.cacheDirectoryExists(this.getFileCacheDirectory())
        .catch(() => this.file.createDir(this.getFileCacheDirectory(), this.config.cacheDirectoryName, false));
    }

    if (this.isWKWebView && !this.isIonicWKWebView) {
      if (replace) {
        // create or replace the temp directory
        tempDirectoryPromise = this.file.createDir(
          this.file.tempDirectory,
          this.config.cacheDirectoryName,
          replace,
        );
      } else {
        // check if the temp directory exists.
        // if it does not exist create it!
        tempDirectoryPromise = this.cacheDirectoryExists(
          this.file.tempDirectory,
        ).catch(() =>
          this.file.createDir(
            this.file.tempDirectory,
            this.config.cacheDirectoryName,
            false,
          ),
        );
      }
    } else {
      tempDirectoryPromise = Promise.resolve();
    }

    return Promise.all([cacheDirectoryPromise, tempDirectoryPromise]);
  }

  /**
   * Creates a unique file name out of the URL
   * @param url URL of the file
   * @returns Unique file name
   */
  private createFileName(url: string): string {
    // hash the url to get a unique file name
    return (
      this.hashString(url).toString() +
      (this.config.fileNameCachedWithExtension
        ? this.getExtensionFromUrl(url)
        : '')
    );
  }

  /**
   * Converts a string to a unique 32-bit int
   * @param string string to hash
   * @returns 32-bit int
   */
  private hashString(string: string): number {
    let hash = 0,
      char;
    if (string.length === 0) {
      return hash;
    }
    for (let i = 0; i < string.length; i++) {
      char = string.charCodeAt(i);
      // tslint:disable-next-line
      hash = (hash << 5) - hash + char;
      // tslint:disable-next-line
      hash = hash & hash;
    }
    return hash;
  }

  /**
   * Extract extension from filename or url
   *
   * @param url
   * @returns
   *
   * Not always will url's contain a valid image extention. We'll check if any valid extention is supplied.
   * If not, we will use the default.
   */
  private getExtensionFromUrl(url: string): string {
    const urlWitoutParams = url.split(/\#|\?/)[0];
    const ext: string = (urlWitoutParams.substr((~-urlWitoutParams.lastIndexOf('.') >>> 0) + 1) || '').toLowerCase();

    return (
      EXTENSIONS.indexOf(ext) >= 0 ? ext : this.config.fallbackFileNameCachedExtension
    );
  }
}
