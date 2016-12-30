import { Injectable } from '@angular/core';

@Injectable()
export class ImageLoaderConfig {

  debugMode: boolean = false;

  spinnerEnabled: boolean = true;

  backgroundSize: string = 'contain';

  backgroundRepeat: string = 'no-repeat';

  display: string = 'block';

  width: string = '100%';

  height: string = '100%';

  useImg: boolean = false;

  fallbackUrl: string;

  concurrency: number = 5;

  private _cacheDirectoryName: string = 'image-loader-cache';

  set cacheDirectoryName(name: string) {
    name.replace(/\W/g, '');
    this._cacheDirectoryName = name;
  }

  get cacheDirectoryName(): string {
    return this._cacheDirectoryName;
  }

  /**
   * Enables debug mode to receive console logs, errors, warnings
   */
  enableDebugMode(): void {
    this.debugMode = true;
  }

  /**
   * Enable/Disable the spinner by default. Defaults to true.
   * @param enable {boolean} set to true to enable
   */
  enableSpinner(enable: boolean): void {
    this.spinnerEnabled = enable;
  }

  /**
   * Sets the cache directory name. Defaults to 'image-loader-cache'
   * @param name {string} name of directory
   */
  setCacheDirectoryName(name: string): void {
    this.cacheDirectoryName = name;
  }

  /**
   * Set default height for images that are not using <img> tag
   * @param height {string} height
   */
  setHeight(height: string): void {
    this.height = height;
  }

  /**
   * Set default width for images that are not using <img> tag
   * @param width {string} Width
   */
  setWidth(width: string): void {
    this.width = width;
  }

  /**
   * Enable display mode for images that are not using <img> tag
   * @param display {string} Display mode
   */
  setDisplay(display: string): void {
    this.display = display;
  }

  /**
   * Use <img> tag by default
   * @param use {boolean} set to true to use <img> tag by default
   */
  useImageTag(use: boolean): void {
    this.useImg = use;
  }

  /**
   * Set default background size for images that are not using <img> tag
   * @param backgroundSize {string} Background size
   */
  setBackgroundSize(backgroundSize: string): void {
    this.backgroundSize = backgroundSize;
  }

  /**
   * Set background repeat for images that are not using <img> tag
   * @param backgroundRepeat {string} Background repeat
   */
  setBackgroundRepeat(backgroundRepeat: string): void {
    this.backgroundRepeat = backgroundRepeat;
  }

  /**
   * Set fallback URL to use when image src is undefined or did not resolve.
   * This image will not be cached. This should ideally be a locally saved image.
   * @param fallbackUrl {string} The remote or local URL of the image
   */
  setFallbackUrl(fallbackUrl: string): void {
    this.fallbackUrl = fallbackUrl;
  }

  /**
   * Set the maximum number of allowed connections at the same time.
   * @param concurrency
   */
  setConcurrency(concurrency: number): void {
    this.concurrency = concurrency;
  }

}
