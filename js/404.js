document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const botao = document.getElementById("botaoErro");
    const textoBotao = botao.querySelector("span");
    const iconeBotao = botao.querySelector("i");

    if (params.get("erro") === "auth") {
        document.title = "MOVA FIT | Acesso restrito";
        document.getElementById("numeroErro").textContent = "401";
        document.getElementById("tituloErro").innerHTML = "<span>Acesso restrito!</span> Faça login para continuar";
        document.getElementById("textoErro").textContent =
            "Esta área é exclusiva para alunos. Entre com seu login e senha para acessar o seu painel.";
        botao.href = "login.html";
        textoBotao.textContent = "Ir para o login";
        iconeBotao.className = "fa-solid fa-right-to-bracket";
    } else if (localStorage.getItem("usuarioLogado")) {
        botao.href = "dashboard.html";
        textoBotao.textContent = "Voltar ao Dashboard";
    }
});
