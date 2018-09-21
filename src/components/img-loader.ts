import { Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2 } from '@angular/core';

import { ImageLoader }       from '../providers/image-loader';
import { ImageLoaderConfig } from '../providers/image-loader-config';

const propMap: any = {
  display: 'display',
  height: 'height',
  width: 'width',
  backgroundSize: 'background-size',
  backgroundRepeat: 'background-repeat',
};

export interface ImageAttribute {
  element: string;
  value: string;
}

@Component({
  selector: 'img-loader',
  template:
    '<ion-spinner *ngIf="spinner && isLoading && !fallbackAsPlaceholder" [name]="spinnerName" [color]="spinnerColor"></ion-spinner>' +
    '<ng-content></ng-content>',
  styles: [
    'ion-spinner { float: none; margin-left: auto; margin-right: auto; display: block; }',
  ],
})
export class ImgLoaderComponent implements OnInit {
  /**
   * Fallback URL to load when the image url fails to load or does not exist.
   */
  @Input() fallbackUrl: string = this.config.fallbackUrl;
  /**
   * Whether to show a spinner while the image loads
   */
  @Input() spinner: boolean = this.config.spinnerEnabled;
  /**
   * Whether to show the fallback image instead of a spinner while the image loads
   */

  @Input() fallbackAsPlaceholder: boolean = this.config.fallbackAsPlaceholder;
  /**
   * Attributes to pass through to img tag if _useImg == true
   */
  @Input('imgAttributes') imgAttributes: ImageAttribute[] = [];
  /**
   * Enable/Disable caching
   * @type {boolean}
   */
  @Input() cache = true;
  /**
   * Width of the image. This will be ignored if using useImg.
   */
  @Input() width: string = this.config.width;
  /**
   * Height of the image. This will be ignored if using useImg.
   */
  @Input() height: string = this.config.height;
  /**
   * Display type of the image. This will be ignored if using useImg.
   */
  @Input() display: string = this.config.display;
  /**
   * Background size. This will be ignored if using useImg.
   */
  @Input() backgroundSize: string = this.config.backgroundSize;
  /**
   * Background repeat. This will be ignored if using useImg.
   */
  @Input() backgroundRepeat: string = this.config.backgroundRepeat;
  /**
   * Name of the spinner
   */
  @Input() spinnerName: string = this.config.spinnerName;
  /**
   * Color of the spinner
   */
  @Input() spinnerColor: string = this.config.spinnerColor;
  /**
   * Notify on image load..
   */
  @Output()
  load: EventEmitter<ImgLoaderComponent> = new EventEmitter<ImgLoaderComponent>();
  /**
   * Indicates if the image is still loading
   * @type {boolean}
   */
  isLoading = true;
  element: HTMLElement;

  constructor(
    private _element: ElementRef,
    private renderer: Renderer2,
    private imageLoader: ImageLoader,
    private config: ImageLoaderConfig,
  ) {
  }

  private _useImg: boolean = this.config.useImg;

  /**
   * Use <img> tag
   */
  @Input()
  set useImg(val: boolean) {
    this._useImg = val !== false;
  }

  /**
   * Convenience attribute to disable caching
   * @param val
   */
  @Input()
  set noCache(val: boolean) {
    this.cache = val !== false;
  }

  private _src: string;

  get src(): string {
    return this._src;
  }

  /**
   * The URL of the image to load.
   */
  @Input()
  set src(imageUrl: string) {
    this._src = this.processImageUrl(imageUrl);
    this.updateImage(this._src);
  };

  ngOnInit(): void {
    if (this.fallbackAsPlaceholder && this.fallbackUrl) {
      this.setImage(this.fallbackUrl, false);
    }

    if (!this.src) {
      // image url was not passed
      // this can happen when [src] is set to a variable that turned out to be undefined
      // one example could be a list of users with their profile pictures
      // in this case, it would be useful to use the fallback image instead
      // if fallbackUrl was used as placeholder we do not need to set it again
      if (!this.fallbackAsPlaceholder && this.fallbackUrl) {
        // we're not going to cache the fallback image since it should be locally saved
        this.setImage(this.fallbackUrl);
      } else {
        this.isLoading = false;
      }
    }
  }

  private updateImage(imageUrl: string) {
    this.imageLoader
      .getImagePath(imageUrl)
      .then((url: string) => this.setImage(url))
      .catch((error: any) => this.setImage(this.fallbackUrl || imageUrl));
  }

  /**
   * Gets the image URL to be loaded and disables caching if necessary
   * @returns {string}
   */
  private processImageUrl(imageUrl: string): string {
    if (this.cache === false) {
      // need to disable caching

      if (imageUrl.indexOf('?') === -1) {
        // add ? if doesn't exists
        imageUrl += '?';
      }

      if (['&', '?'].indexOf(imageUrl.charAt(imageUrl.length)) === -1) {
        // add & if necessary
        imageUrl += '&';
      }

      // append timestamp at the end to make URL unique
      imageUrl += 'cache_buster=' + Date.now();
    }

    return imageUrl;
  }

  /**
   * Set the image to be displayed
   * @param imageUrl {string} image src
   * @param stopLoading {boolean} set to true to mark the image as loaded
   */
  private setImage(imageUrl: string, stopLoading: boolean = true): void {
    this.isLoading = !stopLoading;

    if (this._useImg) {
      // Using <img> tag
      if (!this.element) {
        // create img element if we dont have one
        this.element = this.renderer.createElement('img');
        this.renderer.appendChild(this._element.nativeElement, this.element);
      }

      // set it's src
      this.renderer.setAttribute(this.element, 'src', imageUrl);

      // if imgAttributes are defined, add them to our img element
      this.imgAttributes.forEach((attribute) => {
        this.renderer.setAttribute(this.element, attribute.element, attribute.value);
      });
      if (this.fallbackUrl && !this.imageLoader.nativeAvailable) {
        this.renderer.listen(this.element, 'error', () =>
          this.renderer.setAttribute(this.element, 'src', this.fallbackUrl),
        );
      }
    } else {
      // Not using <img> tag

      this.element = this._element.nativeElement;

      for (const prop in propMap) {
        if (this[prop]) {
          this.renderer.setStyle(this.element, propMap[prop], this[prop]);
        }
      }

      this.renderer.setStyle(
        this.element,
        'background-image',
        `url("${imageUrl || this.fallbackUrl}")`,
      );
    }
    if(stopLoading) {
      this.load.emit(this);
    }
  }
}
