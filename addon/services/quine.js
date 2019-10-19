import Service from '@ember/service';
import Evented from '@ember/object/evented';
import { getOwner } from '@ember/application';
import { assert } from '@ember/debug';
import { saveQuine } from '../utils/quine';
import {
  destroyAllStores,
  destroyStore,
  loadStore,
  saveStore
} from '../utils/document-store';
import maybe from '../utils/maybe';

export default Service.extend(Evented, {
  isDirty: false,

  document: window.document,

  download(filename) {
    filename = maybe(filename)
      .nothing(() => {
        let env = getOwner(this).resolveRegistration('config:environment');
        return maybe(env).prop('APP.name');
      })
      .bind(name => name.endsWith('.html') ? name : `${name}.html`)
      .value();
    assert('Must provide a filename to download quine', filename);
    saveQuine(filename, this.document);
    this.set('isDirty', false);
    this.trigger('didDownload', { filename });
  },

  loadStore(storeName) {
    return loadStore(storeName, this.document);
  },

  saveStore(storeName, data) {
    saveStore(storeName, data, this.document);
    this.set('isDirty', true);
    this.trigger('didSaveStore', { storeName });
    this.trigger('didChange');
  },

  destroyStore(storeName) {
    destroyStore(storeName, this.document);
    this.set('isDirty', true);
    this.trigger('didDestroyStore', { storeName });
    this.trigger('didChange');
  },

  destroyAllStores() {
    destroyAllStores(this.document);
    this.set('isDirty', true);
    this.trigger('didDestroyAllStores');
    this.trigger('didChange');
  }
});
