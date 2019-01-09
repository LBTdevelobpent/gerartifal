var app = angular.module('app', []); 

app.controller("auth", function($scope, $http,$window){
    $scope.session = function(){
        token = $window.localStorage.getItem('token');
        if(!token){
            console.log("no session");
            return;
        }
        $http.get("/valid", { 
            headers:{'Authorization': 'Bearer '+token+''}
        })
        .success(function(response){
            user = JSON.parse($window.localStorage.getItem('user'));
            if(response.user === user._id){
                document.getElementById("a").innerHTML = user.name;
            }
        })
        .error(function(response){
            console.log(response);
        });
    };

    $scope.logout = function(){
        $window.localStorage.clear();
        $window.location.href = "/";
    }
});
