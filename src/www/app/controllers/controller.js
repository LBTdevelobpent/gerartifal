//
//  Este script contém os controladores de registro(login e register)
//
const app = angular.module('app', []);

// ==================== Checa se há alguem logado(por cookie) ===================
app.controller('check', ['$scope', '$window',($scope, $window) => {
  $scope.check = () => {
    if ((document.cookie).split('=', 2)[1]) {
      $window.location.href = '/';
    }
  };
}]);
// ============================= Controlador de registro ======================================
app.controller('register',['$scope', '$http', ($scope, $http) => {
  $scope.submit = () => {
    const { name, password, email } = $scope;
    const data = {name, email,password};

    if (name === 'undefined' || !email || !password) {
      alert('Campos inválidos');
    } else if (password.length < 8) {
      document.getElementById('senha-invalida').innerHTML = 'Senha invalida: A senha deve conter no mínimo 8 dígitos';
    } else {
      $http.post('/auth/register', data)
        .success((response) => {
          alert('Registrado com sucesso, verifique sua conta');
          console.log(response);
        })
        .error((response) => {
          alert(response.error);
        });
    }
  };
}]);
// ============================= Controlador de login ============================================
app.controller('login', ['$scope', '$http', '$window',($scope, $http, $window) => {
  $scope.submit = () => {
    const { name, password } = $scope;
    const data = {name, password};

    if (name === 'undefined' || !password) {
      alert('a');
    } else {
      $http.post('/auth/authenticate', data)
        .success((response) => {
          const { user, token } = response;

          if (user.verified === false) {
            alert('Email não verificado, por favor verifique');
            return 0;
          }
          alert('Logado com sucesso\nRedirecionando...');
          $window.localStorage.clear();
          $window.localStorage.setItem('user', JSON.stringify(user));
          const date = new Date();
          date.setTime(date.getTime() + 1);
          document.cookie = `token=${token}; path=/`;

          $window.location.href = '/';
          return 0;
        })
        .error((response) => {
          console.log(response.error);
        });
    }
  };
}]);
