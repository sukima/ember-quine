import Component from '@ember/component';

export default Component.extend({
  tagName: '',

  showAlert: true,

  actions: {
    closeAlert() {
      this.set('showAlert', false);
      if (this.onClose) {
        this.onClose();
      }
    }
  }
});
