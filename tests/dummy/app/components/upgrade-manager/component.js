import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { camelize } from '@ember/string';
import { messagerFor, MESSAGE_TYPE } from '../../utils/post-messages';
import { EVENTS } from '../../utils/upgrade-consts';
import config from '../../config/environment';

export default Component.extend({
  quine: service(),

  tagName: '',

  didInsertElement() {
    this._super(...arguments);
    if (window.parent) {
      this._postMessage = messagerFor(window.parent);
      this._postHandler = message => this.handlePostMessage(message);
      window.addEventListener('message', this._postHandler);
      let version = config.APP.forceUpgradeAvailable
        ? `${config.APP.version}-forced-upgrade`
        : config.APP.version;
      this._postMessage(EVENTS.READY, { version });
    }
  },

  willDestroyElement() {
    this._super(...arguments);
    window.removeEventListener('message', this._postHandler);
    this._postHandler = null;
    this._postMessage = null;
  },

  handlePostMessage(response) {
    let { event, type, data } = response.data;
    if (!(event && type === MESSAGE_TYPE)) { return; }
    let handlerMethod = `${camelize(event)}MessageHandler`;
    if (this[handlerMethod]) {
      try {
        return this[handlerMethod](data);
      } catch (error) {
        let { name, message, stack } = error;
        this._postMessage('error', { name, message, stack });
        throw error;
      }
    }
  },

  async loadDataMessageHandler(data) {
    await this.quine.importStores(data);
    this._postMessage(EVENTS.COMPLETED);
  },

  async downloadMessageHandler({ filename } = {}) {
    await this.quine.download(filename);
    this._postMessage(EVENTS.COMPLETED);
  },

});
