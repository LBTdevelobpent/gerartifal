/**
 * Script para fazer modificações em caso de sessão estabelecida
 */
$(document).ready(() => {
  const valid = window.localStorage.getItem('validSession');
  const user = window.localStorage.getItem('user');

  if (!valid || !user) {
    $('#dropdown').removeClass('d-none d-lg-block');
    $('#dropdown').addClass('d-md-block d-lg-none');

    /**
     * Adicione aki todos os elementos que só aparecerão apois login
     * */
  }
});
