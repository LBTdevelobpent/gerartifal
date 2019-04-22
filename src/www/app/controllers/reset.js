//
// Este script contém os controladores para modificações da senha
//
var app = angular.module('app', []); 

// ====================== Controller reset password =================================
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

        json = {email:data.email,token:data.token,password:data.password};
        
        $http.post('/auth/reset_password', json)
        .success(function(response) {
            console.log(response);
        })
        .error(function(response){
            console.log(response);
        });

    }

 }]);
// ====================== Controlador forget password ================
app.controller('forgot', ['$scope', '$http',($scope, $http) => {
    $scope.forgot = () => {
        email = {email};
        
        $http.post('/auth/forgot_password', email)
        .success((response)=> {
            console.log(response);
        })
        .error((response) => {
            console.log(response);
        })


    }
}]);
 
 
 