import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  Renderer2
} from '@angular/core';

import { ImageLoader } from '../providers/image-loader';
import { ImageLoaderConfig } from '../providers/image-loader-config';
import { ImageAttribute } from './image-attribute';

const propMap: any = {
  display: 'display',
  height: 'height',
  width: 'width',
  backgroundSize: 'background-size',
  backgroundRepeat: 'background-repeat'
};

@Component({
  selector: 'img-loader',
  template:
    '<ion-spinner *ngIf="spinner && isLoading && !fallbackAsPlaceholder" [name]="spinnerName" [color]="spinnerColor"></ion-spinner>' +
    '<ng-content></ng-content>',
  styles: [
    'ion-spinner { float: none; margin-left: auto; margin-right: auto; display: block; }'
  ]
})
export class ImgLoaderComponent implements OnInit {
  /**
   * Fallback URL to load when the image url fails to load or does not exist.
   */
  @Input() fallbackUrl: string = this._config.fallbackUrl;
  /**
   * Whether to show a spinner while the image loads
   */
  @Input() spinner: boolean = this._config.spinnerEnabled;
  /**
   * Whether to show the fallback image instead of a spinner while the image loads
   */

  @Input() fallbackAsPlaceholder: boolean = this._config.fallbackAsPlaceholder;

  /**
   * Use <img> tag
   */
  @Input()
  set useImg(val: boolean) {
    this._useImg = val !== false;
  }

  private _useImg: boolean = this._config.useImg;


  /**
   * Attributes to pass through to img tag if _useImg == true
   */
  @Input('imgAttributes') imgAttributes: ImageAttribute[] = [];

  /**
   * Convenience attribute to disable caching
   * @param val
   */
  @Input()
  set noCache(val: boolean) {
    this.cache = val !== false;
  }
  /**
   * Enable/Disable caching
   * @type {boolean}
   */
  @Input() cache = true;
  /**
   * The URL of the image to load.
   */
  @Input()
  set src(imageUrl: string) {
    this._src = this.processImageUrl(imageUrl);
    this.updateImage(this._src);
  };

  get src(): string {
    return this._src;
  }

  private _src: string;
  /**
   * Width of the image. This will be ignored if using useImg.
   */
  @Input() width: string = this._config.width;
  /**
   * Height of the image. This will be ignored if using useImg.
   */
  @Input() height: string = this._config.height;
  /**
   * Display type of the image. This will be ignored if using useImg.
   */
  @Input() display: string = this._config.display;
  /**
   * Background size. This will be ignored if using useImg.
   */
  @Input() backgroundSize: string = this._config.backgroundSize;
  /**
   * Background repeat. This will be ignored if using useImg.
   */
  @Input() backgroundRepeat: string = this._config.backgroundRepeat;
  /**
   * Name of the spinner
   */
  @Input() spinnerName: string = this._config.spinnerName;
  /**
   * Color of the spinner
   */
  @Input() spinnerColor: string = this._config.spinnerColor;
  /**
   * Notify on image load..
   */
  @Output()
  load: EventEmitter<ImgLoaderComponent> = new EventEmitter<
    ImgLoaderComponent
  >();
  /**
   * Indicates if the image is still loading
   * @type {boolean}
   */
  isLoading = true;
  element: HTMLElement;


  constructor(
    private _element: ElementRef,
    private _renderer: Renderer2,
    private _imageLoader: ImageLoader,
    private _config: ImageLoaderConfig
  ) {
  }

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
    this._imageLoader
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
        this.element = this._renderer.createElement('img');
        this._renderer.appendChild(this._element.nativeElement, this.element);
      }

      // set it's src
      this._renderer.setAttribute(this.element, 'src', imageUrl);

      // if imgAttributes are defined, add them to our img element
      this.imgAttributes.forEach((attribute) => {
        this._renderer.setAttribute(this.element, attribute.element, attribute.value);
      });
      if (this.fallbackUrl && !this._imageLoader.nativeAvailable) {
        this._renderer.listen(this.element, 'error', () =>
          this._renderer.setAttribute(this.element, 'src', this.fallbackUrl)
        );
      }
    } else {
      // Not using <img> tag

      this.element = this._element.nativeElement;

      for (const prop in propMap) {
        if (this[prop]) {
          this._renderer.setStyle(this.element, propMap[prop], this[prop]);
        }
      }

      this._renderer.setStyle(
        this.element,
        'background-image',
        `url("${imageUrl || this.fallbackUrl}")`
      );
    }

    this.load.emit(this);
  }
}
