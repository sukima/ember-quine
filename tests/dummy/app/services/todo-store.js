import Service, { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { A } from '@ember/array';

export const STORE_NAME = 'todos';

export default Service.extend({
  quine: service(),

  todos: computed(function() {
    return A(this.quine.loadStore(STORE_NAME) || []);
  }),

  findAll() {
    return this.todos;
  },

  addTodo(todo) {
    this.todos.pushObject(todo);
    this.sync();
  },

  removeTodo(todo) {
    this.todos.removeObject(todo);
    this.sync();
  },

  removeTodos(todos) {
    this.todos.removeObjects(todos);
    this.sync();
  },

  sync() {
    this.quine.saveStore(STORE_NAME, this.todos);
  }
});
