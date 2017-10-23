import { File } from '@ionic-native/file';
import { FileTransfer } from '@ionic-native/file-transfer';
import { ImageLoaderConfig } from "./image-loader-config";
import { Platform } from 'ionic-angular';
import 'rxjs/add/operator/first';
export declare class ImageLoader {
    private config;
    private file;
    private fileTransfer;
    private platform;
    readonly nativeAvailable: boolean;
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
    private transferInstances;
    private processing;
    private cacheIndex;
    private currentCacheSize;
    private indexed;
    private readonly shouldIndex;
    private readonly isWKWebView;
    private readonly isIonicWKWebView;
    constructor(config: ImageLoaderConfig, file: File, fileTransfer: FileTransfer, platform: Platform);
    /**
     * Preload an image
     * @param imageUrl {string} Image URL
     * @returns {Promise<string>} returns a promise that resolves with the cached image URL
     */
    preload(imageUrl: string): Promise<string>;
    /**
     * Clears the cache
     */
    clearCache(): void;
    /**
     * Gets the filesystem path of an image.
     * This will return the remote path if anything goes wrong or if the cache service isn't ready yet.
     * @param imageUrl {string} The remote URL of the image
     * @returns {Promise<string>} Returns a promise that will always resolve with an image URL
     */
    getImagePath(imageUrl: string): Promise<string>;
    /**
     * Add an item to the queue
     * @param imageUrl
     * @param resolve
     * @param reject
     */
    private addItemToQueue(imageUrl, resolve, reject);
    /**
     * Check if we can process more items in the queue
     * @returns {boolean}
     */
    private readonly canProcess;
    /**
     * Processes one item from the queue
     */
    private processQueue();
    /**
     * Initialize the cache service
     * @param replace {boolean} Whether to replace the cache directory if it already exists
     */
    private initCache(replace?);
    /**
     * Adds a file to index.
     * Also deletes any files if they are older than the set maximum cache age.
     * @param file {FileEntry} File to index
     * @returns {Promise<any>}
     */
    private addFileToIndex(file);
    /**
     * Indexes the cache if necessary
     * @returns {any}
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
     * @param file {string} The name of the file to remove
     */
    private removeFile(file);
    /**
     * Get the local path of a previously cached image if exists
     * @param url {string} The remote URL of the image
     * @returns {Promise<string>} Returns a promise that resolves with the local path if exists, or rejects if doesn't exist
     */
    private getCachedImagePath(url);
    /**
     * Throws a console error if debug mode is enabled
     * @param args {any[]} Error message
     */
    private throwError(...args);
    /**
     * Throws a console warning if debug mode is enabled
     * @param args {any[]} Error message
     */
    private throwWarning(...args);
    /**
     * Check if the cache directory exists
     * @param directory {string} The directory to check. Either this.file.tempDirectory or this.file.cacheDirectory
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
     * @param url {string} URL of the file
     * @returns {string} Unique file name
     */
    private createFileName(url);
    /**
     * Converts a string to a unique 32-bit int
     * @param string {string} string to hash
     * @returns {number} 32-bit int
     */
    private hashString(string);
}
