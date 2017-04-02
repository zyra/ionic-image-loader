import { NgModule } from '@angular/core';
import { ImgLoader } from './components/img-loader';
import { ImageLoader } from './providers/image-loader';
import { ImageLoaderConfig } from './providers/image-loader-config';
import { IonicModule } from 'ionic-angular';
import { File } from '@ionic-native/file';
import { Transfer } from '@ionic-native/transfer';

@NgModule({
  declarations: [
    ImgLoader
  ],
  providers: [
    ImageLoaderConfig,
    ImageLoader,
    File,
    Transfer
  ],
  imports: [
    IonicModule
  ],
  exports: [
    ImgLoader
  ]
})
export class IonicImageLoader {}
