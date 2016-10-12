import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { HTTP, File } from 'ionic-native';
import { Platform } from 'ionic-angular';
import { ImageLoaderConfig } from "./image-loader-config";

declare var cordovaHTTP: any;

@Injectable()
export class ImageLoader {

  private isNativeAvailable: boolean = false;

  constructor(
    private http: Http,
    private platform: Platform,
    private config: ImageLoaderConfig
  ) {}

  ngOnInit(): void {
    this.platform.ready().then(() => {
      if (typeof cordovaHTTP !== 'undefined') {
        this.isNativeAvailable = true;
      } else if (this.config.isDebug) {
        console.info('ImageLoader: Falling back to @angular/http since cordovaHTTP isn\'t available');
      }
    });
  }

  getRawImage(url: string): Promise<any> {
    return new Promise<any>((resolve, reject) => {

      if (this.isNativeAvailable) {
        // cordovaHTTP is available, lets get the image via background thread

        HTTP.get(url, {}, {})
          .then(
            data => {
              console.log(data);

            },
            error => {

            }
          );

      } else {
        // cordovaHTTP isn't available so we'll use @angular/http

        this.http.get(url)
          .subscribe(
            data => {
              console.log(data);
              resolve(data.arrayBuffer());
            },
            error => {

            }
          );

      }

    });
  }

  checkIfImageExistsInCache(imageHash: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {

    });
  }

  hashURL(url: string): string {
    let hash = 0;
    let char;
    if (url.length === 0) return hash.toString();
    for (let i = 0; i < url.length; i++) {
      char = url.charCodeAt(i);
      hash = ((hash<<5)-hash)+char;
      hash = hash & hash;
    }
    return hash.toString();
  }

}
