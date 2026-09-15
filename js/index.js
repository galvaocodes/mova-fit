// index.js

// Header muda de fundo ao rolar
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 20);
});

// Painel de configurações (tema + zoom)
const settingsBtn = document.getElementById('settingsBtn');
const settingsPanel = document.getElementById('settingsPanel');

settingsBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  settingsPanel.classList.toggle('active');
});

document.addEventListener('click', (e) => {
  if (!settingsPanel.contains(e.target) && e.target !== settingsBtn) {
    settingsPanel.classList.remove('active');
  }
});

// Toggle de tema claro/escuro
const themeButtons = document.querySelectorAll('.theme-btn');
themeButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    themeButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const theme = btn.dataset.theme;
    document.body.classList.toggle('light', theme === 'light');
    localStorage.setItem('movafit-theme', theme);
  });
});

// Carrega tema salvo
const savedTheme = localStorage.getItem('movafit-theme');
if (savedTheme === 'light') {
  document.body.classList.add('light');
  themeButtons.forEach(b => b.classList.toggle('active', b.dataset.theme === 'light'));
}

// Controle de zoom
let currentZoom = 100;
const zoomValue = document.getElementById('zoomValue');
document.getElementById('zoomIn').addEventListener('click', () => {
  if (currentZoom < 150) {
    currentZoom += 10;
    applyZoom();
  }
});
document.getElementById('zoomOut').addEventListener('click', () => {
  if (currentZoom > 70) {
    currentZoom -= 10;
    applyZoom();
  }
});
function applyZoom() {
  document.body.style.zoom = currentZoom + '%';
  zoomValue.textContent = currentZoom + '%';
}

// Modal de suporte
const suporteBtn = document.getElementById('suporteBtn');
const suporteModal = document.getElementById('suporteModal');
const closeSuporte = document.getElementById('closeSuporte');

suporteBtn.addEventListener('click', () => suporteModal.classList.add('active'));
closeSuporte.addEventListener('click', () => suporteModal.classList.remove('active'));
suporteModal.addEventListener('click', (e) => {
  if (e.target === suporteModal) suporteModal.classList.remove('active');
});

// Menu mobile
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.querySelector('.nav-links');
menuToggle?.addEventListener('click', () => {
  navLinks.classList.toggle('mobile-open');
});
