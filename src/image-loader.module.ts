import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ImgLoader } from './components/img-loader';
import { ImageLoader } from './providers/image-loader';
import { ImageLoaderConfig } from './providers/image-loader-config';
import { BrowserModule } from '@angular/platform-browser';
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
    BrowserModule,
    IonicModule
  ],
  exports: [
    ImgLoader
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class IonicImageLoader {}
