import { Component, Input, ElementRef, Renderer, OnInit } from '@angular/core';
import { ImageLoader } from "../../providers/image-loader";
import { ImageLoaderConfig } from "../../providers/image-loader-config";

@Component({
  selector: 'img-loader',
  template: '<image-loader-spinner *ngIf="spinner && isLoading"></image-loader-spinner>'
})
export class ImgLoader implements OnInit {

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
   * Fallback URL to load when the image url fails to load or does not exist.
   */
  @Input('fallback') fallbackUrl: string = this.config.fallbackUrl;

  /**
   * Whether to show a spinner while the image loads
   */
  @Input() spinner: boolean = this.config.spinnerEnabled;

  /**
   * Use <img> tag
   */
  @Input()
  set useImg(val: boolean) {
    this._useImg = val !== false;
  }

  private _useImg: boolean = this.config.useImg;

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
  @Input() cache: boolean = true;

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
   * Indicates if the image is still loading
   * @type {boolean}
   */
  isLoading: boolean = true;

  private imgElement: HTMLImageElement;

  constructor(
    private element: ElementRef
    , private renderer: Renderer
    , private imageLoader: ImageLoader
    , private config: ImageLoaderConfig
  ) { }

  ngOnInit(): void {
    if (!this.src) {
      // image url was not passed
      // this can happen when [src] is set to a variable that turned out to be undefined
      // one example could be a list of users with their profile pictures
      // in this case, it would be useful to use the fallback image instead
      if (this.fallbackUrl) {
        // we're not going to cache the fallback image since it should be locally saved
        this.setImage(this.fallbackUrl);
      } else {
        this.isLoading = false;
      }
    }
  }

  private updateImage(imageUrl: string) {
    this.imageLoader.getImagePath(imageUrl)
      .then((imageUrl: string) => this.setImage(imageUrl))
      .catch((error: any) => this.setImage(this.fallbackUrl || imageUrl));
  }

  /**
   * Gets the image URL to be loaded and disables caching if necessary
   * @returns {string}
   */
  private processImageUrl(imageUrl: string): string {
    if (this.cache === false) {
      // need to disable caching

      if (imageUrl.indexOf('?') === -1) { // add ? if doesn't exists
        imageUrl += '?';
      }

      if (['&', '?'].indexOf(imageUrl.charAt(imageUrl.length)) === -1) { // add & if necessary
        imageUrl += '&';
      }

      // append timestamp at the end to make URL unique
      imageUrl += 'cache_buster=' + Date.now();
    }

    return imageUrl;
  }

  /**
   * Set the image to be displayed
   * @param imageUrl
   */
  private setImage(imageUrl: string): void {
    this.isLoading = false;

    if (this._useImg) {

      // Using <img> tag
      if (!this.imgElement) {
        // create img element if we dont have one
        this.imgElement = this.renderer.createElement(this.element.nativeElement, 'img');
      }

      // set it's src
      this.renderer.setElementAttribute(this.imgElement, 'src', imageUrl);

    } else {

      // Not using <img> tag

      const element = this.element.nativeElement;

      if (this.display) {
        this.renderer.setElementStyle(element, 'display', this.display);
      }

      if (this.height) {
        this.renderer.setElementStyle(element, 'height', this.height);
      }

      if (this.width) {
        this.renderer.setElementStyle(element, 'width', this.width);
      }

      if (this.backgroundSize) {
        this.renderer.setElementStyle(element, 'background-size', this.backgroundSize);
      }

      if (this.backgroundRepeat) {
        this.renderer.setElementStyle(element, 'background-repeat', this.backgroundRepeat);
      }

      this.renderer.setElementStyle(element, 'background-image', 'url(\'' + imageUrl + '\')');
    }
  }

}
