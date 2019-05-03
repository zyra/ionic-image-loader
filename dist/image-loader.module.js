import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { File } from '@ionic-native/file';
import { IonicModule } from 'ionic-angular';
import { ImgLoaderComponent } from './components/img-loader';
import { ImageLoader } from './providers/image-loader';
import { ImageLoaderConfig } from './providers/image-loader-config';
import { HTTP } from '@ionic-native/http/ngx';
var IonicImageLoader = (function () {
    function IonicImageLoader() {
    }
    IonicImageLoader.forRoot = function () {
        return {
            ngModule: IonicImageLoader,
            providers: [
                HTTP,
                ImageLoaderConfig,
                ImageLoader,
                File,
            ],
        };
    };
    IonicImageLoader.decorators = [
        { type: NgModule, args: [{
                    declarations: [
                        ImgLoaderComponent,
                    ],
                    imports: [
                        IonicModule,
                        HttpClientModule,
                    ],
                    exports: [
                        ImgLoaderComponent,
                    ],
                    providers: [
                        HTTP
                    ]
                },] },
    ];
    return IonicImageLoader;
}());
export { IonicImageLoader };
//# sourceMappingURL=image-loader.module.js.map