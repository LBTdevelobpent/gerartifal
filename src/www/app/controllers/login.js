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
app3.controller('register', ['$scope', '$http', ($scope, $http) => {
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
      $('.errorCamp.register').hide().html('Campos inválidos').fadeIn(200);
    } else if (password.length < 8) {
      document.getElementById('senha-invalida').innerHTML = 'Senha invalida: A senha deve conter no mínimo 8 dígitos';
    } else {
      $http.post('/auth/register', data)
        .success((response) => {
          alert('Registrado com sucesso, verifique sua conta');
          window.location.href = '/';
        })
        .error((response) => {
          $('.errorCamp.register').hide().html(response.error).fadeIn(200);
        });
    }
  };
}]);
// ============================= Controlador de login ============================================
app3.controller('login', ['$scope', '$http', '$window', ($scope, $http, $window) => {
  $scope.submit = () => {
    const { emailOrUser, password } = $scope;
    const data = { emailOrUser, password };

    if (emailOrUser === 'undefined' || !password) {
      $('.errorCamp.login').html('Há Campos vazios');
    } else {
      $http.post('/auth/authenticate', data)
        .success((response) => {
          const { user, token } = response;

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
          $('.errorCamp.login').hide().html(response.error).fadeIn(200);
        });
    }
  };
}]);

app3.controller('forgotPassword', ['$scope', '$http', ($scope, $http) => {
  $scope.submit = () => {
    const { email } = $scope;

    if (email === 'undefined') {
      alert('Há campos vazios');
    } else {
      $('#forgotButton').prop('disabled', true);
      $http.post('/auth/forgot_password', { email })
        .success(() => {
          alert('Email de recuperação enviado para sua caixa de email');
          $('#forgotButton').prop('disabled', false);
        })
        .error((response) => {
          $('.errorCamp.forgotPassword').hide().html(response.error).fadeIn(200);
          $('#forgotButton').prop('disabled', false);
        });
    }
  };
}]);
