import { Injectable } from '@angular/core';

@Injectable()
export class ImageLoaderConfig {

  debugMode: boolean = false;

  defaultSpinner: string = 'ios';

  spinnerEnabled: boolean = true;

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

  setDefaultSpinner(name: string): void {
    this.defaultSpinner = name;
  }

  setCacheDirectoryName(name: string): void {
    this.cacheDirectoryName = name;
  }

}
