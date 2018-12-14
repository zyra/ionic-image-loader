import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ImageLoaderConfigService {
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

  // Must be default 'true' for the new WebView to show images
  fileNameCachedWithExtension = true;

  fallbackFileNameCachedExtension = '.jpg';

  cacheDirectoryType: 'cache' | 'data' | 'external' = 'cache';

  private _cacheDirectoryName = 'image-loader-cache';


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
  enableDebugMode() {
    this.debugMode = true;
  }

  /**
   * Enable/Disable the spinner by default. Defaults to true.
   * @param enable set to true to enable
   */
  enableSpinner(enable: boolean) {
    this.spinnerEnabled = enable;
  }

  /**
   * Enable/Disable the fallback image as placeholder instead of the spinner. Defaults to false.
   * @param enable set to true to enable
   */
  enableFallbackAsPlaceholder(enable: boolean) {
    this.fallbackAsPlaceholder = enable;
  }

  /**
   * Sets the cache directory name. Defaults to 'image-loader-cache'
   * @param name name of directory
   */
  setCacheDirectoryName(name: string) {
    this.cacheDirectoryName = name;
  }

  /**
   * Set default height for images that are not using <img> tag
   * @param height height
   */
  setHeight(height: string) {
    this.height = height;
  }

  /**
   * Set default width for images that are not using <img> tag
   * @param width Width
   */
  setWidth(width: string) {
    this.width = width;
  }

  /**
   * Enable display mode for images that are not using <img> tag
   * @param display Display mode
   */
  setDisplay(display: string) {
    this.display = display;
  }

  /**
   * Use <img> tag by default
   * @param use set to true to use <img> tag by default
   */
  useImageTag(use: boolean) {
    this.useImg = use;
  }

  /**
   * Set default background size for images that are not using <img> tag
   * @param backgroundSize Background size
   */
  setBackgroundSize(backgroundSize: string) {
    this.backgroundSize = backgroundSize;
  }

  /**
   * Set background repeat for images that are not using <img> tag
   * @param backgroundRepeat Background repeat
   */
  setBackgroundRepeat(backgroundRepeat: string) {
    this.backgroundRepeat = backgroundRepeat;
  }

  /**
   * Set fallback URL to use when image src is undefined or did not resolve.
   * This image will not be cached. This should ideally be a locally saved image.
   * @param fallbackUrl The remote or local URL of the image
   */
  setFallbackUrl(fallbackUrl: string) {
    this.fallbackUrl = fallbackUrl;
  }

  /**
   * Set the maximum number of allowed connections at the same time.
   * @param concurrency
   */
  setConcurrency(concurrency: number) {
    this.concurrency = concurrency;
  }

  /**
   * Sets the maximum allowed cache size
   * @param cacheSize Cache size in bytes
   */
  setMaximumCacheSize(cacheSize: number) {
    this.maxCacheSize = cacheSize;
  }

  /**
   * Sets the maximum allowed cache age
   * @param cacheAge Maximum cache age in milliseconds
   */
  setMaximumCacheAge(cacheAge: number) {
    this.maxCacheAge = cacheAge;
  }

  /**
   * Set the return type of cached images
   * @param imageReturnType The return type; either 'base64' or 'uri'
   */
  setImageReturnType(imageReturnType: 'base64' | 'uri') {
    this.imageReturnType = imageReturnType;
  }

  /**
   * Set the default spinner name
   * @param name
   */
  setSpinnerName(name: string) {
    this.spinnerName = name;
  }

  /**
   * Set the default spinner color
   * @param color
   */
  setSpinnerColor(color: string) {
    this.spinnerColor = color;
  }

  /**
   * Set headers options for the HttpClient transfers.
   * @param headers
   */
  setHttpHeaders(headers: HttpHeaders) {
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
  }) {
    // do nothing, plugin deprecated.
  }

  /**
   * Enable/Disable the save filename of cached images with extension.  Defaults to false.
   * @param enable set to true to enable
   */
  setFileNameCachedWithExtension(enable: boolean) {
    this.fileNameCachedWithExtension = enable;
  }

  /**
   * Set fallback extension filename of cached images.  Defaults to '.jpg'.
   * @param extension fallback extension (e.x .jpg)
   */
  setFallbackFileNameCachedExtension(extension: string) {
    this.fallbackFileNameCachedExtension = extension;
  }
}
