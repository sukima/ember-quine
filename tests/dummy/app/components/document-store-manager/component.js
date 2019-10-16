import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { STORE_NAME as TODOS_STORE_ID } from '../../services/todo-store';
import { getStoreArea, loadStore } from 'ember-quine';

function guardReadOnlyStore(id) {
  if (id !== TODOS_STORE_ID) { return; }
  let error = new Error(`${TODOS_STORE_ID} is a readonly store`);
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
    return [...this.storeAreaNode.children].map(node => {
      let id = node.id;
      let data = loadStore(id, this.document);
      let json = JSON.stringify(data, null, 2);
      let canDestroy = id !== TODOS_STORE_ID;
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
