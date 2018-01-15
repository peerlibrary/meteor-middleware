Package.describe({
  name: 'peerlibrary:middleware',
  summary: "Middleware support for Meteor publish functions",
  version: '0.2.0',
  git: 'https://github.com/peerlibrary/meteor-middleware.git'
});

Package.onUse(function (api) {
  api.versionsFrom('METEOR@1.4.4.5');

  // Core dependencies.
  api.use([
    'coffeescript@2.0.3_3',
    'ecmascript',
    'underscore'
  ], 'server');

  api.export('PublishEndpoint', 'server');
  api.export('PublishMiddleware', 'server');

  api.mainModule('server.coffee', 'server');
});

Package.onTest(function (api) {
  api.versionsFrom('METEOR@1.4.4.5');

  api.use([
    'coffeescript@2.0.3_3',
    'ecmascript',
    'tinytest',
    'test-helpers',
    'insecure',
    'random',
    'underscore'
  ]);

  // Internal dependencies.
  api.use([
    'peerlibrary:middleware'
  ]);

  // 3rd party dependencies.
  api.use([
    'peerlibrary:assert@0.2.5'
  ]);

  api.addFiles([
    'tests.coffee'
  ]);
});
