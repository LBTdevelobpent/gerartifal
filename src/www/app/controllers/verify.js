var app = angular.module('app', []); 

app.controller('verify', function ($scope, $http, $window,$location) {
    $scope.verified = function() {
        data = $location.search();
        json = JSON.parse('{ "email": "'+data.email+'","token": "'+data.token+'"}');

        $http.post('/auth/register_verify', json)
        .success(function(response) {
            console.log(response);
            $window.location.href = "/";
        })
        .error(function(response) {
            console.log(response);
        });
    }
});