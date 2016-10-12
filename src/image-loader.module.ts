import { NgModule } from '@angular/core';
import { ImgLoader } from "./components/img-loader";
import { ImageLoader } from "./providers/image-loader";
import { ImageLoaderConfig } from "./providers/image-loader-config";

@NgModule({
  declarations: [
    ImgLoader
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
