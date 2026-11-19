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
            "Esta área é exclusiva para alunos cadastrados. Se você já tem cadastro, entre com seu login e senha. Se ainda não tem, faça o seu cadastro primeiro.";
        botao.href = "login.html";
        textoBotao.textContent = "Já tenho cadastro";
        iconeBotao.className = "fa-solid fa-right-to-bracket";
        document.getElementById("botaoCadastro").hidden = false;
    } else if (localStorage.getItem("usuarioLogado")) {
        botao.href = "dashboard.html";
        textoBotao.textContent = "Voltar ao Dashboard";
    }
});
