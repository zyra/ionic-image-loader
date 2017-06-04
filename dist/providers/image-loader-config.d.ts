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
    fallbackUrl: string;
    concurrency: number;
    maxCacheSize: number;
    maxCacheAge: number;
    imageReturnType: 'base64' | 'uri';
    spinnerName: string;
    spinnerColor: string;
    private _cacheDirectoryName;
    cacheDirectoryName: string;
    /**
     * Enables debug mode to receive console logs, errors, warnings
     */
    enableDebugMode(): void;
    /**
     * Enable/Disable the spinner by default. Defaults to true.
     * @param enable {boolean} set to true to enable
     */
    enableSpinner(enable: boolean): void;
    /**
     * Enable/Disable the fallback image as placeholder instead of the spinner. Defaults to false.
     * @param enable {boolean} set to true to enable
     */
    enableFallbackAsPlaceholder(enable: boolean): void;
    /**
     * Sets the cache directory name. Defaults to 'image-loader-cache'
     * @param name {string} name of directory
     */
    setCacheDirectoryName(name: string): void;
    /**
     * Set default height for images that are not using <img> tag
     * @param height {string} height
     */
    setHeight(height: string): void;
    /**
     * Set default width for images that are not using <img> tag
     * @param width {string} Width
     */
    setWidth(width: string): void;
    /**
     * Enable display mode for images that are not using <img> tag
     * @param display {string} Display mode
     */
    setDisplay(display: string): void;
    /**
     * Use <img> tag by default
     * @param use {boolean} set to true to use <img> tag by default
     */
    useImageTag(use: boolean): void;
    /**
     * Set default background size for images that are not using <img> tag
     * @param backgroundSize {string} Background size
     */
    setBackgroundSize(backgroundSize: string): void;
    /**
     * Set background repeat for images that are not using <img> tag
     * @param backgroundRepeat {string} Background repeat
     */
    setBackgroundRepeat(backgroundRepeat: string): void;
    /**
     * Set fallback URL to use when image src is undefined or did not resolve.
     * This image will not be cached. This should ideally be a locally saved image.
     * @param fallbackUrl {string} The remote or local URL of the image
     */
    setFallbackUrl(fallbackUrl: string): void;
    /**
     * Set the maximum number of allowed connections at the same time.
     * @param concurrency
     */
    setConcurrency(concurrency: number): void;
    /**
     * Sets the maximum allowed cache size
     * @param cacheSize {number} Cache size in bytes
     */
    setMaximumCacheSize(cacheSize: number): void;
    /**
     * Sets the maximum allowed cache age
     * @param cacheAge {number} Maximum cache age in milliseconds
     */
    setMaximumCacheAge(cacheAge: number): void;
    /**
     * Set the return type of cached images
     * @param imageReturnType {string} The return type; either 'base64' or 'uri'
     */
    setImageReturnType(imageReturnType: 'base64' | 'uri'): void;
    /**
     * Set the default spinnern ame
     * @param name
     */
    setSpinnerName(name: string): void;
    /**
     * Set the default spinner color
     * @param color
     */
    setSpinnerColor(color: string): void;
}
