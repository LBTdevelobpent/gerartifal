var app = angular.module('app', []); 

//Para validar uma sessão
app.controller("auth", function($scope, $http,$window){
    $scope.session = function(){
        token = $window.localStorage.getItem('token');
        if(!token){ //caso não exista token, desvalida a sessão
            console.log("no session");
            $window.localStorage.clear();
            return;
        }
        $http.get("/valid", { 
            headers:{'Authorization': 'Bearer '+token+''}
        })
        .success(function(response){ //se tiver tudo certo, valida uma sessao
            user = JSON.parse($window.localStorage.getItem('user'));
            if(response.user === user._id){
                document.getElementById("a").innerHTML = user.name;
                $window.localStorage.setItem('validSession', JSON.stringify(response.ok));//criar uma chave afirmando a validade da sessao
            }
        })
        .error(function(response){
            console.log(response);
            $window.localStorage.clear();
        });
    };

    $scope.logout = function(){
        $window.localStorage.clear();
        $window.location.href = "/";
    }
});

app.controller("session", function($scope, $window){
    $scope.validClass = function(){
        valid = $window.localStorage.getItem('validSession');
        if(valid == "true"){
            return "nav-link d-none d-lg-block";
        }else{
            return "nav-link disabled d-md-none";
        }
    };

    $scope.validDrop = function(){
        valid = $window.localStorage.getItem('validSession');
        if(valid == "true"){
            return "btn btn-success dropdown-toggle";
        }else{
            return "btn disabled btn-success dropdown-toggle";
        }
    };


});


