/**
 * Script para SPA
 */
const app1 = angular.module('app', ['auth',
  'subcribe',
  'ngRoute']);

app1.config(['$routeProvider', '$locationProvider', ($routeProvider, $locationProvider) => {
  $locationProvider.html5Mode({
    enabled: true,
    requireBase: false,
  });

  $routeProvider
    .when('/', {
      templateUrl: 'app/views/home.html',
      controller: 'MainCtrl',
    })
    .when('/form', {
      templateUrl: 'app/views/form.html',
      controller: 'MainCtrl',
    })
    .when('/projetos-grupos', {
      templateUrl: 'app/views/projetos-grupos.html',
      controller: 'MainCtrl',
    })
    .when('/:date/:post', {
      templateUrl: (params) => { return `/blog/getPost/${params.date}/${params.post}`; },
      controller: 'AllCtrl',
    })
    .otherwise({ redirectTo: '/' });
}]);

app1.controller('MainCtrl', ['$rootScope', '$location', ($rootScope, $location) => {
  // eslint-disable-next-line no-param-reassign
  $rootScope.activetab = $location.path();
}]);
app1.controller('AllCtrl', ['$rootScope', '$routeParams', '$location', ($rootScope, $routeParams, $location) => {
  // eslint-disable-next-line no-param-reassign
  $rootScope.activetab = $location.path() + $routeParams.date + $routeParams.post;
}]);

angular.bootstrap(document.getElementById('app'), ['auth', 'subcribe']);
