const app2 = angular.module('auth', []);

// ==================================== Para validar uma sessão ==========================
app2.controller('auth', ['$scope', '$http', ($scope, $http) => {
  $scope.session = () => {

    $http.get('/blog/getCarrousel')
      .success((response) => {
        $scope.carrousel = response;
      });
    $http.get('/blog/getPosts')
      .success((response) => {
        $('#include').html(response);
      });

    // ===============Checkagem de abertura de incrição===============//
    const openSub = window.localStorage.getItem('openSub');
    if (!openSub) {
      window.localStorage.setItem('openSub', false);
    }
    const socket = io.connect('http://localhost:3000/');
    socket.on('openF', (data) => {
      const date = Date.now();
      if (date >= Date.parse(data.from) && date <= Date.parse(data.until)) {
        window.localStorage.setItem('openSub', true);
      }
    });
    // ===============================================================//

    const token = (document.cookie).split('=', 2)[1];
    if (!token) { // caso não exista token, desvalida a sessão
      console.log('no session');
      document.cookie = 'token=; path=/';
      window.localStorage.clear();
      return;
    }
    $http.get('/valid', {
      headers: { Authorization: `Bearer ${token}` },
    }).success((response) => { // se tiver tudo certo, valida uma sessao
      const { _id } = JSON.parse(window.localStorage.getItem('user'));
      if (response.user === _id) {
        window.localStorage.setItem('validSession', JSON.stringify(response.ok));// criar uma chave afirmando a validade da sessao
      }
    }).error((response) => {
      console.log(response);
      document.cookie = 'token=; path=/';
      window.localStorage.clear();
    });
  };

  $scope.logout = () => {
    window.localStorage.clear();
    document.cookie = 'token=;path=/';
    window.location.href = '/';
  };
}]);
