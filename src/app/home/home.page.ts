import { Component } from '@angular/core';

import { ImageLoaderConfigService } from '../../../projects/ionic-image-loader/src/lib/services/image-loader-config.service';
import { ImageLoaderService } from '../../../projects/ionic-image-loader/src/lib/services/image-loader.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(private imageLoaderConfig: ImageLoaderConfigService,
              private imageLoader: ImageLoaderService) {
    this.imageLoaderConfig.setMaximumCacheAge(60 * 60 * 1000);
  }

  clearCache(): void {
    this.imageLoader.clearCache();
  }
}
