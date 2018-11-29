[![npm](https://img.shields.io/npm/l/ionic-image-loader.svg)](https://www.npmjs.com/package/ionic-image-loader/)
[![npm](https://img.shields.io/npm/dt/ionic-image-loader.svg)](https://www.npmjs.com/package/ionic-image-loader)
[![npm](https://img.shields.io/npm/dm/ionic-image-loader.svg)](https://www.npmjs.com/package/ionic-image-loader)

# Ionic Image Loader
**Ionic** Module that loads images in a background thread and caches them for later use. Uses `HttpClient` from `Angular 4+`, and `cordova-plugin-file` via [`ionic-native`](https://github.com/driftyco/ionic-native) wrappers.


## Features
- Downloads images via a **native thread**. Images will download faster and they will not use the Webview's resources.
- **Caches images** for later use. Images will be show up instantly the next time you display them since they're already saved on the local storage.
- Shows a **loading spinner** while the images are loading. (can be disabled)
- Allows setting **maximum cache age** to delete old images automatically. This is optional and **disabled by default**.
- Allows setting **maximum cache size** to control how much space your app takes out of the users' phones. This is optional and **disabled by default**.
- Allows setting a **fallback image** to be displayed in case the image you're trying to show doesn't exist on the web. (optional)
- Works with the **[WKWebView Engine](https://github.com/apache/cordova-plugin-wkwebview-engine)** (iOS), as the images are copied to the temporary directory, which is accessible form within the WebView

![Gif](https://github.com/ihadeed/ionic-image-loader-example/blob/master/gif.gif?raw=true)

View our example project here: https://github.com/zyramedia/ionic-image-loader-example

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
npm i --save @ionic-native/file
ionic cordova plugin add cordova-plugin-file
```

#### 3. Import `IonicImageLoader` module

**Add `IonicImageLoader.forRoot()` in your app's root module**
```typescript
import { IonicImageLoader } from 'ionic-image-loader';

// import the module
@NgModule({
  ...
  imports: [
    IonicImageLoader.forRoot()
  ]
})
export class AppModule {}
```

**Then add `IonicImageLoader` in your child/shared module(s)**
```typescript
import { IonicImageLoader } from 'ionic-image-loader';

@NgModule({
  ...
  imports: [
    IonicImageLoader
  ]
})
export class SharedModule {}
```

# Usage

## Basic Usage
This HTML code demonstrates basic usage of this module:
```html
<img-loader src="https://path.to/my/image.jpg"></img-loader>
```

By default, the module sets the image as the background of the `<img-loader>` element. If you want the module to use the image as an `<img>` tag inside the `<img-loader>` element, just add `useImg` attribute as shown below:
```html
<img-loader src="https://path.to/my/image.jpg" useImg></img-loader>
```

You can also listen to the load event to be notified when the image has been loaded:
```html
<img-loader src="path/to/image" (load)="onImageLoad($event)></img-loader>
```
```typescript
import { ImgLoaderComponent } from 'ionic-image-loader';

...

onImageLoad(imgLoader: ImgLoaderComponent) {
  // do something with the loader
}
```

## Advanced Usage
The `<img-loader>` component takes many attributes that allows you to customize the image. You can use the following table as a reference:

| Attribute Name | Type | Description | Default Value |
| --- | --- | --- | --- |
| src | string | The image URL | N/A |
| fallbackUrl | string | Fallback image url to load in case the original image fails to load | N/A |
| spinner | boolean | Show a spinner while the image loads | true |
| useImg | boolean | Use `<img>` tag to display the image in | false |
| width | string | The width of the image. This is ignored if `useImg` is set to `true`. | 100% |
| height | string | The height of the image. This is ignored if `useImg` is set to `true`. | 100% |
| display | string | Sets the `display` CSS property of the `<img-loader>` element. This is ignored if `useImg` is set to `true`. | block |
| backgroundSize | string | Sets the `background-size` CSS property of the `<img-loader>` element. This is ignored if `useImg` is set to `true`. | contain |
| backgroundRepeat | string | Sets the `background-repeat` CSS property of the `<img-loader>` element. This is ignored if `useImg` is set to `true`. | no-repeat |
| fallbackAsPlaceholder | boolean | Use fallback as a placeholder until the image loads. | false |
| imgAttributes | ImageAttribute[] | An array of ImageAttribute objects (element, value).  If `useImg == true`, this array will be iterated and each object added as an attribute to the generated `<img>` HTML element. | []] |


**Note:** The default values can be changed using the [global configuration](https://github.com/zyramedia/ionic-image-loader#global-configuration) feature.

## Quirks
In some cases, images won't load on the first time, the culprit seems to be `@ionic-native/file` or `cordova-plugin-file` in its `writeFile` function not calling resolve or reject.

In the meantime we find a solution, here's a quick workaround:

In **./src/index.html** move your `polyfill.js`include above `cordova.js`
```
    <!-- The polyfills js is generated during the build process -->
    <script src="build/polyfills.js"></script>

    <!-- cordova.js required for cordova apps (remove if not needed) -->
    <script src="cordova.js"></script>
```

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
    
    // disable spinners by default, you can add [spinner]="true" to a specific component instance later on to override this
    imageLoaderConfig.enableSpinner(false);
    
    // set the maximum concurrent connections to 10
    imageLoaderConfig.setConcurrency(10);
  }
  
}
```

Below are all the methods that the config provider has:

#### enableDebugMode() 
Enables debug mode to receive console logs, errors, warnings.

Example:
```typescript
// enable debug mode to get console errors/warnings/logs
// this could be useful while trying to debug issues with the component
this.imageLoaderConfig.enableDebugMode();
```
---
#### enableSpinner(enable: boolean)
Sets the cache directory name. Defaults to 'image-loader-cache'. Defaults to `true`.

Example:
```typescript
this.imageLoaderConfig.enableSpinner(false); // disable spinner by default
```

---
#### setHeight(height: string)
Set default height for images that are not using <img> tag. Defaults to `100%`.

---
#### setWidth(width: string)
Set default width for images that are not using <img> tag. Defaults to `100%`.

Example:
```typescript
this.imageLoaderConfig.setWidth('500px'); // set default width to 500px
```

---
#### setDisplay(display: string)
Enable display mode for images that are not using <img> tag. Defaults to `block`.

Example:
```typescript
this.imageLoaderConfig.setDisplay('inline-block');
```
---
#### useImageTag(use: boolean)
Use <img> tag by default.

Example:
```typescript
this.imageLoaderConfig.useImageTag(true); // use `<img>` tag by default
```

---
#### setBackgroundSize(backgroundSize: string)
Set default background size for images that are not using <img> tag. Defaults to `contain`.

Example:
```typescript
this.imageLoaderConfig.setBackgroundSize('cover');
```
---
#### setBackgroundRepeat(backgroundRepeat: string)
Set background repeat for images that are not using <img> tag. Defaults to `no-repeat`.

Example:
```typescript
this.imageLoaderConfig.setBackgroundRepeat('repeat-x');
```
---

#### setFallbackUrl(fallbackUrl: string)
Set fallback URL to use when image src is undefined or did not resolve.
This image will not be cached. This should ideally be a locally saved image.

Example:
```typescript
this.imageLoaderConfig.setFallbackUrl('assets/fallback.png'); // if images fail to load, display this image instead
```

---
#### setCacheDirectoryName(directoryName: string)
Set a custom directory name to store the cached images in. The cache directory by default is named `image-loader-cache`.

Example:
```typescript 
this.imageLoaderConfig.setCacheDirectoryName('my-custom-cache-directory-name');
```
---

#### setConcurrency(concurrency: number)
Set the maximum number of concurrent connections. Cached images will be loaded instantly, this limit is only for new images.

Example:
```typescript
this.imageLoaderConfig.setConcurrency(5); // 5 concurrent connections
```
---
#### setMaximumCacheSize(cacheSize: number)
Sets the maximum cache size in bytes.

Example: 
```typescript
this.imageLoaderConfig.setMaximumCacheSize(20 * 1024 * 1024); // set max size to 20MB
```
---
#### setMaximumCacheAge(cacheAge: number)
Sets the maximum allowed cache age in milliseconds

Example:
```typescript
this.imageLoaderConfig.setMaximumCacheAge(7 * 24 * 60 * 60 * 1000); // 7 days
```
---
#### setImageReturnType(imageReturnType: string)
Set the return type of cached images. By default this option is set to 'uri', which will return the native file URL. If you want to get a base64-encoded representation of the file set the return type to 'base64'.

Example:
```typescript
this.imageLoaderConfig.setImageReturnType('base64');
```
---
#### enableFallbackAsPlaceholder(enable: boolean)
Enable/Disable the fallback image as placeholder instead of the spinner. Defaults to false.

Example:
```ts
this.imageLoaderConfig.enableFallbackAsPlaceholder(true);
```
---
#### setHttpHeaders(headers: HttpHeaders)
Set headers for HttpClient to use.

Example:
```ts
const headers = new HttpHeaders()
                  .set("Authorization", "Basic dGVzdHVzZXJuYW1lOnRlc3RwYXNzd29yZA==");
this.imageLoaderConfig.setHttpHeaders(headers);
```
---
#### setFileNameCachedWithExtension(enable: boolean)
Enable/Disable the save filename of cached images with extension.  Defaults to false.

Example:
```ts
this.imageLoaderConfig.setFileNameCachedWithExtension(true);
```
---
#### setFallbackFileNameCachedExtension(extension: string)
Sometime url missing extension, in this case you can set fallback as default extension. Defaults to '.jpg'

Example:
```ts
this.imageLoaderConfig.setFallbackFileNameCachedExtension('.png');
```
---

# Preloading images
```typescript
import { ImageLoader } from 'ionic-image-loader';

class MyComponent {
  
  constructor(imageLoader: ImageLoader) {
    imageLoader.preload('http://path.to/image.jpg');
  }
  
}

```

# Clearing the cache
```typescript

import { ImageLoader } from 'ionic-image-loader';

@Component(...)
class MyComponent {
  
  constructor(imageLoader: ImageLoader) {
    imageLoader.clearCache();
  }
  
}

```

# Clearing single image cache
```typescript

import { ImageLoader } from 'ionic-image-loader';

@Component(...)
class MyComponent {
  
  constructor(imageLoader: ImageLoader) {
    imageLoader.clearImageCache('http://path.to/image.jpeg');
  }
  
}

```

# Passing HTML / CSS Attributes to a generated image

When using ImageLoader to generate an `<img>` element it may be desirable for the generated element to include additional attributes to provide styling or interaction qualities.  The optional `imgAttributes` value can be used to provide such additional attributes which will be included in the generated `<img>` element in the DOM.

Usage:

1. Include the ImageAttribute model in your .ts
```typescript
import { ImageAttribute } from 'ionic-image-loader'
```

2. Generate an array of ImageAttribute objects
```typescript
const imageAttributes: ImageAttribute[] = [];
imageAttributes.push({
  element: 'class',
  value: 'circle-photo'
})
```

3. Include the `imgAttributes` element in the `img-loader` element of your HTML
```html
 <img-loader [src]="..." useImg [imgAttributes]="imageAttributes"> </img-loader>
```

4. The generated `<img>` tag will be rendered with the specified attributes
```html
  <img src="..." class="circle-photo">
```

<br><br>
## Contribution
- **Having an issue**? or looking for support? [Open an issue](https://github.com/zyra/ionic-image-loader/issues/new) and we will get you the help you need.
- Got a **new feature or a bug fix**? Fork the repo, make your changes, and submit a pull request.

## Support this project
If you find this project useful, please star the repo to let people know that it's reliable. Also, share it with friends and colleagues that might find this useful as well. Thank you :smile:
