var app = angular.module('app', []); 

app.controller('Users', function($scope, $http, $interval){
    $http.get('/auth/getAll')
    .success(function(response){
        $scope.users = response.user;
        console.log(response);
    });
});


app.controller('register', function($scope, $http){
    $scope.submit = function(){
        name = $scope.name;
        email = $scope.email;
        password = $scope.password;
        data = JSON.parse('{ "name": "'+name+'", "email": "'+email+'", "password": "'+password+'"}');
        
        $http.post('/auth/register', data)
        .success(function(response){
            console.log(response);
        })
        .error(function(response){
            console.log(response);
        });

    };
});