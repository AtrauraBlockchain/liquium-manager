'use strict';

angular.module('liquiumapi', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'checklist-model',
  'ngAnimate',
  'ui.router',
  'ui.router.util',
  'base64',
  'restangular',
  'directive.loading',
  'my-crud',
  'ui.bootstrap',
  'ngQuickDate',
  'geolocation',
  'ngOrderObjectBy',
  'ui.codemirror',
  'ui.bootstrap.datetimepicker'
])
.constant('APP', {'baseUrl': '/api/v1', 'suffix': '' })

.config(function (APP, RestangularProvider, $base64, $locationProvider, $stateProvider, $urlRouterProvider, $httpProvider, $urlMatcherFactoryProvider) {

  delete $httpProvider.defaults.headers.common['X-Requested-With'];
  RestangularProvider.setBaseUrl(APP.baseUrl);
  RestangularProvider.setRequestSuffix(APP.suffix);

  $urlRouterProvider.otherwise('/#');
  $locationProvider.html5Mode(false);

  $stateProvider
  .state('public', { abstract: true,
         template: '<ui-view/>',
         data: {
           access: 'public'
         }
  })
  .state('public.404', {
    url: '/404/',
    templateUrl: '404'
  });

  $stateProvider
  .state('abstract', {
    abstract: true,
    template: '<ui-view autoscroll="false" />',
    resolve: {
    },
    controller: 'GlobalCtrl'
  })
    .state('polls', {
    url: '/polls',
    parent: 'abstract',
    controller: 'CollectionListController',
    templateUrl: 'views/polls/list.html'
  })
  .state('categories', {
    url: '/categories',
    parent: 'abstract',
    controller: 'CollectionListController',
    templateUrl: 'views/categories/list.html'
  })
  .state('delegates', {
    url: '/delegates',
    parent: 'abstract',
    controller: 'CollectionListController',
    templateUrl: 'views/delegates/list.html'
  })
  .state('users', {
    url: '/users',
    parent: 'abstract',
    controller: 'CollectionListController',
    templateUrl: 'views/users/list.html'
  })
  .state('createOrg', {
    url: 'views/modals/',
    parent: 'abstract',
    controller: 'CollectionListController',
    templateUrl: 'views/modals/createOrg.html'
  })
}).
  run(function($window, Restangular, $modal, $q) {
  Restangular.setErrorInterceptor(function(data) {
    if (data.status == 401 || data.status == 403) {
      console.log('Authorization problems in run');
    }
    return data;
  });
});
