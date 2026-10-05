/* =========================================================
   MOVA FIT - VALIDAÇÃO E LOGIN
   js/login.js
========================================================= */

document.addEventListener("DOMContentLoaded", function () {
    const formLogin = document.getElementById("formLogin");
    const feedbackMensagem = document.getElementById("feedbackMensagem");

    formLogin.addEventListener("submit", function (e) {
        e.preventDefault();

        const loginDigitado = document.getElementById("loginUsuario").value.trim();
        const senhaDigitada = document.getElementById("senhaUsuario").value;

        // Recupera os dados salvos no localStorage pelo cadastro
        const usuarioSalvoJSON = localStorage.getItem("usuarioCadastrado");

        if (!usuarioSalvoJSON) {
            feedbackMensagem.className = "feedback-mensagem erro";
            feedbackMensagem.textContent = "Nenhum usuário cadastrado encontrado. Faça o cadastro primeiro.";
            return;
        }

        const usuario = JSON.parse(usuarioSalvoJSON);

        // Validação das credenciais
        if (loginDigitado === usuario.login && senhaDigitada === usuario.senha) {
            
            // Salva a sessão ativa para o dashboard reconhecer
            localStorage.setItem("usuarioLogado", JSON.stringify(usuario));

            feedbackMensagem.className = "feedback-mensagem sucesso";
            feedbackMensagem.textContent = "Login realizado com sucesso! Redirecionando...";

            setTimeout(() => {
                window.location.href = "dashboard.html";
            }, 1200);

        } else {
            feedbackMensagem.className = "feedback-mensagem erro";
            feedbackMensagem.textContent = "Login ou senha incorretos. Verifique os dados informados.";
        }
    });
});