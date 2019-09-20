//
// Este script contém os controladores para modificações da senha
//
const app = angular.module('app', []);

// ====================== Controller reset password =================================
app.controller('reset', ['$scope', '$http', '$location', ($scope, $http, $location) => {
  $scope.reset = () => {
    const data = $location.search();
    return data;
  };

  $scope.submit = (data) => {
    const { password, Rpassword } = $scope;

    if (password === undefined || Rpassword === undefined) {
      alert('Há compos vazios!');
      return 0;
    }

    if (password !== Rpassword) {
      alert('Senhas não batem');
      return 0;
    }

    const json = { email: data.email, token: data.token, password };

    $http.post('/auth/reset_password', json)
      .success((response) => {
        console.log(response);
        window.location.href = '/';
      })
      .error((response)=> {
        console.log(response);
      });
  };
}]);
