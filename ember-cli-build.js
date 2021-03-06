'use strict';

const EmberAddon = require('ember-cli/lib/broccoli/ember-addon');

module.exports = function(defaults) {
  let app = new EmberAddon(defaults, {
    // Add options here
    'ember-code-snippet': {
      snippetPaths: ['tests/dummy/app'],
    },

    'ember-prism': {
      theme: 'coy',
      components: [
        'handlebars',
        'javascript',
        'json',
        'markup',
        'markup-templating'
      ],
      plugins: [],
    }
  });

  /*
    This build file specifies the options for the dummy test app of this
    addon, located in `/tests/dummy`
    This build file does *not* influence how the addon or the app using it
    behave. You most likely want to be modifying `./index.js` or app's build file
  */

  app.import('node_modules/todomvc-common/base.css');
  app.import('node_modules/todomvc-app-css/index.css');

  return app.toTree();
};
