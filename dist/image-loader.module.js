import { NgModule } from '@angular/core';
import { ImgLoader } from './components/img-loader';
import { ImageLoader } from './providers/image-loader';
import { ImageLoaderConfig } from './providers/image-loader-config';
import { IonicModule } from 'ionic-angular';
import { File } from '@ionic-native/file';
import { FileTransfer } from '@ionic-native/file-transfer';
var IonicImageLoader = (function () {
    function IonicImageLoader() {
    }
    IonicImageLoader.forRoot = function () {
        return {
            ngModule: IonicImageLoader,
            providers: [
                ImageLoaderConfig,
                ImageLoader,
                File,
                FileTransfer
            ]
        };
    };
    return IonicImageLoader;
}());
export { IonicImageLoader };
IonicImageLoader.decorators = [
    { type: NgModule, args: [{
                declarations: [
                    ImgLoader
                ],
                imports: [
                    IonicModule
                ],
                exports: [
                    ImgLoader
                ]
            },] },
];
/** @nocollapse */
IonicImageLoader.ctorParameters = function () { return []; };
//# sourceMappingURL=image-loader.module.js.map