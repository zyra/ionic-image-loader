import { Component, Input, ElementRef, Renderer, OnInit } from '@angular/core';
import { ImageLoader } from "../../providers/image-loader";
import { ImageLoaderConfig } from "../../providers/image-loader-config";

@Component({
  selector: 'img-loader',
  template: '<image-loader-spinner *ngIf="isLoading"></image-loader-spinner>'
})
export class ImgLoader implements OnInit {

  /**
   * The URL of the image to load.
   */
  @Input('src') imageUrl: string;

  @Input() spinner: boolean;

  @Input() useImg: boolean = false;

  @Input() width: string = '100%';

  @Input() height: string = '100%';

  isLoading: boolean = true;

  constructor(
    private element: ElementRef
    , private renderer: Renderer
    , private imageLoader: ImageLoader
    , private config: ImageLoaderConfig
  ) {
    if (typeof this.spinner === 'undefined' && config.spinnerEnabled) {
      this.spinner = true;
    }
  }

  ngOnInit(): void {
    this.imageLoader.getImagePath(this.imageUrl)
      .then((imageUrl: string) => {

        let element;

        this.isLoading = false;

        if (this.useImg) {
          this.renderer.createElement(this.element.nativeElement, 'img');
          element = <HTMLImageElement>this.element.nativeElement.getElementsByTagName('IMG')[0];
          this.renderer.setElementAttribute(element, 'src', imageUrl);
        } else {

          element = this.element.nativeElement;

          this.renderer.setElementStyle(element, 'width', this.width);
          this.renderer.setElementStyle(element, 'height', this.height);
          this.renderer.setElementStyle(element, 'display', 'block');
          this.renderer.setElementStyle(element, 'background-size', 'contain');
          this.renderer.setElementStyle(element, 'background-repeat', 'no-repeat');
          this.renderer.setElementStyle(element, 'background-image', 'url(\'' + imageUrl +'\')');
        }
      });
  }

}
