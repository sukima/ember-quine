ember-quine
==============================================================================

> A quine is a computer program which takes no input and produces a copy of its
> own source code as its only output.
> ~ [Quine (computing) - Wikipedia](https://en.wikipedia.org/wiki/Quine_(computing))

Ember Quine is an Ember addon that enables an Ember app to be self downloaded
as a single HTML file that runs offline (via the `file://` URI).

This is best understood through demonstration. Vist the
[live example](https://sukima.github.io/ember-quine/) and play with it.


Compatibility
------------------------------------------------------------------------------

* Ember.js v3.4 or above
* Ember CLI v2.13 or above
* Node.js v8 or above


Installation
------------------------------------------------------------------------------

```
ember install ember-quine
```

By default all JS and CSS assets are compiled into the final `index.html` file.
To disabled this (for development purposes) add the following to your
`config/environment.js`:

```js
ENV['ember-quine'] = { enabled: false };
```

Usage
------------------------------------------------------------------------------

This addon provides a quine service which exposes methods to download the app
and load/save/remove data from the document storage mechanism.

### Downloading the Quine App

Use the `download()` method to have the browser download a copy of the current
running quine.

```js
import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
  quine: service(),

  actions: {
    download(filename) {
      this.quine.download(filename);
    }
  }
});
```

This works by reading the HTML nodes (head and body) and capturing their
innerHTML. It then constructs a new HTML document with string concatenation. It
then builds a new <a> tag with its href set to the constructed HTML. It adds
the tag to the document, triggers a click action, and then removes the element.

#### quine.download(filename)

Initiates a download of the quine. It will reset `quine.isDirty` to false.

**Triggered Events**

* didDownload

**Params**

* filename `string|undefined` - the filename to save as. Will default to the
  application name. It will add an `.html` extension if missing.

### Data Storage

The data storage provided saves data to the DOM directly. See Data Store
section for more information.

#### quine.loadStore(storeName)

Loads the data from the DOM and returns the value stored.

**Returns**: `any` - The payload stored in the data store or undefined if not
found

**Params**

* storeName string - The name of the store to load

#### quine.saveStore(storeName, data)

Saves data to the DOM. Will set `quine.isDirty` to true.

**Triggered Events**

* didSaveStore - passes an object with a storeName property
* didChange

**Params**

* storeName `string` - The name of the store to save
* data `any` - The payload to be saved to the data store

#### quine.destroyStore(storeName)

Removes a stored set of data by storeName from the DOM. Will set
`quine.isDirty` to true.

**Triggered Events**

* didDestroyStore - passes an object with a storeName property
* didChange

**Params**

* storeName `string` - The name of the store to destroy

#### quine.destroyAllStores()

Removes all data from the DOM. quine.isDirty to true.

**Triggered Events**

* didDestroyAllStores
* didChange


Contributing
------------------------------------------------------------------------------

See the [Contributing](CONTRIBUTING.md) guide for details.


License
------------------------------------------------------------------------------

This project is licensed under the [MIT License](LICENSE.md).
