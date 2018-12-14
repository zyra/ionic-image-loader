import { Component } from '@angular/core';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { Platform } from '@ionic/angular';
import { ImageLoaderConfigService } from '../../projects/ionic-image-loader/src/lib/services/image-loader-config.service';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    imageLoaderConfig: ImageLoaderConfigService,
  ) {
    this.initializeApp();

    // enable debug mode to get console logs and stuff
    imageLoaderConfig.enableDebugMode();
    // set a fallback url to use by default in case an image is not found
    imageLoaderConfig.setFallbackUrl('assets/fallback.png');

    imageLoaderConfig.setImageReturnType('base64');

    imageLoaderConfig.setSpinnerColor('secondary');
    imageLoaderConfig.setSpinnerName('bubbles');


    imageLoaderConfig.maxCacheSize = 2 * 1024 * 1024; // 2 MB
    imageLoaderConfig.maxCacheAge = 60 * 1000; // 1 minute
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
}
