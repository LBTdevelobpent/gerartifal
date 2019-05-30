/**
 * Script para fazer modificações em caso de sessão estabelecida
 */
const valid = window.localStorage.getItem('validSession');
const user = window.localStorage.getItem('user');

$(document).ready(() => {
  if (valid || user) {
    $('#dropdown').removeClass('d-md-block d-lg-none');
    $('#dropdown').addClass('d-none d-lg-block');

    $('#logout').removeClass('d-md-block d-lg-none');
    $('#option').removeClass('d-md-block d-lg-none');
    $('#login').addClass('d-md-block d-lg-none');
    /**
     * Adicione aki todos os elementos que só aparecerão apois login
     * */
  }
});

window.logged = () => {
  $('#dropdown').removeClass('d-md-block d-lg-none');
  $('#dropdown').addClass('d-none d-lg-block');

  $('#logout').removeClass('d-md-block d-lg-none');
  $('#option').removeClass('d-md-block d-lg-none');
  $('#login').addClass('d-md-block d-lg-none');
};
