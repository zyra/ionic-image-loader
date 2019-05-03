import { File } from '@ionic-native/file';
import { Platform } from 'ionic-angular';
import { ImageLoaderConfig } from './image-loader-config';
import { HTTP } from '@ionic-native/http/ngx';
export declare class ImageLoader {
    private config;
    private file;
    private http;
    private platform;
    /**
     * Indicates if the cache service is ready.
     * When the cache service isn't ready, images are loaded via browser instead.
     * @type {boolean}
     */
    private isCacheReady;
    /**
     * Indicates if this service is initialized.
     * This service is initialized once all the setup is done.
     * @type {boolean}
     */
    private isInit;
    /**
     * Number of concurrent requests allowed
     * @type {number}
     */
    private concurrency;
    /**
     * Queue items
     * @type {Array}
     */
    private queue;
    private processing;
    /**
     * Fast accessible Object for currently processing items
     */
    private currentlyProcessing;
    private cacheIndex;
    private currentCacheSize;
    private indexed;
    constructor(config: ImageLoaderConfig, file: File, http: HTTP, platform: Platform);
    readonly nativeAvailable: boolean;
    private readonly isCacheSpaceExceeded;
    private readonly isWKWebView;
    private readonly isIonicWKWebView;
    private readonly isDevServer;
    /**
     * Check if we can process more items in the queue
     * @returns {boolean}
     */
    private readonly canProcess;
    /**
     * Preload an image
     * @param {string} imageUrl Image URL
     * @returns {Promise<string>} returns a promise that resolves with the cached image URL
     */
    preload(imageUrl: string): Promise<string>;
    getFileCacheDirectory(): string;
    /**
     * Clears cache of a single image
     * @param {string} imageUrl Image URL
     */
    clearImageCache(imageUrl: string): void;
    /**
     * Clears the cache
     */
    clearCache(): void;
    /**
     * Gets the filesystem path of an image.
     * This will return the remote path if anything goes wrong or if the cache service isn't ready yet.
     * @param {string} imageUrl The remote URL of the image
     * @returns {Promise<string>} Returns a promise that will always resolve with an image URL
     */
    getImagePath(imageUrl: string): Promise<string>;
    /**
     * Returns if an imageUrl is an relative path
     * @param {string} imageUrl
     */
    private isImageUrlRelative(imageUrl);
    /**
     * Add an item to the queue
     * @param {string} imageUrl
     * @param resolve
     * @param reject
     */
    private addItemToQueue(imageUrl, resolve, reject);
    /**
     * Processes one item from the queue
     */
    private processQueue();
    /**
     * Search if the url is currently in the queue
     * @param imageUrl {string} Image url to search
     * @returns {boolean}
     */
    private currentlyInQueue(imageUrl);
    /**
     * Initialize the cache service
     * @param [boolean] replace Whether to replace the cache directory if it already exists
     */
    private initCache(replace?);
    /**
     * Adds a file to index.
     * Also deletes any files if they are older than the set maximum cache age.
     * @param {FileEntry} file File to index
     * @returns {Promise<any>}
     */
    private addFileToIndex(file);
    /**
     * Indexes the cache if necessary
     * @returns {Promise<void>}
     */
    private indexCache();
    /**
     * This method runs every time a new file is added.
     * It checks the cache size and ensures that it doesn't exceed the maximum cache size set in the config.
     * If the limit is reached, it will delete old images to create free space.
     */
    private maintainCacheSize();
    /**
     * Remove a file
     * @param {string} file The name of the file to remove
     * @returns {Promise<any>}
     */
    private removeFile(file);
    /**
     * Get the local path of a previously cached image if exists
     * @param {string} url The remote URL of the image
     * @returns {Promise<string>} Returns a promise that resolves with the local path if exists, or rejects if doesn't exist
     */
    private getCachedImagePath(url);
    /**
     * Throws a console error if debug mode is enabled
     * @param {any[]} args Error message
     */
    private throwError(...args);
    /**
     * Throws a console warning if debug mode is enabled
     * @param {any[]} args Error message
     */
    private throwWarning(...args);
    /**
     * Check if the cache directory exists
     * @param directory {string} The directory to check. Either this.file.tempDirectory or this.getFileCacheDirectory()
     * @returns {Promise<boolean|FileError>} Returns a promise that resolves if exists, and rejects if it doesn't
     */
    private cacheDirectoryExists(directory);
    /**
     * Create the cache directories
     * @param replace {boolean} override directory if exists
     * @returns {Promise<DirectoryEntry|FileError>} Returns a promise that resolves if the directories were created, and rejects on error
     */
    private createCacheDirectory(replace?);
    /**
     * Creates a unique file name out of the URL
     * @param {string} url URL of the file
     * @returns {string} Unique file name
     */
    private createFileName(url);
    /**
     * Converts a string to a unique 32-bit int
     * @param {string} string string to hash
     * @returns {number} 32-bit int
     */
    private hashString(string);
    /**
     * Extract extension from filename or url
     *
     * @param {string} url
     * @returns {string}
     */
    private getExtensionFromUrl(url);
}
