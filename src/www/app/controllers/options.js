const options = angular.module('options', []);

// ================================= Controlador de opções
options.controller('options', ['$scope', '$http', ($scope, $http) => {
  const token = (document.cookie).split('=', 2)[1];
  const user = JSON.parse(window.localStorage.getItem('user'));
  $scope.user = user;
  $scope.session = () => {
    if (!token) {
      window.localStorage.clear();
      window.location.href = '/';
    }
    $http.get('/valid', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .success((response) => {
        window.localStorage.setItem('validSession', JSON.stringify(response.ok));
        $scope.name = user.name;
      })
      .error(() => {
        window.localStorage.clear();
        window.location.href = '/';
      });
  };

  $scope.submit = () => {
    const {
      name,
      password,
      Npassword,
      RNpassword,
    } = $scope;

    if (name === '' || password, Npassword, RNpassword === undefined) {
      console.log('há campos vazios');
      return 0;
    }
    if (!(Npassword === RNpassword)) {
      alert('As senhas não batem!');
      return 0;
    }
    const data = {
      name,
      password,
      Npassword,
    };

    $http.put('/options/modify', data, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .success((response) => {
        window.localStorage.clear();
        window.localStorage.setItem('user', JSON.stringify(response.user));
        document.cookie = `token=${response.token}; path=/`;
        window.location.href = '/';
      })
      .error((response) => {
        console.log(response);
      });
  };
}]);
