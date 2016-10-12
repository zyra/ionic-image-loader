[![NPM](https://nodei.co/npm/ionic-image-loader.png?stars&downloads)](https://nodei.co/npm/ionic-image-loader/)
[![NPM](https://nodei.co/npm-dl/ionic-image-loader.png?months=6&height=2)](https://nodei.co/npm/ionic-image-loader/)

# ionic-image-loader
**Ionic 2** Component and Service to load images in a background thread and cache them for later use. Uses `cordova-plugin-file` and `cordova-plugin-file-transfer` via `ionic-native` wrappers.

## Usage

### 1. Import `IonicImageLoader` module into your app's module.

```
import { IonicImageLoader } from 'ionic-image-loader';

// import the module
@NgModule({
  ...
  imports: [
    IonicImageLoader
  ]
})
```

### 2. (Optional) Configure the module by injecting `ImageLoaderConfig`
```
import { ImageLoaderConfig } from 'ionic-image-loader';
@Component({
...
})
export class MyMainAppComponent {
  
  constructor(
    private imageLoaderConfig: ImageLoaderConfig // optional, if you wish to configure the service 
  ){
    // enable debug mode to get console errors/warnings/logs
    // this could be useful while trying to debug issues with the component
    imageLoaderConfig.enableDebugMode();
    
    // set a custom name for the cache directory. The default name is 'image-loader-cache'
    imageLoaderConfig.setCacheDirectory('my-custom-cache-directory-name');
    
    // disable spinners by default, you can add [spinner]="true" to a specific component instance later on to override this
    imageLoaderConfig.enableSpinner(false);
  }
  
}
```

### 3. Use the `<img-loader>` tag to add images in your templates

#### Basic usage
```
<img-loader src="https://path.to/my/image.jpg"></img-loader>
```

#### Image with specific element dimensions
```
<img-loader src="https://path.to/my/image.jpg" width="500px" height="300px"></img-loader>
```

#### Image with `<img>` tag instead of an element with background image
```
<img-loader src="https://path.to/my/image.jpg" [useImg]="true"></img-loader>
```

#### Image without a loading spinner
```
<img-loader src="https://path.to/my/image.jpg" [spinner]="false"></img-loader>
```


## Contributing
- **Having trouble?** Create an issue [here](https://github.com/zyramedia/ionic-image-loader/issues/new)
- **New feature or bug fix?** PRs are welcome :)
