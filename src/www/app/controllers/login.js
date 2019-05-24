  //
//  Este script contém os controladores de registro(login e register)
//
const app3 = angular.module('sigin', []);

// ==================== Checa se há alguem logado(por cookie) ===================
app3.controller('check', ['$scope', '$window', ($scope) => {
  $scope.check = () => {
    if ((document.cookie).split('=', 2)[1]) {
      window.location.href = '/';
    }
  };
}]);
// ============================= Controlador de registro ======================================
app3.controller('register',['$scope', '$http', ($scope, $http) => {
  $scope.submit = () => {
    const { name, password, email } = $scope;
    const captcha = $('#g-recaptcha-response').val();
    const data = {
      name,
      email,
      password,
      captcha,
    };

    if (name === 'undefined' || !email || !password) {
      alert('Campos inválidos');
    } else if (password.length < 8) {
      document.getElementById('senha-invalida').innerHTML = 'Senha invalida: A senha deve conter no mínimo 8 dígitos';
    } else {
      $http.post('/auth/register', data)
        .success((response) => {
          alert('Registrado com sucesso, verifique sua conta');
          window.location.href = '/';
        })
        .error((response) => {
          alert(response.error);
        });
    }
  };
}]);
// ============================= Controlador de login ============================================
app3.controller('login', ['$scope', '$http', '$window',($scope, $http, $window) => {
  $scope.submit = () => {
    const { email, password } = $scope;
    const data = { email, password };
    
    if (email === 'undefined' || !password) {
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
