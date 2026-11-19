// Validação e login

document.addEventListener("DOMContentLoaded", function () {
    const formLogin = document.getElementById("formLogin");
    const feedbackMensagem = document.getElementById("feedbackMensagem");

    const planoUrl = new URLSearchParams(window.location.search).get("plano");
    const planoEscolhido = (planoUrl === "basic" || planoUrl === "plus") ? planoUrl : "";

    if (planoEscolhido) {
        document.getElementById("linkCadastro").href = "cadastro.html?plano=" + planoEscolhido;
    }

    formLogin.addEventListener("submit", function (e) {
        e.preventDefault();

        const loginDigitado = document.getElementById("loginUsuario").value.trim();
        const senhaDigitada = document.getElementById("senhaUsuario").value;

        const usuario = JSON.parse(localStorage.getItem("usuarioCadastrado"));

        // Sem cadastro com esse login: vai para a página de acesso restrito (401)
        if (!usuario || loginDigitado.toLowerCase() !== usuario.login.toLowerCase()) {
            window.location.href = "404.html?erro=auth";
            return;
        }

        // Login certo: confere a senha
        if (senhaDigitada === usuario.senha) {

            localStorage.setItem("usuarioLogado", JSON.stringify(usuario));

            feedbackMensagem.className = "feedback-mensagem sucesso";
            feedbackMensagem.textContent = "Login realizado com sucesso! Redirecionando...";

            setTimeout(() => {
                window.location.href = planoEscolhido ? "dashboard.html?plano=" + planoEscolhido : "dashboard.html";
            }, 1200);

        } else {
            feedbackMensagem.className = "feedback-mensagem erro";
            feedbackMensagem.textContent = "Senha incorreta. Verifique e tente de novo.";
        }
    });
});
