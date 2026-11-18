// Confirmação de feedback

document.addEventListener("DOMContentLoaded", () => {

    if (!localStorage.getItem("usuarioLogado")) {
        window.location.replace("404.html?erro=auth");
        return;
    }

    // Carregar nome do usuário no cabeçalho
    const usuarioLogadoJSON = localStorage.getItem("usuarioCadastrado");
    let nomeUsuario = "Usuário";

    if (usuarioLogadoJSON) {
        const usuario = JSON.parse(usuarioLogadoJSON);
        nomeUsuario = String(usuario.nome || usuario.login || "Usuário").split(" ")[0];
        const spanNome = document.getElementById("nomeUsuario");
        if(spanNome) spanNome.textContent = nomeUsuario;
    }

    const dadosSalvos = localStorage.getItem("feedbackMovaFit");

    if (dadosSalvos) {
        const feedback = JSON.parse(dadosSalvos);

        // Preencher Categoria e Tipo
        document.getElementById("categoria").textContent = feedback.categoria || "-";
        document.getElementById("tipo").textContent = feedback.tipo || "-";

        const qtdEstrelas = Number(feedback.avaliacao) || 0;
        document.getElementById("avaliacao").textContent = "★".repeat(qtdEstrelas) + "☆".repeat(5 - qtdEstrelas);

        document.getElementById("satisfacao").textContent = feedback.satisfacao ? feedback.satisfacao + "/10" : "-";

        document.getElementById("assunto").textContent = feedback.assunto || "-";
        document.getElementById("mensagem").textContent = feedback.mensagem || "Sem mensagem.";

        document.getElementById("retorno").textContent = feedback.retorno === true ? "Sim" : "Não";

        document.getElementById("enviadoPor").textContent = nomeUsuario;
        document.getElementById("data").textContent = feedback.data || new Date().toLocaleString("pt-BR");
    }

});
