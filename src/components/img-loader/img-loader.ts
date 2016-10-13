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

  @Input('fallback') fallbackUrl: string;

  @Input() spinner: boolean;

  @Input() useImg: boolean;

  @Input() width: string;

  @Input() height: string;

  @Input() display: string;

  @Input() backgroundSize: string;

  @Input() backgroundRepeat: string;

  isLoading: boolean = true;

  constructor(
    private element: ElementRef
    , private renderer: Renderer
    , private imageLoader: ImageLoader
    , private config: ImageLoaderConfig
  ) {
    if (!this.spinner && config.spinnerEnabled) {
      this.spinner = true;
    }

    if (!this.fallbackUrl) {
      this.fallbackUrl = config.fallbackUrl;
    }

    if (!this.useImg) {
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
      .then((imageUrl: string) => this.setImage(imageUrl));
  }

  private setImage(imageUrl: string): void {
    let element;

    this.isLoading = false;

    if (this.useImg) {
      this.renderer.createElement(this.element.nativeElement, 'img');
      element = <HTMLImageElement>this.element.nativeElement.getElementsByTagName('IMG')[0];
      this.renderer.setElementAttribute(element, 'src', imageUrl);
    } else {

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

      this.renderer.setElementStyle(element, 'background-image', 'url(\'' + imageUrl +'\')');
    }
  }

}
