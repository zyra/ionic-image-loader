# ionic-image-loader
**Ionic 2** Component and Service to load images in a background thread and cache them for later use. Uses `cordova-plugin-file` and `cordova-plugin-file-transfer` via `ionic-native` wrappers.

# Usage
```
import { IonicImageLoader } from 'ionic-image-loader';

// import the module
@NgModule({
  ...
  imports: [
    IonicImageLoader
  ]
})


import { ImageLoaderConfig } from 'ionic-image-loader';
@Component({
...
})
export class MyMainAppComponent {
  
  constructor(
    private imageLoaderConfig: ImageLoaderConfig // optional, if you wish to configure the service 
  ){
    imageLoaderConfig.enableDebugMode();
    imageLoaderConfig.setCacheDirectory('my-custom-cache-directory-name');
  }
  
}
```

```
<img-loader src="https://path.to/my/image.jpg"></img-loader>
```
