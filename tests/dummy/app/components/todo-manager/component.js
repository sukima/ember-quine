import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { computed, set } from '@ember/object';
import { isBlank } from '@ember/utils';
import { bool, filterBy, reads } from '@ember/object/computed';
import { FILTERS } from '../../utils/todos-consts';

export const FILTERED_TODOS = Object.freeze({
  [FILTERS.ALL]: 'allTodos',
  [FILTERS.ACTIVE]: 'activeTodos',
  [FILTERS.COMPLETED]: 'completedTodos'
});

export default Component.extend({
  tagName: '',
  todoStore: service(),
  filter: FILTERS.ALL,

  allTodos: reads('todoStore.todos'),
  activeTodos: filterBy('allTodos', 'completed', false),
  completedTodos: filterBy('allTodos', 'completed', true),
  filteredTodos: computed('{filter,allTodos.[]}', function() {
    let todosProperty = FILTERED_TODOS[this.filter];
    return this[todosProperty];
  }),
  itemsLeft: reads('activeTodos.length'),
  hasCompletedItems: bool('completedTodos.length'),

  actions: {
    addTodo(label) {
      if (isBlank(label)) { return; }
      this.todoStore.addTodo({ label, completed: false });
    },

    removeTodo(todo) {
      this.todoStore.removeTodo(todo);
    },

    updateTodoLabel(todo, label) {
      if (isBlank(label)) { return; }
      set(todo, 'label', label);
      this.todoStore.sync();
    },

    setTodoCompleted(todo, isComplete) {
      set(todo, 'completed', isComplete);
      this.todoStore.sync();
    },

    toggleCompleted(todos) {
      let todoIsCompleted = todos.isEvery('completed');
      todos.forEach(todo => set(todo, 'completed', !todoIsCompleted));
      this.todoStore.sync();
    },

    clearAllCompleted() {
      let completed = this.todoStore.findAll().filterBy('completed');
      this.todoStore.removeTodos(completed);
    },

    setEditing(isEditing, todo) {
      set(todo, 'isEditing', isEditing);
    },

  }
});
