//
//
//
var app = angular.module('app', []); 


app.controller('reset', ['$scope', '$http', '$location',($scope, $http, $location) => {
    $scope.reset = () => {
        data = $location.search();
        return data;
    };
 
    $scope.submit = (data) => {
        password = $scope.password;

        if(password == undefined){
            alert('Há compos vazios!');
            return 0;
        }

        json = JSON.parse('{ "email": "'+data.email+'","token": "'+data.token+'","password": "'+password+'" }');
        
        $http.post('/auth/reset_password', json)
        .success(function(response) {
            console.log(response);
        })
        .error(function(response){
            console.log(response);
        });

    }

 }]);

app.controller('forgot', ['$scope', '$http',($scope, $http) => {
    $scope.forgot = () => {
        email = JSON.parse('{ "email": "'+$scope.email+'"}');
        
        $http.post('/auth/forgot_password', email)
        .success((response)=> {
            console.log(response);
        })
        .error((response) => {
            console.log(response);
        })


    }
}]);
 
 
 