import { ModuleWithProviders, NgModule } from '@angular/core';
import { ImgLoader } from './components/img-loader';
import { ImageLoader } from './providers/image-loader';
import { ImageLoaderConfig } from './providers/image-loader-config';
import { IonicModule } from 'ionic-angular';
import { HTTP } from '@ionic-native/http';

@NgModule({
  declarations: [
    ImgLoader
  ],
  imports: [
    IonicModule
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
        HTTP,
      ]
    };
  }
}
