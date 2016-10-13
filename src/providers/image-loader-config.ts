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

  private _cacheDirectoryName: string = 'image-loader-cache';

  set cacheDirectoryName(name: string) {
    name.replace(/\W/g, '');
    this._cacheDirectoryName = name;
  }

  get cacheDirectoryName(): string {
    return this._cacheDirectoryName;
  }

  enableDebugMode(): void {
    this.debugMode = true;
  }

  enableSpinner(enable: boolean): void {
    this.spinnerEnabled = enable;
  }

  setCacheDirectoryName(name: string): void {
    this.cacheDirectoryName = name;
  }

  setHeight(height: string): void {
    this.height = height;
  }

  setWidth(width: string): void {
    this.width = width;
  }

  enableBlock(enable: string): void {
    this.display = enable;
  }

  useImageTag(use: boolean): void {
    this.useImg = use;
  }

  setBackgroundSize(backgroundSize: string): void {
    this.backgroundSize = backgroundSize;
  }

  setBackgroundRepeat(backgroundRepeat: string): void {
    this.backgroundRepeat = backgroundRepeat;
  }

  setFallbackUrl(fallbackUrl: string): void {
    this.fallbackUrl = fallbackUrl;
  }

}
