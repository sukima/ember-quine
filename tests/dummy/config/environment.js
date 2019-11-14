'use strict';

module.exports = function(environment) {
  let ENV = {
    modulePrefix: 'dummy',
    environment,
    rootURL: '/',
    locationType: 'hash',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. EMBER_NATIVE_DECORATOR_SUPPORT: true
      },
      EXTEND_PROTOTYPES: {
        // Prevent Ember Data from overriding Date.parse.
        Date: false
      }
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
      enableDirtyDataPopup: false,
      forceUpgradeAvailable: false,
    }
  };

  if (environment === 'development') {
    ENV.APP.deployUrl = 'http://localhost:4200';
    ENV.APP.forceUpgradeAvailable = true;
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
    ENV.APP.autoboot = false;
    ENV.APP.enableDirtyDataPopup = false;
    ENV.APP.forceUpgradeAvailable = false;
    ENV.APP.deployUrl = null;
  }

  if (environment === 'production') {
    // here you can enable a production-specific feature
    ENV.APP.enableDirtyDataPopup = true;
    ENV.APP.forceUpgradeAvailable = true;
    ENV.APP.deployUrl = 'https://sukima.github.io/ember-quine';
  }

  return ENV;
};
