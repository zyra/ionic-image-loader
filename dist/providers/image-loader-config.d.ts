import { HttpHeaders } from '@angular/common/http';
export declare class ImageLoaderConfig {
    debugMode: boolean;
    spinnerEnabled: boolean;
    fallbackAsPlaceholder: boolean;
    backgroundSize: string;
    backgroundRepeat: string;
    display: string;
    width: string;
    height: string;
    useImg: boolean;
    fallbackUrl: any;
    concurrency: number;
    maxCacheSize: number;
    maxCacheAge: number;
    imageReturnType: 'base64' | 'uri';
    spinnerName: any;
    spinnerColor: any;
    httpHeaders: HttpHeaders;
    fileNameCachedWithExtension: boolean;
    fallbackFileNameCachedExtension: string;
    cacheDirectoryType: 'cache' | 'data';
    private _cacheDirectoryName;
    cacheDirectoryName: string;
    /**
     * Enables debug mode to receive console logs, errors, warnings
     */
    enableDebugMode(): void;
    /**
     * Enable/Disable the spinner by default. Defaults to true.
     * @param {boolean} enable set to true to enable
     */
    enableSpinner(enable: boolean): void;
    /**
     * Enable/Disable the fallback image as placeholder instead of the spinner. Defaults to false.
     * @param {boolean} enable set to true to enable
     */
    enableFallbackAsPlaceholder(enable: boolean): void;
    /**
     * Sets the cache directory name. Defaults to 'image-loader-cache'
     * @param {string} name name of directory
     */
    setCacheDirectoryName(name: string): void;
    /**
     * Set default height for images that are not using <img> tag
     * @param {string} height height
     */
    setHeight(height: string): void;
    /**
     * Set default width for images that are not using <img> tag
     * @param {string} width Width
     */
    setWidth(width: string): void;
    /**
     * Enable display mode for images that are not using <img> tag
     * @param {string} display Display mode
     */
    setDisplay(display: string): void;
    /**
     * Use <img> tag by default
     * @param {boolean} use set to true to use <img> tag by default
     */
    useImageTag(use: boolean): void;
    /**
     * Set default background size for images that are not using <img> tag
     * @param {string} backgroundSize Background size
     */
    setBackgroundSize(backgroundSize: string): void;
    /**
     * Set background repeat for images that are not using <img> tag
     * @param {string} backgroundRepeat Background repeat
     */
    setBackgroundRepeat(backgroundRepeat: string): void;
    /**
     * Set fallback URL to use when image src is undefined or did not resolve.
     * This image will not be cached. This should ideally be a locally saved image.
     * @param {string} fallbackUrl The remote or local URL of the image
     */
    setFallbackUrl(fallbackUrl: string): void;
    /**
     * Set the maximum number of allowed connections at the same time.
     * @param {number} concurrency
     */
    setConcurrency(concurrency: number): void;
    /**
     * Sets the maximum allowed cache size
     * @param {number} cacheSize Cache size in bytes
     */
    setMaximumCacheSize(cacheSize: number): void;
    /**
     * Sets the maximum allowed cache age
     * @param {number} cacheAge Maximum cache age in milliseconds
     */
    setMaximumCacheAge(cacheAge: number): void;
    /**
     * Set the return type of cached images
     * @param imageReturnType {string} The return type; either 'base64' or 'uri'
     */
    setImageReturnType(imageReturnType: 'base64' | 'uri'): void;
    /**
     * Set the default spinner name
     * @param {string} name
     */
    setSpinnerName(name: string): void;
    /**
     * Set the default spinner color
     * @param {string} color
     */
    setSpinnerColor(color: string): void;
    /**
     * Set headers options for the HttpClient transfers.
     * @param {HttpHeaders} headers
     */
    setHttpHeaders(headers: HttpHeaders): void;
    /**
     * Set options for the FileTransfer plugin
     * @param options
     * @deprecated FileTransfer plugin removed.
     */
    setFileTransferOptions(options: {
        trustAllHosts: boolean;
        [key: string]: any;
    }): void;
    /**
     * Enable/Disable the save filename of cached images with extension.  Defaults to false.
     * @param {boolean} enable set to true to enable
     */
    setFileNameCachedWithExtension(enable: boolean): void;
    /**
     * Set fallback extension filename of cached images.  Defaults to '.jpg'.
     * @param {string} extension fallback extension (e.x .jpg)
     */
    setFallbackFileNameCachedExtension(extension: string): void;
}
