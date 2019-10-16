import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import config from '../config/environment';

export default Controller.extend({
  quine: service(),
  showUnsavedAlert: false,
  _canShowUnsavedAlert: true,

  init() {
    this._super(...arguments);
    this.quine.on('didChange', () => this.maybeShowUnsavedAlert());
    this.quine.on('didDownload', () => this.resetUnsavedAlertStatus());
    if (config.APP.enableDirtyDataPopup) {
      window.addEventListener('beforeunload', event => {
        if (this.quine.isDirty) {
          event.preventDefault();
          event.returnValue = '';
        } else {
          delete event.returnValue;
        }
      });
    }
  },

  maybeShowUnsavedAlert() {
    if (this._canShowUnsavedAlert) {
      this.set('showUnsavedAlert', true);
    }
  },

  closeUnsavedAlert() {
    this.set('showUnsavedAlert', false);
    this.set('_canShowUnsavedAlert', false);
  },

  resetUnsavedAlertStatus() {
    this.set('showUnsavedAlert', false);
    this.set('_canShowUnsavedAlert', true);
  },

  actions: {
    closeUnsavedAlert() {
      this.closeUnsavedAlert();
    }
  }
});
