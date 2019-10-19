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
