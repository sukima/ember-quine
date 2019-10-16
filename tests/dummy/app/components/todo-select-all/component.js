import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  tagName: '',

  isAllCompleted: computed('todos.@each.completed', function() {
    return this.todos.every(todo => todo.completed);
  }),

  isNoneCompleted: computed('todos.@each.completed', function() {
    return this.todos.every(todo => !todo.completed);
  }),

  isIndeterminate: computed('{isAllCompleted,isNoneCompleted}', function() {
    return !(this.isAllCompleted || this.isNoneCompleted);
  }),

});
