//
//  Este script é responsável pelas fichas de inscrição
//
const app = angular.module('subcribe', ['angularUtils.directives.dirPagination']);

app.filter('datafilter', () => {
  return (items, from, to) => {
    if ((from === undefined || to === undefined) || (from === null || to === null)) {
      return items;
    }
    const df = from;
    const dt = to;
    const result = [];
    for (let i = 0; i < items.length; i += 1) {
      const tf = new Date(items[i].createAt);
      const tt = new Date(items[i].createAt);
      if (tf > df && tt < dt) {
        result.push(items[i]);
      }
    }
    return result;
  };
});

// ===================== Controlador de validação de sessão - cookies ========================
app.controller('subcribe', ['$scope', '$http', '$window', 'authentication', ($scope, $http, $window, authentication) => {
  const token = (document.cookie).split('=', 2)[1];
  const openSub =  $window.localStorage.getItem('openSub');

  // ---------------Validação de sessão como adm---------------//
  $scope.sessionAdm = () => {
    if (!token) {
      document.cookie = 'token=;path=/';
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
  // -----------------------------------------------------------//

  // Validação de sessão
  $scope.session = () => {
    if (!token) {
      $window.localStorage.clear();
      $window.location.href = '/';
    }

    if (openSub === 'false' || openSub === '') {
      $window.localStorage.setItem('openSub', false);
      $window.location.href = '/';
    }

    const socket = io.connect('http://localhost:3000/');
    socket.on('openF', (data) => {
      $scope.morning = data.morning;
      $scope.evening = data.evening;
    });

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
    const {
      name,
      birthDate,
      cpf,
      curso,
      turno,
      hasInstrument,
      memberCommunity,
      birthState,
      birthCity,
      rg,
      orgaoEmissor,
      email,
      phone,
      address,
      city,
      state,
      cep,
      deficiency,
      schoolingDegree,
      howDiscovered,
      whyWants,
    } = $scope;

    const data = {
      name,
      birthDate,
      cpf,
      curso,
      turno,
      hasInstrument,
      memberCommunity,
      birthState,
      birthCity,
      rg,
      orgaoEmissor,
      email,
      phone,
      address,
      city,
      state,
      cep,
      deficiency,
      schoolingDegree,
      howDiscovered,
      whyWants,
    };

    $http.post('/subcribe/create', data, {
      headers: { Authorization: `Bearer ${token}` },
    }).success((response) => {
      console.log(response);
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
      alert(response.error);
      console.log(response.error);
    });
  };

  // ======================= Página de visualizar Incrições ============//

  // Mostrar todas as fichas de inscrições
  $scope.showAllSub = () => {
    $scope.sessionAdm();

    $http.get('/subcribe/findAll', {
      headers: { Authorization: `Bearer ${token}` },
    }).success((response) => {
      $scope.subscribe = response.subscribe;
    }).error((response) => {
      console.error(response.error);
    });
  };

  $scope.order = (keyname) => {
    $scope.sortKey = keyname;
    $scope.reverse = !$scope.reverse;
  };

  $scope.validSubs = (id) => {
    const conf = confirm('Precione OK para validar a inscrição');
    if (conf === true) {
      $http.post('/subcribe/validSubscribe', { id }, {
        headers: { Authorization: `Bearer ${token}` },
      }).success(() => {
        $scope.showAllSub();
      }).error((err) => {
        alert(err.error);
      });
    }
  };

  $scope.invalidSubs = (id) => {
    const conf = confirm('Precione OK para invalidar a inscrição');
    if (conf === true) {
      $http.post('/subcribe/invalidSubscribe', { id }, {
        headers: { Authorization: `Bearer ${token}` },
      }).success(() => {
        $scope.showAllSub();
      }).error((err) => {
        alert(err.error);
      });
    }
  };

  // ===================================================================//

  $scope.openSub = () => {
    const { from, until } = $scope;
    const morning = {
      Violino: $scope.Mviolin,
      Viola: $scope.Mviola,
      Cello: $scope.Mcello,
      Baixo_Acustico: $scope.Mbaixo,
      Tec_Vocal: $scope.Mvocal,
      Musicalizacao: $scope.Mmusical,
    };

    const evening = {
      Violino: $scope.Vviolin,
      Viola: $scope.Vviola,
      Cello: $scope.Vcello,
      Baixo_Acustico: $scope.Vbaixo,
      Tec_Vocal: $scope.Vvocal,
      Musicalizacao: $scope.Vmusical,
    };

    const data = {
      from,
      until,
      morning,
      evening,
    };

    $http.post('/openSubs', data, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .success((response) => {
        console.log(response);
      })
      .error((err) => {
        console.log(err);
      });
  };
}]);
