var app = angular.module('app', []);

// ================================= Controlador de opções 
app.controller('options', ['$scope', '$http', '$window',($scope, $http, $window) => {
    $scope.session =  () => {
        token = (document.cookie).split('=', 2)[1];
        if(!token){
            window.localStorage.clear();
            $window.location.href = '/';
        }

        $http.get("/valid", {
            headers:{'Authorization': 'Bearer '+token+''}
        })
        .success((response) => {
            user = JSON.parse($window.localStorage.getItem('user'));
            $window.localStorage.setItem('validSession', JSON.stringify(response.ok));
            $scope.name = user.name;

        })
        .error((response)=>{
            window.localStorage.clear();
            $window.location.href = '/';
        });

    };

    $scope.submit = () => {

        token = (document.cookie).split('=', 2)[1];
        name = $scope.name;

        password = $scope.password;
        Npassword = $scope.Newpassword;
        RNpassword = $scope.RNewpassword;



        if(name == "" || password,Npassword,RNpassword == undefined){
            console.log("há campos vazios");
            return 0;
        }
        if(!(Npassword == RNpassword)){
            alert("As senhas não batem!");
            return 0;
        }
        data = {name,password,Npassword};

        $http.put("/options/modify", data,{
            headers:{'Authorization': 'Bearer '+token+''}
        })
        .success(function(response) {
            $window.localStorage.clear();
            $window.localStorage.setItem('user', JSON.stringify(response.user));
            document.cookie = `token=${response.token}; path=/`;
            $window.location.href = "/";

        })
        .error(function (response) {
            console.log(response);
        });





    };
}]);
