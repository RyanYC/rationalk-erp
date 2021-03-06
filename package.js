Package.describe({
  name: 'rationalk:erp',
  summary: 'ERP (entreprise ressource planning) for rationalK',
  version: '0.0.1',
  git: 'https://github.com/dokithonon/rationaK',
});

Package.onUse(function (api) {
  var packages;
  api.versionsFrom("METEOR@1.0");

  packages = [
    'rationalk:core@0.0.1',
  ];

  api.use(packages);

  api.addFiles([
    'lib/methods.js', //this load first
    'lib/collections.js', //this load second
    'lib/routes.js', //this load third
  ], ['client', 'server']);

  api.addFiles([
    'lib/client/plan.html',
    'lib/client/plan.js',
    'lib/client/transactions.html',
    'lib/client/transactions.js',
    'lib/client/build.html',
    'lib/client/build.js',
    'lib/client/stocks.html',
    'lib/client/stocks.js',
    'lib/client/products.html',
    'lib/client/products.js',
    'lib/client/gantt.html',
    'lib/client/gantt.js',
  ], 'client');

  api.addFiles([
    'lib/server/demo.js',
    'lib/server/publications.js',
    'lib/server/methods.js',
    'lib/server/methods-transactions.js',
  ], 'server');

  api.export([
    'RKERP', //expose the collection
  ]);
});
