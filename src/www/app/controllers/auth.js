const app = angular.module('app', []);

// Para validar uma sessão
app.controller('auth', ($scope, $http, $window) => {
  $scope.session = () => {
    const token = $window.localStorage.getItem('token');
    if (!token) { // caso não exista token, desvalida a sessão
      console.log('no session');
      $window.localStorage.clear();
      return;
    }
    $http.get('/valid', {
      headers: { Authorization: `Bearer ${token}` },
    }).success((response) => { // se tiver tudo certo, valida uma sessao
      const { _id, name } = JSON.parse($window.localStorage.getItem('user'));
      if (response.user === _id) {
        document.getElementById('a').innerHTML = name;
        $window.localStorage.setItem('validSession', JSON.stringify(response.ok));// criar uma chave afirmando a validade da sessao
      }
    }).error((response) => {
      console.log(response);
      $window.localStorage.clear();
    });
  };

  $scope.logout = () => {
    $window.localStorage.clear();
    $window.location.href = '/';
  };
});
// ativa / desativa itens na tela, dependendo da sessão
app.controller('session', ($scope, $window) => {
  $scope.validClass = () => {
    const valid = $window.localStorage.getItem('validSession');
    if (valid === 'true') {
      return 'nav-link d-none d-lg-block';
    }
    return 'nav-link disabled d-md-none';
  };

  $scope.validDrop = () => {
    const valid = $window.localStorage.getItem('validSession');
    if (valid === 'true') {
      return 'btn btn-success dropdown-toggle';
    }
    return 'btn disabled btn-success dropdown-toggle';
  };
});
