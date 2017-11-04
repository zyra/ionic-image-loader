import { NgModule, ModuleWithProviders } from '@angular/core';
import { ImgLoader } from './components/img-loader';
import { ImageLoader } from './providers/image-loader';
import { ImageLoaderConfig } from './providers/image-loader-config';
import { IonicModule } from 'ionic-angular';
import { File } from '@ionic-native/file';
import { FileTransfer } from '@ionic-native/file-transfer';

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
        File,
        FileTransfer
      ]
    };
  }
}
