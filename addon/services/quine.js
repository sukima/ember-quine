import Service from '@ember/service';
import Evented from '@ember/object/evented';
import { assert } from '@ember/debug';
import { saveQuine } from '../utils/quine';
import {
  destroyAllStores,
  destroyStore,
  loadStore,
  saveStore
} from '../utils/document-store';

export default Service.extend(Evented, {
  isDirty: false,

  document: window.document,

  download(filename) {
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
  },

  destroyStore(storeName) {
    destroyStore(storeName, this.document);
    this.set('isDirty', true);
    this.trigger('didDestroyStore', { storeName });
  },

  destroyAllStores() {
    destroyAllStores(this.document);
    this.set('isDirty', true);
    this.trigger('didDestroyAllStores');
  }
});
