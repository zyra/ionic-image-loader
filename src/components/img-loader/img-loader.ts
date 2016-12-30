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
  @Input('src') imageUrl: string;

  /**
   * Fallback URL to load when the image url fails to load or does not exist.
   */
  @Input('fallback') fallbackUrl: string;

  /**
   * Whether to show a spinner while the image loads
   */
  @Input() spinner: boolean;

  /**
   * Use <img> tag
   */
  @Input()
  set useImg(val: boolean) {
    this._useImg = val !== false;
  }

  private _useImg: boolean;

  /**
   * Width of the image. This will be ignored if using useImg.
   */
  @Input() width: string;

  /**
   * Height of the image. This will be ignored if using useImg.
   */
  @Input() height: string;

  /**
   * Display type of the image. This will be ignored if using useImg.
   */
  @Input() display: string;

  /**
   * Background size. This will be ignored if using useImg.
   */
  @Input() backgroundSize: string;

  /**
   * Background repeat. This will be ignored if using useImg.
   */
  @Input() backgroundRepeat: string;

  /**
   * Indicates if the image is still loading
   * @type {boolean}
   */
  isLoading: boolean = true;

  constructor(
    private element: ElementRef
    , private renderer: Renderer
    , private imageLoader: ImageLoader
    , private config: ImageLoaderConfig
  ) {

    // if any config item was not provided, it will be replaced by the global config

    if (!this.spinner && config.spinnerEnabled) {
      this.spinner = true;
    }

    if (!this.fallbackUrl) {
      this.fallbackUrl = config.fallbackUrl;
    }

    if (typeof this._useImg !== 'boolean') {
      this.useImg = config.useImg;
    }

    if (!this.width) {
      this.width = config.width;
    }

    if (!this.height) {
      this.height = config.height;
    }

    if (!this.display) {
      this.display = config.display;
    }

    if (!this.backgroundSize) {
      this.backgroundSize = config.backgroundSize;
    }

    if (!this.backgroundRepeat) {
      this.backgroundRepeat = config.backgroundRepeat;
    }

  }

  ngOnInit(): void {
    if (!this.imageUrl) {
      // image url was not passed
      // this can happen when [src] is set to a variable that turned out to be undefined
      // one example could be a list of users with their profile pictures
      // in this case, it would be useful to use the fallback image instead
      if (this.fallbackUrl) {
        // we're not going to cache the fallback image since it should be locally saved
        this.setImage(this.fallbackUrl);
      }
      // remove the spinner just in case there is no fallback image
      this.isLoading = false;
      return;
    }

    this.imageLoader.getImagePath(this.imageUrl)
      .then((imageUrl: string) => this.setImage(imageUrl))
      .catch((error: any) => this.setImage(this.fallbackUrl || this.imageUrl));
  }

  private setImage(imageUrl: string): void {
    let element;

    this.isLoading = false;

    if (this._useImg) {

      // Using <img> tag
      this.renderer.createElement(this.element.nativeElement, 'img');
      element = <HTMLImageElement>this.element.nativeElement.getElementsByTagName('IMG')[0];
      this.renderer.setElementAttribute(element, 'src', imageUrl);

    } else {

      // Not using <img> tag

      element = this.element.nativeElement;

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
