import Service, { inject as service } from '@ember/service';
import config from '../config/environment';
import { computed } from '@ember/object';
import { waiterFor } from '../utils/post-messages';
import { EVENTS, EVENT_TIMEOUTS } from '../utils/upgrade-consts';
import FrameManager from '../utils/frame-manager';
import URI from 'urijs';

function frameManagerFor(deployUrl) {
  let srcUrl = new URI(deployUrl).fragment('/?upgrade=true').toString();
  return new FrameManager(srcUrl, {
    name: `${config.APP.name}-${config.APP.version}`,
    className: 'hidden'
  });
}

function urlMatchesCurrentLocation(url) {
  let currentOrigin = new URI().origin();
  let origin = new URI(url).origin();
  return origin === currentOrigin;
}

export default Service.extend({
  quine: service(),

  isUpadateAvailable: computed('latestVersion', function() {
    return this.latestVersion && this.latestVersion !== config.APP.version;
  }),

  async getLatestVersionNumber(deployUrl = config.APP.deployUrl) {
    if (!deployUrl || urlMatchesCurrentLocation(deployUrl)) {
      return null;
    }
    let frameManager = frameManagerFor(deployUrl);
    let waitForPostMessage = waiterFor(deployUrl);
    let pendingVersionReady = waitForPostMessage(EVENTS.READY, {
      timeout: EVENT_TIMEOUTS[EVENTS.READY]
    });
    frameManager.append();
    try {
      let { data: { version } } = await pendingVersionReady;
      return version;
    } finally {
      frameManager.remove();
    }
  },

  async loadLatestVersion(deployUrl) {
    let latestVersion = await this.getLatestVersionNumber(deployUrl);
    this.set('latestVersion', latestVersion);
  },

  async upgrade(deployUrl = config.APP.deployUrl) {
    let data = this.quine.exportStores();
    let frameManager = frameManagerFor(deployUrl);
    let waitForPostMessage = waiterFor(deployUrl);
    frameManager.append();
    try {
      await waitForPostMessage(EVENTS.READY, { timeout: EVENT_TIMEOUTS[EVENTS.READY] });
      frameManager.postMessage(EVENTS.LOAD_DATA, data);
      await waitForPostMessage(EVENTS.COMPLETED, { timeout: EVENT_TIMEOUTS[EVENTS.LOAD_DATA] });
      frameManager.postMessage(EVENTS.DOWNLOAD);
      await waitForPostMessage(EVENTS.COMPLETED, { timeout: EVENT_TIMEOUTS[EVENTS.DOWNLOAD] });
    } finally {
      frameManager.remove();
    }
  }

});
