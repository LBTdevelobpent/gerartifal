var app = angular.module('app', []); 

app.controller('check', function($scope, $window){
    $scope.check = function() {
        if($window.localStorage.getItem('token')){
            $window.location.href = "/";
        }
    };
});



app.controller('register', function($scope, $http, $window){
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
                alert("Registrado com sucesso, verifique sua conta");
                console.log(response);
            })
            .error(function(response){
                alert(response.error);
            });
        }
    };
});

app.controller('login', function($scope, $http, $window){
    $scope.submit = function(){
        name = $scope.name;
        password = $scope.password;
        data = JSON.parse('{ "name": "'+name+'", "password": "'+password+'"}');
    
        if(name=="undefined" || !email || !password){
        }else{
            $http.post('/auth/authenticate', data)
            .success(function(response){
                user = response.user;
                
                if(user.verified == false){
                    console.log("Email não verificado, porfavor verifique");
                    return 0;
                }
                console.log("sou um easterEgg, oi :)");
                alert("Logado com sucesso\nRedirecionando...");
                $window.localStorage.clear();
                $window.localStorage.setItem('user', JSON.stringify(response.user));
                $window.localStorage.setItem('token', response.token);
                $window.location.href = "/";
                
            })
            .error(function(response){
                console.log(response.error);
            });
        }
        
    };
});