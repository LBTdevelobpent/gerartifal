var app = angular.module('app', []); 


app.controller('options', function($scope, $http, $window){
    $scope.session = function() {
        token = $window.localStorage.getItem('token');
        if(!token){
            window.localStorage.clear();
            $window.location.href = '/';
        }

        $http.get("/valid", { 
            headers:{'Authorization': 'Bearer '+token+''}
        })
        .success(function(response) {
            user = JSON.parse($window.localStorage.getItem('user'));
            $window.localStorage.setItem('validSession', JSON.stringify(response.ok));         
            $scope.name = user.name;

        })
        .error(function(response){
            window.localStorage.clear();
            $window.location.href = '/';
        });

    };

    $scope.submit = function() {

        token = $window.localStorage.getItem('token');        
        name = $scope.name;
        password = $scope.password;
        Npassword = $scope.Newpassword;
        RNpassword = $scope.RNewpassword;
        
        

        if(name == "" || password,Npassword,RNpassword == undefined){
            console.log("há campos vazios");
            return 0;
        }
        if(!(Npassword == RNpassword)){
            console.log("A nova senha não bate");
            return 0;
        }
        data = JSON.parse('{ "name": "'+name+'", "password": "'+password+'", "Npassword": "'+Npassword+'"}');
        
        $http.put("/auth/modify", data,{ 
            headers:{'Authorization': 'Bearer '+token+''}
        })
        .success(function(response) {
            $window.localStorage.clear();
            $window.localStorage.setItem('user', JSON.stringify(response.user));
            $window.localStorage.setItem('token', response.token);
            $window.location.href = "/";
            
        })
        .error(function (response) {
            console.log(response);
        });

        
             

        
    };
});