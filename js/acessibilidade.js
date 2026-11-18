// Acessibilidade
document.addEventListener("DOMContentLoaded", () => {
    const containerAcess = document.querySelector(".acessibilidade-container");
    if (!containerAcess) return;

    const btnAcess = document.getElementById("btnAcess");
    const menuAcess = document.getElementById("menuAcess");
    const btnAumentar = document.getElementById("btnAumentar");
    const btnDiminuir = document.getElementById("btnDiminuir");
    const btnContraste = document.getElementById("btnContraste");
    const htmlObj = document.documentElement;

    // Abrir e fechar a engrenagem
    btnAcess.addEventListener("click", () => {
        menuAcess.classList.toggle("ativo");
    });

    // Fechar ao clicar fora da engrenagem
    document.addEventListener("click", (e) => {
        if (!containerAcess.contains(e.target)) {
            menuAcess.classList.remove("ativo");
        }
    });

    function aplicarContraste(ativo) {
        if (ativo) htmlObj.classList.add("tema-claro");
        else htmlObj.classList.remove("tema-claro");
        localStorage.setItem("mova_contraste", ativo);
    }

    function aplicarFonte(tamanho) {
        htmlObj.classList.remove("fonte-aumentada", "fonte-reduzida");
        if (tamanho === "aumentada") htmlObj.classList.add("fonte-aumentada");
        if (tamanho === "reduzida") htmlObj.classList.add("fonte-reduzida");
        localStorage.setItem("mova_fonte", tamanho || "normal");
    }

    // Ações dos botões
    btnContraste.addEventListener("click", () => {
        const estadoAtual = htmlObj.classList.contains("tema-claro");
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

    if (localStorage.getItem("mova_contraste") === "true") {
        aplicarContraste(true);
    }
    const fonteSalva = localStorage.getItem("mova_fonte");
    if (fonteSalva) {
        aplicarFonte(fonteSalva);
    }
});
