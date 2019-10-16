import Controller from '@ember/controller';
import { set } from '@ember/object';
import { FILTERS } from '../utils/todos-consts';

export default Controller.extend({
  FILTERS,
  filter: FILTERS.ALL,
  queryParams: ['filter'],

  actions: {
    updateLabelAndClearInput(updateLabel, label) {
      updateLabel(label);
      this.set('newTodoLabel', '');
    },

    startEditingTodo(todo) {
      set(todo, 'isEditing', true);
    }
  }
});
