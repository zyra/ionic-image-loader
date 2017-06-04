import { ElementRef, Renderer, OnInit, EventEmitter } from '@angular/core';
import { ImageLoader } from '../providers/image-loader';
import { ImageLoaderConfig } from '../providers/image-loader-config';
import { File } from '@ionic-native/file';
export declare class ImgLoader implements OnInit {
    private _element;
    private _renderer;
    private _imageLoader;
    private _config;
    private _file;
    /**
     * The URL of the image to load.
     */
    src: string;
    private _src;
    /**
     * Fallback URL to load when the image url fails to load or does not exist.
     */
    fallbackUrl: string;
    /**
     * Whether to show a spinner while the image loads
     */
    spinner: boolean;
    /**
     * Whether to show the fallback image instead of a spinner while the image loads
     */
    fallbackAsPlaceholder: boolean;
    /**
     * Use <img> tag
     */
    useImg: boolean;
    private _useImg;
    /**
     * Convenience attribute to disable caching
     * @param val
     */
    noCache: boolean;
    /**
     * Enable/Disable caching
     * @type {boolean}
     */
    cache: boolean;
    /**
     * Width of the image. This will be ignored if using useImg.
     */
    width: string;
    /**
     * Height of the image. This will be ignored if using useImg.
     */
    height: string;
    /**
     * Display type of the image. This will be ignored if using useImg.
     */
    display: string;
    /**
     * Background size. This will be ignored if using useImg.
     */
    backgroundSize: string;
    /**
     * Background repeat. This will be ignored if using useImg.
     */
    backgroundRepeat: string;
    /**
     * Name of the spinner
     */
    spinnerName: string;
    /**
     * Color of the spinner
     */
    spinnerColor: string;
    /**
     * Notify on image load..
     */
    load: EventEmitter<ImgLoader>;
    /**
     * Indicates if the image is still loading
     * @type {boolean}
     */
    isLoading: boolean;
    element: HTMLElement;
    constructor(_element: ElementRef, _renderer: Renderer, _imageLoader: ImageLoader, _config: ImageLoaderConfig, _file: File);
    ngOnInit(): void;
    private updateImage(imageUrl);
    /**
     * Gets the image URL to be loaded and disables caching if necessary
     * @returns {string}
     */
    private processImageUrl(imageUrl);
    /**
     * Set the image to be displayed
     * @param imageUrl {string} image src
     * @param stopLoading {boolean} set to true to mark the image as loaded
     */
    private setImage(imageUrl, stopLoading?);
}
