import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { guidFor } from '@ember/object/internals';
import { computed } from '@ember/object';

export default Component.extend({
  tagName: '',

  settingsStore: service(),

  componentId: computed(function() {
    return guidFor(this);
  }),

  actions: {
    setSetting(prop, value) {
      this.settingsStore.update({ [prop]: value });
    }
  }
});
