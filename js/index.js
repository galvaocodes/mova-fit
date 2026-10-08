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