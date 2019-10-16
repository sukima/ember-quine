import Component from '@ember/component';
import { inject as service } from '@ember/service';

export const DEFAULT_FILE_NAME = 'ember-quine-example.html';

export default Component.extend({
  tagName: '',
  quine: service(),

  actions: {
    download(filename = DEFAULT_FILE_NAME) {
      this.quine.download(filename);
    }
  }
});
