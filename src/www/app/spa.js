/**
 * Script para SPA
 */
const app1 = angular.module('app', ['auth',
  'subcribe',
  'sigin',
  'options',
  'ngRoute']);

app1.config(['$routeProvider', '$locationProvider', ($routeProvider, $locationProvider) => {
  $locationProvider.html5Mode({
    enabled: true,
    requireBase: true,
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
    .when('/googleAuth', {
      redirectTo: () => {
        window.location.href = '/auth/google';
      },
    })
    .when('/projetos-grupos', {
      templateUrl: 'app/views/projetos-grupos.html',
      controller: 'MainCtrl',
    })
    .when('/option', {
      templateUrl: 'app/views/accOptions.html',
      controller: 'OptCtrl',
    })
    .when('/:date/:post', {
      templateUrl: (params) => { return `/blog/getPost/${params.date}/${params.post}`; },
      controller: 'AllCtrl',
    })
    .otherwise({ redirectTo: '/' });
}]);

app1.controller('MainCtrl', ['$rootScope', '$location', ($rootScope, $location) => {

  if ($location.path() !== '/') {
    $('.first').animate({
      height: '0vh',
    }, 500);
  } else {
    $('.first').animate({
      height: '45vh',
    }, 500);
  }

  // eslint-disable-next-line no-param-reassign
  $rootScope.activetab = $location.path();
}]);
app1.controller('OptCtrl', ['$rootScope', '$location', ($rootScope, $location) => {

  if ($location.path() !== '/') {
    $('.first').animate({
      height: '0vh',
    }, 500);
  } else {
    $('.first').animate({
      height: '45vh',
    }, 500);
  }

  // eslint-disable-next-line no-param-reassign
  $rootScope.activetab = $location.path();
}]);
app1.controller('AllCtrl', ['$rootScope', '$routeParams', '$location', ($rootScope, $routeParams, $location) => {
  // eslint-disable-next-line no-param-reassign
  $rootScope.activetab = $location.path() + $routeParams.date + $routeParams.post;
}]);

angular.bootstrap(document.getElementById('app'), ['auth', 'subcribe', 'sigin', 'options']);
