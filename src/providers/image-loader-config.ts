import { HttpHeaders } from '@angular/common/http';
import { Injectable }  from '@angular/core';

@Injectable()
export class ImageLoaderConfig {
  debugMode = false;

  spinnerEnabled = true;

  fallbackAsPlaceholder = false;

  backgroundSize = 'contain';

  backgroundRepeat = 'no-repeat';

  display = 'block';

  width = '100%';

  height = '100%';

  useImg = false;

  fallbackUrl;

  concurrency = 5;

  maxCacheSize = -1;

  maxCacheAge = -1;

  imageReturnType: 'base64' | 'uri' = 'uri';

  spinnerName;

  spinnerColor;

  httpHeaders: HttpHeaders;

  fileNameCachedWithExtension = false;

  fallbackFileNameCachedExtension = '.jpg';

  cacheDirectoryType: 'cache'|'data' = 'cache';

  private _cacheDirectoryName: string = 'image-loader-cache';


  get cacheDirectoryName() {
    return this._cacheDirectoryName;
  }

  set cacheDirectoryName(name) {
    name.replace(/\W/g, '');
    this._cacheDirectoryName = name;
  }

  /**
   * Enables debug mode to receive console logs, errors, warnings
   */
  enableDebugMode(): void {
    this.debugMode = true;
  }

  /**
   * Enable/Disable the spinner by default. Defaults to true.
   * @param {boolean} enable set to true to enable
   */
  enableSpinner(enable: boolean): void {
    this.spinnerEnabled = enable;
  }

  /**
   * Enable/Disable the fallback image as placeholder instead of the spinner. Defaults to false.
   * @param {boolean} enable set to true to enable
   */
  enableFallbackAsPlaceholder(enable: boolean): void {
    this.fallbackAsPlaceholder = enable;
  }

  /**
   * Sets the cache directory name. Defaults to 'image-loader-cache'
   * @param {string} name name of directory
   */
  setCacheDirectoryName(name: string): void {
    this.cacheDirectoryName = name;
  }

  /**
   * Set default height for images that are not using <img> tag
   * @param {string} height height
   */
  setHeight(height: string): void {
    this.height = height;
  }

  /**
   * Set default width for images that are not using <img> tag
   * @param {string} width Width
   */
  setWidth(width: string): void {
    this.width = width;
  }

  /**
   * Enable display mode for images that are not using <img> tag
   * @param {string} display Display mode
   */
  setDisplay(display: string): void {
    this.display = display;
  }

  /**
   * Use <img> tag by default
   * @param {boolean} use set to true to use <img> tag by default
   */
  useImageTag(use: boolean): void {
    this.useImg = use;
  }

  /**
   * Set default background size for images that are not using <img> tag
   * @param {string} backgroundSize Background size
   */
  setBackgroundSize(backgroundSize: string): void {
    this.backgroundSize = backgroundSize;
  }

  /**
   * Set background repeat for images that are not using <img> tag
   * @param {string} backgroundRepeat Background repeat
   */
  setBackgroundRepeat(backgroundRepeat: string): void {
    this.backgroundRepeat = backgroundRepeat;
  }

  /**
   * Set fallback URL to use when image src is undefined or did not resolve.
   * This image will not be cached. This should ideally be a locally saved image.
   * @param {string} fallbackUrl The remote or local URL of the image
   */
  setFallbackUrl(fallbackUrl: string): void {
    this.fallbackUrl = fallbackUrl;
  }

  /**
   * Set the maximum number of allowed connections at the same time.
   * @param {number} concurrency
   */
  setConcurrency(concurrency: number): void {
    this.concurrency = concurrency;
  }

  /**
   * Sets the maximum allowed cache size
   * @param {number} cacheSize Cache size in bytes
   */
  setMaximumCacheSize(cacheSize: number): void {
    this.maxCacheSize = cacheSize;
  }

  /**
   * Sets the maximum allowed cache age
   * @param {number} cacheAge Maximum cache age in milliseconds
   */
  setMaximumCacheAge(cacheAge: number): void {
    this.maxCacheAge = cacheAge;
  }

  /**
   * Set the return type of cached images
   * @param imageReturnType {string} The return type; either 'base64' or 'uri'
   */
  setImageReturnType(imageReturnType: 'base64' | 'uri'): void {
    this.imageReturnType = imageReturnType;
  }

  /**
   * Set the default spinner name
   * @param {string} name
   */
  setSpinnerName(name: string): void {
    this.spinnerName = name;
  }

  /**
   * Set the default spinner color
   * @param {string} color
   */
  setSpinnerColor(color: string): void {
    this.spinnerColor = color;
  }

  /**
   * Set headers options for the HttpClient transfers.
   * @param {HttpHeaders} headers
   */
  setHttpHeaders(headers: HttpHeaders): void {
    this.httpHeaders = headers;
  }

  /**
   * Set options for the FileTransfer plugin
   * @param options
   * @deprecated FileTransfer plugin removed.
   */
  setFileTransferOptions(options: {
    trustAllHosts: boolean;
    [key: string]: any;
  }): void {
    // do nothing, plugin deprecated.
  }

  /**
   * Enable/Disable the save filename of cached images with extension.  Defaults to false.
   * @param {boolean} enable set to true to enable
   */
  setFileNameCachedWithExtension(enable: boolean) {
    this.fileNameCachedWithExtension = enable;
  }

  /**
   * Set fallback extension filename of cached images.  Defaults to '.jpg'.
   * @param {string} extension fallback extension (e.x .jpg)
   */
  setFallbackFileNameCachedExtension(extension: string) {
    this.fallbackFileNameCachedExtension = extension;
  }
}
