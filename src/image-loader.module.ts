import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ImgLoader } from './components/img-loader/img-loader';
import { ImageLoader } from './providers/image-loader';
import { ImageLoaderConfig } from './providers/image-loader-config';
import { ImageLoaderSpinner } from './components/image-loader-spinner/image-loader-spinner';
import { BrowserModule } from '@angular/platform-browser';

@NgModule({
  declarations: [
    ImgLoader,
    ImageLoaderSpinner
  ],
  providers: [
    ImageLoaderConfig,
    ImageLoader
  ],
  imports: [
    BrowserModule
  ],
  exports: [
    ImgLoader
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class IonicImageLoader {}
