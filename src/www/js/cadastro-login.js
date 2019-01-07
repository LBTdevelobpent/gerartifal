

var botaoAdicionar = document.querySelector("#cadastrar");
var form = document.querySelector("#form");
var inputSenha = document.querySelector("#password")
//quando o usuário clicar no botao de criar conta
botaoAdicionar.addEventListener("click", function() {
  //parar o comportamento padrão do input
  event.preventDefault();
  var form = document.querySelector("#form-cadastro");

  var nome = form.nome.value;
  var senha = form.senha.value;
  var email = form.email.value;

  if(senha.length < 8){
    document.getElementById("senha-invalida").innerHTML = "senha invalida, a senha deve conter no mínimo 8 dígitos";
    inputSenha.addEventListener("click", function() {
      document.getElementById("senha-invalida").innerHTML = "";
    });
  }



});
