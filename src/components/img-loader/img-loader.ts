import { Component, Input, ElementRef, Renderer, OnInit } from '@angular/core';
import { ImageLoader } from "../../providers/image-loader";
import { ImageLoaderConfig } from "../../providers/image-loader-config";

@Component({
  selector: 'img-loader',
  template: ''
})
export class ImgLoader implements OnInit {

  /**
   * The URL of the image to load.
   */
  @Input('src') imageUrl: string;

  /**
   * The name of the Ionic Spinner to show while loading. Leave this blank to not show anything.
   */
  @Input() spinner: string;

  @Input() useImg: boolean = false;

  @Input() width: string = '100%';

  @Input() height: string = '100%';

  /**
   * Whether the image is still loading
   */
  private isLoading: boolean = true;

  private imageContainer: HTMLElement | HTMLImageElement;

  imgSrc: string = '';

  constructor(
    private element: ElementRef
    , private renderer: Renderer
    , private imageLoader: ImageLoader
    , private config: ImageLoaderConfig
  ) {
    if (!this.spinner && config.spinnerEnabled) {
      this.spinner = config.defaultSpinner;
    }
  }

  ngOnInit(): void {
    if (this.useImg) {
      this.renderer.createElement(this.element.nativeElement, 'img');
      this.imageContainer = <HTMLImageElement>this.element.nativeElement.getElementsByTagName('IMG')[0];
    } else {
      this.imageContainer = this.element.nativeElement;
      this.renderer.setElementStyle(this.imageContainer, 'width', this.width);
      this.renderer.setElementStyle(this.imageContainer, 'height', this.height);
      this.renderer.setElementStyle(this.imageContainer, 'display', 'block');
      this.renderer.setElementStyle(this.imageContainer, 'background-size', 'contain');
      this.renderer.setElementStyle(this.imageContainer, 'background-repeat', 'no-repeat');
    }
    // fetch image
    this.imageLoader.getImagePath(this.imageUrl)
      .then((imageUrl: string) => {
        console.log('imgUrl is: ', imageUrl);
        this.isLoading = false;
        if (this.useImg) {
          this.imgSrc = imageUrl;
        } else {
          this.renderer.setElementStyle(this.imageContainer, 'background-image', 'url(\'' + imageUrl +'\')');
        }
      });
  }

}
