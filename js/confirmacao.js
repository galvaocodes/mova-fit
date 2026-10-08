/* ==========================================
   1. RECEBER AS INFORMAÇÕES DO FEEDBACK
========================================== */

const dadosSalvos =
    localStorage.getItem("feedbackMovaFit");


if (dadosSalvos) {

    const feedback =
        JSON.parse(dadosSalvos);


    /* CATEGORIA */

    document.getElementById("categoria")
        .textContent =
        feedback.categoria || "-";


    /* ==========================================
   MOVA FIT - CONFIRMAÇÃO DE FEEDBACK
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    // 1. Carregar nome do utilizador no cabeçalho
    const usuarioLogadoJSON = localStorage.getItem("usuarioCadastrado");
    let nomeUsuario = "Usuário";
    
    if (usuarioLogadoJSON) {
        const usuario = JSON.parse(usuarioLogadoJSON);
        nomeUsuario = String(usuario.nome || usuario.login || "Usuário").split(" ")[0];
        const spanNome = document.getElementById("nomeUsuario");
        if(spanNome) spanNome.textContent = nomeUsuario;
    }

    // 2. Resgatar os dados de feedback gravados no localStorage
    const dadosSalvos = localStorage.getItem("feedbackMovaFit");

    if (dadosSalvos) {
        const feedback = JSON.parse(dadosSalvos);

        // Preencher Categoria e Tipo
        document.getElementById("categoria").textContent = feedback.categoria || "-";
        document.getElementById("tipo").textContent = feedback.tipo || "-";

        // Estrelas (Converte o número numa String visual de estrelas)
        const qtdEstrelas = Number(feedback.avaliacao) || 0;
        document.getElementById("avaliacao").textContent = "★".repeat(qtdEstrelas) + "☆".repeat(5 - qtdEstrelas);

        // Satisfação
        document.getElementById("satisfacao").textContent = feedback.satisfacao ? feedback.satisfacao + "/10" : "-";

        // Textos
        document.getElementById("assunto").textContent = feedback.assunto || "-";
        document.getElementById("mensagem").textContent = feedback.mensagem || "Sem mensagem.";

        // Traduzir o Retorno Booleano (true/false) para Sim/Não
        document.getElementById("retorno").textContent = feedback.retorno === true ? "Sim" : "Não";

        // Extras
        document.getElementById("enviadoPor").textContent = nomeUsuario;
        document.getElementById("data").textContent = feedback.data || new Date().toLocaleString("pt-BR");
    }

});