var app = angular.module('app', []); 

app.controller('register', function($scope, $http){
    $scope.submit = function(){
        name = $scope.name;
        password = $scope.password;
        email = $scope.email;
        data = JSON.parse('{ "name": "'+name+'", "email": "'+email+'", "password": "'+password+'"}');
    
        if(name=="undefined" || !email || !password){
            
        }else if(password.length < 8){
          document.getElementById("senha-invalida").innerHTML = "senha invalida, a senha deve conter no mínimo 8 dígitos";
        }
        else{
            $http.post('/auth/register', data)
            .success(function(response){
                console.log(response);
            })
            .error(function(response){
                alert(response.error);
            });
        }
    };
});