import { Injectable } from '@angular/core';

@Injectable()
export class ImageLoaderConfig {

  isDebug: boolean = false;

  cacheDirectoryPath: string = 'image-loader-cache';

  enableDebugMode(): void {
    this.isDebug = true;
  }

  setCacheDirectory(path: string): void {
    this.cacheDirectoryPath = path;
  }

}
