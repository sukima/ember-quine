import Service, { inject as service } from '@ember/service';

export const STORE_NAME = 'settings';

export default Service.extend({
  quine: service(),

  autoUpgradeEnabled: true,

  init() {
    this._super(...arguments);
    let savedSettings = this.quine.loadStore(STORE_NAME) || {};
    this.setProperties(savedSettings);
  },

  update(newSettings = {}) {
    this.setProperties(newSettings);
    this.quine.saveStore(STORE_NAME, this.toJSON());
  },

  toJSON() {
    return this.getProperties(
      'autoUpgradeEnabled',
    );
  },

});
