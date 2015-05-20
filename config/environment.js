/* jshint node: true */

module.exports = function(environment) {
  var ENV = {
    modulePrefix: 'tables',
    podModulePrefix: 'tables/pods', //this need to be specify in order to let the app knows where to find the files
    environment: environment,
    baseURL: '/',
    locationType: 'auto',
    contentSecurityPolicy: {
      'default-src': "'none'",
      'script-src': "'self' 'unsafe-inline' 'unsafe-eval' http://localhost:4200/tables",
      'font-src': "'self' data: http://localhost:4200/tables",
      'connect-src': "'self'",
      'img-src': "'self' http://localhost:4200/tables",
      'style-src': "'self' 'unsafe-inline' http://localhost:4200/tables",
      'frame-src': "http://localhost:4200/tables"
    },
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      }
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    }
  };

  if (environment === 'development') {
    ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.baseURL = '/';
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';


  }

  if (environment === 'production') {

  }


  return ENV;
};
