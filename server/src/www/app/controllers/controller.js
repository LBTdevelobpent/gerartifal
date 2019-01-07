var app = angular.module('app', []); 

app.controller('Users', function($scope, $http, $interval){
    $http.get('/auth/getAll')
    .success(function(response){
        $scope.users = response.user;
        console.log(response);
    });
});