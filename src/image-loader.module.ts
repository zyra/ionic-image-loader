import { ModuleWithProviders, NgModule } from '@angular/core';
import { ImgLoader } from './components/img-loader';
import { ImageLoader } from './providers/image-loader';
import { ImageLoaderConfig } from './providers/image-loader-config';
import { IonicModule } from 'ionic-angular';
import { File } from '@ionic-native/file';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    ImgLoader
  ],
  imports: [
    IonicModule,
    HttpClientModule,
  ],
  exports: [
    ImgLoader
  ]
})
export class IonicImageLoader {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: IonicImageLoader,
      providers: [
        ImageLoaderConfig,
        ImageLoader,
        File,
      ]
    };
  }
}
