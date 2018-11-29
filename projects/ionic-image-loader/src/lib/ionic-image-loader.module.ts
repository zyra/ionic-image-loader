import { ModuleWithProviders, NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { File } from '@ionic-native/file/ngx';
import { IonicModule } from '@ionic/angular';

import { ImageLoaderConfigService } from '../../services/image-loader-config.service';
import { ImageLoaderService } from '../../services/image-loader.service';
import { IonicImageLoaderComponent } from './ionic-image-loader.component';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    IonicModule,
    HttpClientModule,
    CommonModule,
  ],
  declarations: [IonicImageLoaderComponent],
  exports: [IonicImageLoaderComponent]
})

export class IonicImageLoader {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: IonicImageLoader,
      providers: [
        ImageLoaderConfigService,
        ImageLoaderService,
        File
      ]
    };
  }
}
