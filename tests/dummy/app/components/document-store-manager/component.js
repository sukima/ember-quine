import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { STORE_NAME as TODOS_STORE_ID } from '../../services/todo-store';
import { STORE_NAME as SETTINGS_STORE_ID } from '../../services/settings-store';
import { getStoreArea, loadAll } from 'ember-quine';

const RESTRICTED_STORE_IDS = Object.freeze([
  TODOS_STORE_ID,
  SETTINGS_STORE_ID
]);

function isRestricted(id) {
  return RESTRICTED_STORE_IDS.includes(id);
}

function guardReadOnlyStore(id) {
  if (!isRestricted(id)) { return; }
  let error = new Error(`${id} is a readonly store`);
  error.code = 'EREADONLY';
  throw error;
}

export default Component.extend({
  tagName: '',
  quine: service(),

  document: window.document,

  storeAreaNode: computed(function() {
    return getStoreArea(this.document);
  }),

  storeHTML: computed('storeAreaNode', function() {
    if (!this.storeAreaNode) { return; }
    let nodeLines = [...this.storeAreaNode.children]
      .map(node => `  ${node.outerHTML}`);
    return [
      `<div id="${this.storeAreaNode.id}" style="display: none;">`,
      ...nodeLines,
      '</div>'
    ].join('\n');
  }),

  storeNodes: computed('storeAreaNode', function() {
    if (!this.storeAreaNode) { return; }
    return [...loadAll(this.document)].map(([id, data]) => {
      let json = JSON.stringify(data, null, 2);
      let canDestroy = !isRestricted(id);
      return { id, data, json, canDestroy };
    });
  }),

  refreshData() {
    this.notifyPropertyChange('storeAreaNode');
  },

  didInsertElement() {
    this._super(...arguments);
    this.quine.on('didChange', this, this.refreshData);
  },

  willDestroyElement() {
    this._super(...arguments);
    this.quine.off('didChange', this, this.refreshData);
  },

  actions: {

    addOrUpdate(id, data) {
      guardReadOnlyStore(id);
      this.quine.saveStore(id, data);
    },

    destroy(id) {
      guardReadOnlyStore(id);
      this.quine.destroyStore(id);
    }

  }

});
