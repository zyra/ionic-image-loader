import { Directive, Input, Output, EventEmitter, ElementRef, Renderer } from '@angular/core';
import { ImageLoaderConfig } from "../providers/image-loader-config";
import {ImageLoader} from "../providers/image-loader";

@Directive({
  selector: '[imgLoader]'
})
export class ImgLoader {

  /**
   * The URL of the image to load.
   */
  @Input('imgLoader') imageUrl: string;

  /**
   * The URL of the image to show if an error occurs. Leave this blank to not show anything.
   */
  @Input() errorImage: string;

  /**
   * The name of the Ionic Spinner to show while loading. Leave this blank to not show anything.
   */
  @Input() spinner: string;

  /**
   * Event emitter that notifies you when the image is loaded
   * @type {EventEmitter<void>}
   */
  @Output() onLoad: EventEmitter<void> = new EventEmitter<void>();

  /**
   * Event emiter that notifies you when an error occurs, and passes you the error response/message.
   * @type {EventEmitter<any>}
   */
  @Output() onError: EventEmitter<any> = new EventEmitter<any>();

  /**
   * The tag name of the element this directive is attached to.
   * This is used to determine whether we're on an `img` tag or something else.
   */
  private tagName: string;

  /**
   * Whether the image is still loading
   */
  private isLoading: boolean;

  /**
   * Whether an error occurred while loading the image
   */
  error: boolean;

  constructor(
    private element: ElementRef
    , private renderer: Renderer
    , private config: ImageLoaderConfig
    , private imageLoader: ImageLoader
  ) {
  }

  ngOnInit(): void {
    // set tag name
    this.tagName = this.element.nativeElement.tagName;

    // fetch image
    this.imageLoader.getImagePath(this.imageUrl)
      .then((imageUrl: string) => {
        if (this.tagName === 'IMG') {
          this.renderer.setElementAttribute(this.element, 'src', imageUrl);
        } else {
          this.renderer.setElementStyle(this.element, 'background-image', 'url(\'' + imageUrl +'\')');
        }
      });
  }

}
