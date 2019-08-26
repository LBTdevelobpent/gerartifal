const auth = angular.module('auth', []);

// =======================Get Parametros da URL====================//
const getUrlParameter = function getUrlParameter(sParam) {
  const sPageURL = window.location.search.substring(1),
      sURLVariables = sPageURL.split('&');
  let sParameterName;
  for (let i = 0; i < sURLVariables.length; i += 1) {
    sParameterName = sURLVariables[i].split('=');

    if (sParameterName[0] === sParam) {
      return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
    }
  }
};
// ==============================================================//

auth.factory('authentication', ['$http', ($http) => {
  return {
    isAuthenticate: () => {
      const token = (document.cookie).split('=', 2)[1];
      if (!token) { // caso não exista token, desvalida a sessão
        console.log('no session');
        document.cookie = 'token=; path=/';
        window.localStorage.clear();
        return;
      }

      const { _id, email, adm } = JSON.parse(window.localStorage.getItem('user'));

      if (adm) {
        $http.post('/valid/adm', { adm, email, _id }, {
          headers: { Authorization: `Bearer ${token}` },
        }).success((response) => {
          const { user } = response;
          if (user._id === _id) {
            window.localStorage.setItem('validSession', JSON.stringify(response.ok));
            logged(true);
          }
        }).error((response) => {
          console.log(response);
          document.cookie = 'token=; path=/';
          window.localStorage.clear();
        });
      } else {
        $http.get('/valid', {
          headers: { Authorization: `Bearer ${token}` },
        }).success((response) => { // se tiver tudo certo, valida uma sessao
          if (response.user === _id) {
            window.localStorage.setItem('validSession', JSON.stringify(response.ok));// criar uma chave afirmando a validade da sessao
            logged(false);
          }
        }).error((response) => {
          console.log(response);
          document.cookie = 'token=; path=/';
          window.localStorage.clear();
        });
      }
    },

    openSubscribes: () => {
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
          openSubscribe();
        }
      });
    // ===============================================================//
    },
  };
}]);

// ==================================== Para validar uma sessão ==========================
auth.controller('auth', ['$scope', '$http', 'authentication', ($scope, $http, authentication) => {
  $scope.session = () => {
    if (getUrlParameter('token')) {
      const user = {
        _id: getUrlParameter('id'),
        name: getUrlParameter('name'),
        email: getUrlParameter('email'),
        adm: getUrlParameter('adm'),
        social: true,
      };
      window.localStorage.clear();
      window.localStorage.setItem('user', JSON.stringify(user));
      document.cookie = `token=${getUrlParameter('token')}; path=/`;
      window.location.href = '/';
    }

    $http.get('/blog/getCarrousel')
      .success((response) => {
        $scope.carrousel = response;
      });
    $http.get('/blog/getPosts')
      .success((response) => {
        $('#include').html(response);
      });

    authentication.openSubscribes();

    authentication.isAuthenticate();
  };

  $scope.logout = () => {
    window.localStorage.clear();
    document.cookie = 'token=;path=/';
    window.location.href = '/';
  };
}]);
