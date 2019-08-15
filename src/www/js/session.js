/**
 * Script para fazer modificações em caso de sessão estabelecida
 */
const valid = window.localStorage.getItem('validSession');
const user = window.localStorage.getItem('user');

$(document).ready(() => {
  if (valid || user) {
    $('#dropdown').removeClass('d-md-block d-lg-none');
    $('#dropdown').addClass('d-none d-lg-block');

    $('#logout').removeClass('d-none');
    $('#option').removeClass('d-md-block d-lg-none');
    $('#dropdownMenuButton').removeClass('d-none');
    $('#login').addClass('d-none');
    /**
     * Adicione aqui todos os elementos que só aparecerão apois login
     * */
  }
});

window.openSubscribe = () => {
  if (user) {
    $('#subButton').removeClass('disabled');
  }
};

window.logged = (adm) => {
  $('#dropdown').removeClass('d-md-block d-lg-none');
  $('#dropdown').addClass('d-none d-lg-block');

  $('#logout').removeClass('d-none');
  $('#option').removeClass('d-md-block d-lg-none');
  $('#dropdownMenuButton').removeClass('d-none');


  $('#login').addClass('d-none');


  if (!adm) {
    $('#postsOp').hide();
    $('#subsOp').hide();
    $('#searchOp').hide();
  }
};
