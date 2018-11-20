import { HttpClientModule } from '@angular/common/http';
import { ModuleWithProviders, NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from "@angular/common";
import { File } from '@ionic-native/file/ngx';
import { IonicModule } from '@ionic/angular';
import { ImageLoaderConfigService } from '../services/image-loader-config.service';
import { ImageLoaderService } from '../services/image-loader.service';
import { IonicImageLoaderComponent } from './ionic-image-loader.component';

@NgModule({
  imports: [
      IonicModule,
      CommonModule,
      HttpClientModule
  ],
  declarations: [IonicImageLoaderComponent],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  providers: [
      ImageLoaderConfigService,
      ImageLoaderService,
      File
  ],
  exports: [IonicImageLoaderComponent]
})
export class IonicImageLoader { }
