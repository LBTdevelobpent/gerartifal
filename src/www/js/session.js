/**
 * Script para fazer modificações em caso de sessão estabelecida
 */
$(document).ready(() => {
  const valid = window.localStorage.getItem('validSession');
  if (!valid) {
    $('#dropdown').removeClass('d-none d-lg-block');
    $('#dropdown').addClass('d-md-block d-lg-none');

    /**
     * Adicione aki todos os elementos que só aparecerão apois login
     * */
  }
});

$('#button').on('click', () => {
  $.get('app/views/login.html', (data) => {
    $('#login').html(data);
  });
});

$('#close').on('click', () => {
  $('#login').html('');
});
