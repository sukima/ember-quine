import Component from '@ember/component';
import EmberObject from '@ember/object';
import PromiseProxyMixin from '@ember/object/promise-proxy-mixin';
import config from '../../config/environment';
import { inject as service } from '@ember/service';

const UpgradeLoader = EmberObject.extend(PromiseProxyMixin);

export default Component.extend({

  tagName: '',

  quineUpdater: service(),

  currentVersion: config.APP.version,

  didInsertElement() {
    this._super(...arguments);
    this.quineUpdater.loadLatestVersion();
  },

  actions: {

    upgrade() {
      let loader = UpgradeLoader.create({
        promise: this.quineUpdater.upgrade()
      });
      this.set('loader', loader);
    }

  }

});
