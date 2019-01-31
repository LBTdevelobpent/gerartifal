const app = angular.module('app', []);

app.controller('subcribe', ($scope, $http, $window) => {
  const token = $window.localStorage.getItem('token');

  // validação de sessão como adm
  $scope.sessionAdm = () => {
    if (!token) {
      $window.localStorage.clear();
      $window.location.href = '/';
    }

    const user = JSON.parse($window.localStorage.getItem('user'));

    $http.post('/valid/adm', user, {
      headers: { Authorization: `Bearer ${token}` },
    }).success((response) => {
      $window.localStorage.setItem('validSession', JSON.stringify(response.ok));
    }).error(() => {
      $window.location.href = '/';
    });
  };
  // validação de sessão
  $scope.session = () => {
    if (!token) {
      $window.localStorage.clear();
      $window.location.href = '/';
    }

    $http.get('/valid', {
      headers: { Authorization: `Bearer ${token}` },
    }).success((response) => {
      $window.localStorage.setItem('validSession', JSON.stringify(response.ok));
    }).error(() => {
      $window.localStorage.clear();
      $window.location.href = '/';
    });
  };
  // Criação da ficha de inscrição

  $scope.submit = () => {
    const { name, age, cpf } = $scope;
    const data = JSON.parse(`{ "name": "${name}", "age": ${age}, "cpf": ${cpf} }`);
    // Create

    $http.post('/subcribe/create', data, {
      headers: { Authorization: `Bearer ${token}` },
    }).success((response) => {
      console.log(response);
    }).error((response) => {
      console.log(response.error);
    });
  };
  // Mostrar ficha de inscrição

  $scope.showSub = () => {
    $http.get('/subcribe/find', {
      headers: { Authorization: `Bearer ${token}` },
    }).success((response) => {
      const { name, age, cpf } = response.subcribe;
      $scope.nome = name;
      $scope.idade = age;
      $scope.CPF = cpf;
    }).error((response) => {
      console.log(response.error);
    });
  };
  // Apagar inscrição

  $scope.delete = () => {
    const { _id } = JSON.parse($window.localStorage.getItem('user'));

    $http.delete(`/subcribe/${_id}`, {
      params: { subId: _id },
      headers: { Authorization: `Bearer ${token}` },
    }).success((response) => {
      console.log(response);
    }).error((response) => {
      console.log(response.error);
    });
  };
  // Mostrar todas as fichas

  $scope.showAllSub = () => {
    $http.get('/subcribe/findAll', {
      headers: { Authorization: `Bearer ${token}` },
    }).success((response) => {
      const { subcribe } = response;
      for (let c = 0; c < subcribe.length; c += 1) {
        $scope.nome = subcribe[c].name;
        $scope.idade = subcribe[c].age;
        $scope.cpf = subcribe[c].cpf;
      }
    }).error((response) => {
      console.log(response.error);
    });
  };
});
