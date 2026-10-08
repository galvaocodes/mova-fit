/* =========================================================
   MOVA FIT - COMPORTAMENTOS (UX)
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    
    // 1. FUNDO DO CABEÇALHO AO ROLAR
    const header = document.getElementById('header');
    
    window.addEventListener('scroll', () => {
        // Se a página for rolada mais de 50px para baixo, adiciona a classe
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 2. SCROLL SUAVE PARA OS LINKS DO MENU
    // Pega todos os links que começam com "#"
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            // Evita o salto brusco padrão do HTML
            e.preventDefault();
            
            // Procura o elemento pelo ID 
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                // Desliza a tela até a seção correspondente
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

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