import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('about', { path: '/' });
  this.route('todos');
  this.route('data-store');
  this.route('docs');
});

export default Router;
