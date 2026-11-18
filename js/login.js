// Validação e login

document.addEventListener("DOMContentLoaded", function () {
    const formLogin = document.getElementById("formLogin");
    const feedbackMensagem = document.getElementById("feedbackMensagem");

    const planoUrl = new URLSearchParams(window.location.search).get("plano");
    const planoEscolhido = (planoUrl === "basic" || planoUrl === "plus") ? planoUrl : "";

    const linkCadastro = document.getElementById("linkCadastro");
    if (linkCadastro && planoEscolhido) linkCadastro.href = "cadastro.html?plano=" + planoEscolhido;

    formLogin.addEventListener("submit", function (e) {
        e.preventDefault();

        const loginDigitado = document.getElementById("loginUsuario").value.trim();
        const senhaDigitada = document.getElementById("senhaUsuario").value;

        const usuarioSalvoJSON = localStorage.getItem("usuarioCadastrado");

        if (!usuarioSalvoJSON) {
            feedbackMensagem.className = "feedback-mensagem erro";
            feedbackMensagem.textContent = "Nenhum cadastro encontrado neste aparelho. O cadastro fica salvo só no navegador onde foi feito: faça o cadastro aqui primeiro.";
            return;
        }

        const usuario = JSON.parse(usuarioSalvoJSON);

        // Validação das credenciais
        if (loginDigitado.toLowerCase() === String(usuario.login).toLowerCase() && senhaDigitada === usuario.senha) {

            localStorage.setItem("usuarioLogado", JSON.stringify(usuario));

            feedbackMensagem.className = "feedback-mensagem sucesso";
            feedbackMensagem.textContent = "Login realizado com sucesso! Redirecionando...";

            setTimeout(() => {
                window.location.href = planoEscolhido ? "dashboard.html?plano=" + planoEscolhido : "dashboard.html";
            }, 1200);

        } else {
            feedbackMensagem.className = "feedback-mensagem erro";
            feedbackMensagem.textContent = "Login ou senha incorretos. Verifique os dados informados.";
        }
    });
});
