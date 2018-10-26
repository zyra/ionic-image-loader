import { HttpClientModule } from '@angular/common/http';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { File } from '@ionic-native/file';
import { IonicModule } from '@ionic/angular';
import { ImageLoaderConfigService } from '../../services/image-loader-config.service';
import { ImageLoaderService } from '../../services/image-loader.service';
import { IonicImageLoaderComponent } from './ionic-image-loader.component';

@NgModule({
  imports: [
      IonicModule,
      HttpClientModule
  ],
  declarations: [IonicImageLoaderComponent],
  exports: [IonicImageLoaderComponent]
})
export class IonicImageLoader {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: IonicImageLoaderComponent,
        providers: [
            ImageLoaderConfigService,
            ImageLoaderService,
            File
        ]
    }
  }
}
