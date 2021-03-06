//
// Este script fica responsável dos métodos e configurações do blog(seção de notícias)
//
const blog = angular.module('blog', ['ngRoute']);

const token = (document.cookie).split('=', 2)[1];

// =========================== Configuração dos métodos do blog ===============================
blog.controller('post', ['$scope', '$http', ($scope, $http) => {

  $scope.init = () => {
    if (!token) { // caso não exista token, desvalida a sessão
      console.log('no session');
      document.cookie = 'token=; path=/';
      window.localStorage.clear();
      window.location.href = '/';
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
        window.location.href = '/';
        return;
      });
    } else {
      document.cookie = 'token=; path=/';
      window.localStorage.clear();
      window.location.href = '/';
      return;
    }
  };

  $scope.removePost = (date, archiName) => {
    $http.delete(`/blog/removePost/${date}/${archiName}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .success(() => {
        window.location.href = '/posts';
      })
      .error((response) => {
        console.error(response);
      });
  };

  $scope.getPostPath = () => {
    $http.get('/blog/getPostPath')
      .success((response) => {
        const { path } = response;
        $scope.path = path;
      }).error((response) => {
        console.log(response);
      });
  };
}]);
