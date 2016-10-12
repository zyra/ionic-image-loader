import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import {HTTP, File, DirectoryEntry, FileEntry, Transfer} from 'ionic-native';
import { Platform } from 'ionic-angular';
import { ImageLoaderConfig } from "./image-loader-config";

declare var cordovaHTTP: any;
declare var cordova: any;

@Injectable()
export class ImageLoader {

  private isCacheReady: boolean = false;
  private isInit: boolean = false;

  constructor(private http: Http,
              private platform: Platform,
              private config: ImageLoaderConfig) {
    this.platform.ready().then(() => {
      this.initCache();
    });
  }

  private downloadImage(imageUrl: string, localPath: string): Promise<any> {
    let transfer = new Transfer();
    return transfer.download(imageUrl, localPath);
  }

  getImagePath(imageUrl: string): Promise<string> {
    return new Promise<string>((resolve) => {

      let getImage = () => {
        this.getCachedImagePath(imageUrl)
          .then(imagePath => {
            resolve(imagePath);
          })
          .catch(() => {
            // image doesn't exist in cache, lets fetch it and save it
            let localPath = cordova.file.cacheDirectory + this.config.cacheDirectoryName + '/' + this.createFileName(imageUrl);
            this.downloadImage(imageUrl, localPath)
              .then(() => {
                resolve(localPath);
              })
              .catch((e) => {
                resolve(imageUrl);
                console.info('Here 2');
                this.throwError(e);
              });
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

  private initCache(replace?: boolean): void {
    if (!this.filePluginExists) {
      this.isInit = true;
      return;
    }

    this.cacheDirectoryExists
      .then((exists: boolean) => {
        this.isCacheReady = true;
        this.isInit = true;
      })
      .catch(e => {
        this.createCacheDirectory(replace)
          .then(() => {
            this.isCacheReady = true;
            this.isInit = true;
          })
          .catch(e => {
            console.info('Here 4');
            this.throwError(e);
            this.isInit = true;
          });
      });

  }

  // private getRawImage(url: string): Promise<any> {
  //   return new Promise<any>((resolve, reject) => {
  //     if (this.isNativeHttpAvailable) {
  //       // cordovaHTTP is available, lets get the image via background thread
  //       HTTP.get(url, {}, {})
  //         .then(
  //           data => {
  //             resolve(data.data);
  //           },
  //           reject
  //         );
  //     } else {
  //       // cordovaHTTP isn't available so we'll use @angular/http
  //       this.http.get(url)
  //         .subscribe(
  //           data => {
  //             resolve(data.arrayBuffer());
  //           },
  //           reject
  //         );
  //     }
  //   });
  // }

  /**
   *
   * @param image {ArrayBuffer} Image in binary
   * @param fileName {string} File name to save as
   * @returns {Promise<string>} Promise that resolves with native URL of file
   */
  private cacheImage(image: ArrayBuffer, fileName: string): Promise<void> {
    return File.writeFile(cordova.file.cacheDirectory + this.config.cacheDirectoryName, fileName, new Blob([image]), {replace: true});
  }

  private getCachedImagePath(url: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      if (!this.isCacheReady) {
        return reject();
      }
      let fileName = this.createFileName(url);
      let dirPath = cordova.file.cacheDirectory + this.config.cacheDirectoryName;
      File.checkFile(dirPath, fileName)
        .then(() => {
          File.resolveLocalFilesystemUrl(dirPath + '/' + fileName)
            .then((fileEntry: FileEntry) => {
              resolve(fileEntry.nativeURL);
            })
            .catch(reject);
        })
        .catch(reject);
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
    // let ext: string = url.split('.').pop().split(/\#|\?/)[0];
    // hash the url to get a unique file name
    let hash = this.hashString(url);
    return hash.toString();
    // return hash + '.' + ext;
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
