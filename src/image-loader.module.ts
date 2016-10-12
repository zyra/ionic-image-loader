import { NgModule } from '@angular/core';
import { ImgLoader } from './components/img-loader/img-loader';
import { ImageLoader } from './providers/image-loader';
import { ImageLoaderConfig } from './providers/image-loader-config';
import { ImageLoaderSpinner } from './components/image-loader-spinner/image-loader-spinner';

@NgModule({
  declarations: [
    ImgLoader,
    ImageLoaderSpinner
  ],
  providers: [
    ImageLoaderConfig,
    ImageLoader
  ],
  exports: [
    ImgLoader
  ]
})
export class IonicImageLoader {}
