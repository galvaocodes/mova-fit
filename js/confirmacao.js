/* ==========================================
   MOVA FIT - CONFIRMAÇÃO DE FEEDBACK
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    // 1. Carregar nome do utilizador no cabeçalho
    const usuarioLogadoJSON = localStorage.getItem("usuarioCadastrado");
    let nomeUsuario = "Utilizador";
    
    if (usuarioLogadoJSON) {
        const usuario = JSON.parse(usuarioLogadoJSON);
        nomeUsuario = String(usuario.nome || usuario.login || "Utilizador").split(" ")[0];
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

/* =========================================================
   ACESSIBILIDADE - DESAFIO PLUS (PONTO EXTRA)
========================================================= */
document.addEventListener("DOMContentLoaded", () => {
    const containerAcess = document.querySelector(".acessibilidade-container");
    if (!containerAcess) return;

    const btnAcess = document.getElementById("btnAcess");
    const menuAcess = document.getElementById("menuAcess");
    const btnAumentar = document.getElementById("btnAumentar");
    const btnDiminuir = document.getElementById("btnDiminuir");
    const btnContraste = document.getElementById("btnContraste");
    const htmlObj = document.documentElement;

    // 1. Abrir e fechar a engrenagem
    btnAcess.addEventListener("click", () => {
        menuAcess.classList.toggle("ativo");
    });

    // Fechar ao clicar fora da engrenagem
    document.addEventListener("click", (e) => {
        if (!containerAcess.contains(e.target)) {
            menuAcess.classList.remove("ativo");
        }
    });

    // 2. Funções de aplicação e salvamento
    function aplicarContraste(ativo) {
        if (ativo) htmlObj.classList.add("alto-contraste");
        else htmlObj.classList.remove("alto-contraste");
        localStorage.setItem("mova_contraste", ativo);
    }

    function aplicarFonte(tamanho) {
        htmlObj.classList.remove("fonte-aumentada", "fonte-reduzida");
        if (tamanho === "aumentada") htmlObj.classList.add("fonte-aumentada");
        if (tamanho === "reduzida") htmlObj.classList.add("fonte-reduzida");
        localStorage.setItem("mova_fonte", tamanho || "normal");
    }

    // 3. Ações dos botões
    btnContraste.addEventListener("click", () => {
        const estadoAtual = htmlObj.classList.contains("alto-contraste");
        aplicarContraste(!estadoAtual);
    });

    btnAumentar.addEventListener("click", () => {
        const atual = localStorage.getItem("mova_fonte");
        aplicarFonte(atual !== "aumentada" ? "aumentada" : "normal");
    });

    btnDiminuir.addEventListener("click", () => {
        const atual = localStorage.getItem("mova_fonte");
        aplicarFonte(atual !== "reduzida" ? "reduzida" : "normal");
    });

    // 4. Inicializar estado salvo ao carregar a página
    if (localStorage.getItem("mova_contraste") === "true") {
        aplicarContraste(true);
    }
    const fonteSalva = localStorage.getItem("mova_fonte");
    if (fonteSalva) {
        aplicarFonte(fonteSalva);
    }
});