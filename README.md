[![NPM](https://nodei.co/npm/ionic-image-loader.png?stars&downloads)](https://nodei.co/npm/ionic-image-loader/)
[![NPM](https://nodei.co/npm-dl/ionic-image-loader.png?months=6&height=2)](https://nodei.co/npm/ionic-image-loader/)

# Ionic Image Loader
**Ionic 2** Module that loads images in a native background thread and caches them for later use. Uses `cordova-plugin-file` and `cordova-plugin-file-transfer` via [`ionic-native`](https://github.com/driftyco/ionic-native) wrappers.

![Gif](https://github.com/ihadeed/ionic-image-loader-example/blob/master/gif.gif?raw=true)

- [Installation](https://github.com/zyramedia/ionic-image-loader#installation)
- [Usage](https://github.com/zyramedia/ionic-image-loader#usage)
  - [Basic usage](https://github.com/zyramedia/ionic-image-loader#basic-usage)
  - [Advanced Usage](https://github.com/zyramedia/ionic-image-loader#advanced-usage)
- [Global Configuration](https://github.com/zyramedia/ionic-image-loader#global-configuration)


## Installation

#### 1. Install the NPM Package
```
npm install --save ionic-image-loader
```

#### 2. Install Required Plugins
```
ionic plugin add cordova-plugin-file --save
ionic plugin add cordova-plugin-file-transfer --save
```

#### 3. Import `IonicImageLoader` module into your app's module.

```typescript
import { IonicImageLoader } from 'ionic-image-loader';

// import the module
@NgModule({
  ...
  imports: [
    IonicImageLoader
  ]
})
```

# Usage

## Basic Usage
This HTML code demonstrates basic usage of this module:
```html
<img-loader src="https://path.to/my/image.jpg"></img-loader>
```

By default, the module sets the image as the background of the `<img-loader>` element. If you want the module to use the image as an `<img>` tag inside the `<img-loader>` elemen, just add `useImg` attribute as shown below:
```html
<img-loader src="https://path.to/my/image.jpg" useImg></img-loader>
```

## Advanced Usage
The `<img-loader>` component takes many attributes that allows you to customize the image. You can use the following table as a reference:

| Attribute Name | Type | Description | Default Value |
| --- | --- | --- | --- |
| src | string | The image URL | N/A |
| fallback | string | Fallback image url to load in case the original image fails to load | N/A |
| spinner | boolean | Show a spinner while the image loads | true |
| useImg | boolean | Use `<img>` tag to display the image in | false |
| width | string | The width of the image. This is ignored if `useImg` is set to `true`. | 100% |
| height | string | The height of the image. This is ignored if `useImg` is set to `true`. | 100% |
| display | string | Sets the `display` CSS property of the `<img-loader>` element. This is ignored if `useImg` is set to `true`. | block |
| backgroundSize | string | Sets the `background-size` CSS property of the `<img-loader>` element. This is ignored if `useImg` is set to `true`. | contain |
| backgroundRepeat | string | Sets the `background-repeat` CSS property of the `<img-loader>` element. This is ignored if `useImg` is set to `true`. | no-repeat |


**Note:** The default values can be changed using the [global configuration](https://github.com/zyramedia/ionic-image-loader#global-configuration) feature.


# Global Configuration
This is optional but it is helpful if you wish to set the global configuration for all of your `<img-loader>` instances. To configure the module, inject the `ImageLoaderConfig` provider in your app's main component.
```typescript
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

Below are all the methods that the provider has:

#### enableDebugMode() 
Enables debug mode to receive console logs, errors, warnings.

#### enableSpinner(enable: boolean)
Sets the cache directory name. Defaults to 'image-loader-cache'.

#### setHeight(height: string)
Set default height for images that are not using <img> tag.

#### setWidth(width: string)
Set default width for images that are not using <img> tag.

#### setDisplay(display: string)
Enable display mode for images that are not using <img> tag.

#### useImageTag(use: boolean)
Use <img> tag by default.

#### setBackgroundSize(backgroundSize: string)
Set default background size for images that are not using <img> tag.

#### setBackgroundRepeat(backgroundRepeat: string)
Set background repeat for images that are not using <img> tag.

#### setFallbackUrl(fallbackUrl: string)
Set fallback URL to use when image src is undefined or did not resolve.
This image will not be cached. This should ideally be a locally saved image.


# Contributing
- **Having trouble?** Create an issue [here](https://github.com/zyramedia/ionic-image-loader/issues/new)
- **New feature or bug fix?** PRs are welcome :)
