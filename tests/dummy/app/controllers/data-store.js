import Controller from '@ember/controller';
import { isBlank } from '@ember/utils';

export default Controller.extend({
  actions: {

    addOrUpdateStore(update) {
      let storeData;
      let { tempStoreId: id, tempStoreData: data } = this;
      if (isBlank(id)) { return; }
      this.set('storeError', null);
      try {
        storeData = JSON.parse(data);
      } catch(error) {
        storeData = { data };
      }
      try {
        update(id, storeData);
        this.set('tempStoreId', '');
        this.set('tempStoreData', '');
      } catch(error) {
        if (error.code !== 'EREADONLY') { throw error; }
        this.set('storeError', error);
      }
    },

  },

});
