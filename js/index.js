document.addEventListener("DOMContentLoaded", () => {

    // Fundo do cabeçalho ao rolar
    const header = document.getElementById('header');

    function atualizarCabecalho() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
    window.addEventListener('scroll', atualizarCabecalho);
    atualizarCabecalho();

    const heroVideo = document.getElementById('heroVideo');
    if (heroVideo) {
        heroVideo.muted = true;
        const tocar = () => heroVideo.play().catch(() => {});
        tocar();
        ['touchstart', 'click', 'scroll'].forEach(evento =>
            window.addEventListener(evento, tocar, { once: true, passive: true })
        );
    }

    const btnMenu = document.getElementById('btnMenu');
    const navMenu = document.getElementById('navMenu');

    function fecharMenu() {
        navMenu.classList.remove('aberto');
        btnMenu.setAttribute('aria-expanded', 'false');
        btnMenu.setAttribute('aria-label', 'Abrir menu');
        btnMenu.querySelector('i').className = 'fa-solid fa-bars';
    }

    btnMenu.addEventListener('click', () => {
        const abriu = navMenu.classList.toggle('aberto');
        btnMenu.setAttribute('aria-expanded', abriu);
        btnMenu.setAttribute('aria-label', abriu ? 'Fechar menu' : 'Abrir menu');
        btnMenu.querySelector('i').className = abriu ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
    });

    navMenu.querySelectorAll('a').forEach(link => link.addEventListener('click', fecharMenu));
    document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && !btnMenu.contains(e.target)) fecharMenu();
    });

    // Scroll suave para os links do menu

    const anchorLinks = document.querySelectorAll('a[href^="#"]');

    anchorLinks.forEach(anchor => {
        anchor.addEventListener('click', function (e) {

            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {

                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

});
