import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { HTTP, File, DirectoryEntry, FileError, FileEntry } from 'ionic-native';
import { Platform } from 'ionic-angular';
import { ImageLoaderConfig } from "./image-loader-config";

declare var cordovaHTTP: any;
declare var cordova: any;

@Injectable()
export class ImageLoader {

  private isNativeHttpAvailable: boolean = false;
  private isCacheReady: boolean = false;

  constructor(private http: Http,
              private platform: Platform,
              private config: ImageLoaderConfig) {
  }

  ngOnInit(): void {
    this.platform.ready().then(() => {
      if (typeof cordovaHTTP !== 'undefined') {
        this.isNativeHttpAvailable = true;
      } else if (this.config.debugMode) {
        console.info('ImageLoader: Falling back to @angular/http since cordovaHTTP isn\'t available');
      }
      this.initCache();
    });
  }

  getImagePath(imageUrl: string): Promise<string> {
    if (this.isCacheReady) {
      return new Promise<string>((resolve) => {
        this.getCachedImagePath(imageUrl)
          .then(imagePath => resolve(imagePath))
          .catch(() => {
            // image doesn't exist in cache, lets fetch it and save it
            this.getRawImage(imageUrl)
              .then(image => {
                this.cacheImage(image, this.createFileName(imageUrl))
                  .then(() => {
                    this.getCachedImagePath(imageUrl)
                      .then(imagePath => resolve(imagePath))
                      .catch((e) => {
                        this.throwError(e);
                        resolve(imageUrl);
                      });
                  })
                  .catch((e) => {
                    this.throwError(e);
                    resolve(imageUrl);
                  });
              })
              .catch((e) => {
                this.throwError(e);
                resolve(imageUrl);
              });
          });
      });
    } else {
      this.throwWarning('The cache system is not running. Images will be loaded by your browser instead.');
      return Promise.resolve(imageUrl);
    }
  }

  private initCache(replace?: boolean): void {
    if (!this.filePluginExists) {
      return;
    }

    this.cacheDirectoryExists
      .then((exists: boolean) => {
        if (exists) {
          this.isCacheReady = true;
        } else {
          this.createCacheDirectory(replace)
            .then((dirEntry: DirectoryEntry) => this.isCacheReady = true)
            .catch(this.throwError);
        }
      })
      .catch(this.throwError);
  }

  private getRawImage(url: string): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      if (this.isNativeHttpAvailable) {
        // cordovaHTTP is available, lets get the image via background thread
        HTTP.get(url, {}, {})
          .then(
            data => {
              console.log(data);
            },
            reject
          );
      } else {
        // cordovaHTTP isn't available so we'll use @angular/http
        this.http.get(url)
          .subscribe(
            data => {
              console.log(data);
              resolve(data.arrayBuffer());
            },
            reject
          );
      }
    });
  }

  /**
   *
   * @param image {ArrayBuffer} Image in binary
   * @param fileName {string} File name to save as
   * @returns {Promise<string>} Promise that resolves with native URL of file
   */
  private cacheImage(image: ArrayBuffer, fileName: string): Promise<void> {
    return File.writeFile(cordova.file.cacheDirectory + '/' + this.config.cacheDirectoryName, fileName, new Blob([image]), {replace: true});
  }

  private getCachedImagePath(url: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      if (!this.isCacheReady) {
        return reject();
      }
      let fileName = this.createFileName(url);
      let dirPath = cordova.file.cacheDirectory + '/' + this.config.cacheDirectoryName;
      File.checkFile(dirPath, fileName)
        .then((exists: boolean) => {
          if (exists) {

            File.resolveLocalFilesystemUrl(dirPath + '/' + fileName)
              .then((fileEntry: FileEntry) => {
                resolve(fileEntry.nativeURL);
              })
              .catch(reject);

          } else {
            reject();
          }
        })
        .catch(this.throwError);
    });
  }

  private throwError(error: any): void {
    if (this.config.debugMode) {
      console.error('ImageLoader Error', error);
    }
  }

  private throwWarning(error: any): void {
    if (this.config.debugMode) {
      console.warn('ImageLoader Warning', error);
    }
  }

  private get filePluginExists(): boolean {
    if (!cordova || !cordova.file) {
      this.throwWarning('Unable to find the cordova file plugin. ImageLoader will not cache images.');
      return false;
    }
    return true;
  }

  private get cacheDirectoryExists(): Promise<boolean> {
    return File.checkDir(cordova.file.cacheDirectory, this.config.cacheDirectoryName);
  }

  private createCacheDirectory(replace: boolean = false): Promise<any> {
    return File.createDir(cordova.file.cacheDirectory, this.config.cacheDirectoryName, replace);
  }

  /**
   * Creates a unique file name out of the URL
   * @param url {string} URL of the file
   * @returns {string} Unique file name
   */
  private createFileName(url: string): string {
    // get file extension and clean up anything after the extension
    let ext: string = url.split('.').pop().split(/\#|\?/)[0];
    // hash the url to get a unique file name
    let hash = this.hashString(url);
    return hash + '.' + ext;
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
