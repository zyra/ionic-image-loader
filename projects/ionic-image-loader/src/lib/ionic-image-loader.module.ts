import {CommonModule} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';
import {ModuleWithProviders, NgModule} from '@angular/core';
import {File} from '@ionic-native/file/ngx';
import {IonicModule} from '@ionic/angular';
import {IonicImageLoaderComponent} from './ionic-image-loader.component';

import {ImageLoaderConfigService} from './services/image-loader-config.service';
import {ImageLoaderService} from './services/image-loader.service';
import {HTTP} from '@ionic-native/http/ngx';

@NgModule({
    imports: [
        IonicModule,
        HttpClientModule,
        CommonModule,
    ],
    declarations: [IonicImageLoaderComponent],
    exports: [IonicImageLoaderComponent],
    providers: [
        HTTP
    ]
})
export class IonicImageLoader {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: IonicImageLoader,
            providers: [
                HTTP,
                ImageLoaderConfigService,
                ImageLoaderService,
                File,
            ],
        };
    }
}
