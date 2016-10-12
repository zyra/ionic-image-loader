import { Injectable } from '@angular/core';

@Injectable()
export class ImageLoaderConfig {

  debugMode: boolean = false;

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

  setCacheDirectoryName(name: string): void {
    this.cacheDirectoryName = name;
  }

}
