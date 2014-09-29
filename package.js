Package.describe({
  summary: "Middleware support for Meteor publish functions",
  version: '0.1.0',
  name: 'peerlibrary:middleware',
  git: 'https://github.com/peerlibrary/meteor-middleware.git'
});

Package.on_use(function (api) {
  api.versionsFrom('METEOR@0.9.3');
  api.use(['coffeescript', 'underscore'], 'server');

  api.export('PublishEndpoint');
  api.export('PublishMiddleware');

  api.add_files([
    'server.coffee'
  ], 'server');
});

Package.on_test(function (api) {
  api.use(['peerlibrary:middleware', 'tinytest', 'test-helpers', 'coffeescript', 'insecure', 'random', 'peerlibrary:assert', 'underscore'], ['client', 'server']);

  api.add_files('tests.coffee', ['client', 'server']);
});
