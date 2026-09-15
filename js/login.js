// =========================================
// MOVA FIT — LOGIN
// Interações da página de login
// =========================================


// -----------------------------------------
// ELEMENTOS DA PÁGINA
// -----------------------------------------

// Configurações de exibição
const botaoConfiguracoes = document.getElementById("botao-configuracoes");
const menuConfiguracoes = document.getElementById("menu-configuracoes");

const botaoTemaClaro = document.getElementById("tema-claro");
const botaoTemaEscuro = document.getElementById("tema-escuro");

const botaoDiminuirTexto = document.getElementById("diminuir-texto");
const botaoAumentarTexto = document.getElementById("aumentar-texto");
const porcentagemTexto = document.getElementById("porcentagem-texto");

// Login
const formLogin = document.getElementById("form-login");
const campoEmail = document.getElementById("email");
const campoSenha = document.getElementById("senha");
const botaoMostrarSenha = document.getElementById("botao-mostrar-senha");
const mensagemFormulario = document.getElementById("mensagem-formulario");
const botaoGoogle = document.getElementById("botao-google");

// Recuperação de senha
const linkEsqueciSenha = document.getElementById("link-esqueci-senha");
const modalRecuperarSenha = document.getElementById("modal-recuperar-senha");
const botaoFecharModal = document.getElementById("botao-fechar-modal");
const formRecuperarSenha = document.getElementById("form-recuperar-senha");
const campoEmailRecuperacao = document.getElementById("email-recuperacao");
const mensagemRecuperacao = document.getElementById("mensagem-recuperacao");


// -----------------------------------------
// CONFIGURAÇÕES: ENGENHARIA, TEMA E TEXTO
// -----------------------------------------

const TAMANHO_MINIMO = 80;
const TAMANHO_MAXIMO = 130;
const PASSO_TAMANHO = 10;

let tamanhoTexto = Number(localStorage.getItem("tamanhoTexto")) || 100;


// Abre e fecha o menu da engrenagem
botaoConfiguracoes.addEventListener("click", function () {
  menuConfiguracoes.classList.toggle("aberto");
});


// Fecha o menu quando a pessoa clica fora dele
document.addEventListener("click", function (evento) {
  const clicouNoMenu = menuConfiguracoes.contains(evento.target);
  const clicouNaEngrenagem = botaoConfiguracoes.contains(evento.target);

  if (!clicouNoMenu && !clicouNaEngrenagem) {
    menuConfiguracoes.classList.remove("aberto");
  }
});


// Aplica e salva o tema escolhido
function aplicarTema(tema) {
  document.body.classList.remove("tema-claro", "tema-escuro");
  document.body.classList.add(`tema-${tema}`);

  localStorage.setItem("tema", tema);
}


// Tema claro
botaoTemaClaro.addEventListener("click", function () {
  aplicarTema("claro");
});


// Tema escuro
botaoTemaEscuro.addEventListener("click", function () {
  aplicarTema("escuro");
});


// Aplica e salva o tamanho de texto escolhido
function aplicarTamanhoTexto() {
  document.documentElement.style.setProperty(
    "--tamanho-texto",
    `${tamanhoTexto}%`
  );

  porcentagemTexto.textContent = `${tamanhoTexto}%`;

  localStorage.setItem("tamanhoTexto", tamanhoTexto);
}


// Diminui o texto
botaoDiminuirTexto.addEventListener("click", function () {
  if (tamanhoTexto > TAMANHO_MINIMO) {
    tamanhoTexto -= PASSO_TAMANHO;
    aplicarTamanhoTexto();
  }
});


// Aumenta o texto
botaoAumentarTexto.addEventListener("click", function () {
  if (tamanhoTexto < TAMANHO_MAXIMO) {
    tamanhoTexto += PASSO_TAMANHO;
    aplicarTamanhoTexto();
  }
});


// -----------------------------------------
// SENHA: MOSTRAR E OCULTAR
// -----------------------------------------

botaoMostrarSenha.addEventListener("click", function () {
  const senhaEstaVisivel = campoSenha.type === "text";

  if (senhaEstaVisivel) {
    campoSenha.type = "password";
    botaoMostrarSenha.textContent = "👁";
    botaoMostrarSenha.setAttribute("aria-label", "Mostrar senha");
  } else {
    campoSenha.type = "text";
    botaoMostrarSenha.textContent = "🙈";
    botaoMostrarSenha.setAttribute("aria-label", "Ocultar senha");
  }
});

// -----------------------------------------
// LOGIN COM GOOGLE — AGUARDANDO INTEGRAÇÃO
// -----------------------------------------

botaoGoogle.addEventListener("click", function () {
  mensagemFormulario.className = "mensagem-formulario";
  mensagemFormulario.textContent =
    "O login com Google estará disponível em breve.";
  mensagemFormulario.classList.add("sucesso");
});


// -----------------------------------------
// MODAL: RECUPERAR SENHA
// -----------------------------------------

function abrirModalRecuperacao() {
  modalRecuperarSenha.classList.add("aberto");
  modalRecuperarSenha.setAttribute("aria-hidden", "false");

  campoEmailRecuperacao.focus();
}


function fecharModalRecuperacao() {
  modalRecuperarSenha.classList.remove("aberto");
  modalRecuperarSenha.setAttribute("aria-hidden", "true");

  mensagemRecuperacao.textContent = "";
  formRecuperarSenha.reset();

  linkEsqueciSenha.focus();
}


// Abre o modal ao clicar no link
linkEsqueciSenha.addEventListener("click", function (evento) {
  evento.preventDefault();
  abrirModalRecuperacao();
});


// Fecha pelo botão ×
botaoFecharModal.addEventListener("click", fecharModalRecuperacao);


// Fecha ao clicar no fundo escuro do modal
modalRecuperarSenha.addEventListener("click", function (evento) {
  if (evento.target === modalRecuperarSenha) {
    fecharModalRecuperacao();
  }
});


// Fecha ao pressionar Esc
document.addEventListener("keydown", function (evento) {
  if (evento.key === "Escape" &&
      modalRecuperarSenha.classList.contains("aberto")) {
    fecharModalRecuperacao();
  }
});


// -----------------------------------------
// VALIDAÇÃO DO LOGIN — SEM BANCO DE DADOS
// -----------------------------------------

formLogin.addEventListener("submit", function (evento) {
  evento.preventDefault();

  const email = campoEmail.value.trim();
  const senha = campoSenha.value;

  mensagemFormulario.className = "mensagem-formulario";

  if (!email || !senha) {
    mensagemFormulario.textContent =
      "Preencha seu e-mail e sua senha para continuar.";
    mensagemFormulario.classList.add("erro");
    return;
  }

  if (!campoEmail.validity.valid) {
    mensagemFormulario.textContent =
      "Digite um endereço de e-mail válido.";
    mensagemFormulario.classList.add("erro");
    campoEmail.focus();
    return;
  }

  if (senha.length < 6) {
    mensagemFormulario.textContent =
      "A senha deve ter pelo menos 6 caracteres.";
    mensagemFormulario.classList.add("erro");
    campoSenha.focus();
    return;
  }

  mensagemFormulario.textContent =
    "Dados preenchidos corretamente. O login será conectado ao sistema em breve.";
  mensagemFormulario.classList.add("sucesso");
});


// -----------------------------------------
// FORMULÁRIO: RECUPERAÇÃO DE SENHA
// -----------------------------------------

formRecuperarSenha.addEventListener("submit", function (evento) {
  evento.preventDefault();

  const emailRecuperacao = campoEmailRecuperacao.value.trim();

  mensagemRecuperacao.className = "mensagem-recuperacao";

  if (!emailRecuperacao || !campoEmailRecuperacao.validity.valid) {
    mensagemRecuperacao.textContent =
      "Digite um endereço de e-mail válido.";
    mensagemRecuperacao.classList.add("erro");
    campoEmailRecuperacao.focus();
    return;
  }

  mensagemRecuperacao.textContent =
    "Instruções de recuperação seriam enviadas para este e-mail.";
  mensagemRecuperacao.classList.add("sucesso");

  formRecuperarSenha.reset();
});


// -----------------------------------------
// CARREGA AS PREFERÊNCIAS SALVAS
// -----------------------------------------

const temaSalvo = localStorage.getItem("tema") || "escuro";

aplicarTema(temaSalvo);
aplicarTamanhoTexto();