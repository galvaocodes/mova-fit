document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('.section-content');
    const steps = document.querySelectorAll('.progress-bar .step');
    const planButtons = document.querySelectorAll('.btn-choose-plan');
    const registrationForm = document.getElementById('registration-form');
    const continueCadastroBtn = document.querySelector('.btn-continue-cadastro');
    const alterarPlanoBtns = document.querySelectorAll('.btn-alterar-plano');
    const paymentTabs = document.querySelectorAll('.tab-button');
    const paymentTabContents = document.querySelectorAll('.tab-content');
    const finalizePurchaseBtns = document.querySelectorAll('.btn-finalize-purchase');
    const togglePasswordIcons = document.querySelectorAll('.toggle-password');
    const copyPixButton = document.querySelector('.btn-copy-pix');

    let currentStep = 1;
    let selectedPlan = {
        name: '',
        price: 0
    };

    // --- Theme and Font Size Toggles ---
const themeToggle = document.getElementById('theme-toggle');
const themeOptions = themeToggle.querySelectorAll('.theme-toggle-option');

function applyTheme(theme) {
    if (theme === 'light') {
        document.body.classList.remove('dark-theme');
        themeToggle.classList.add('claro');
    } else {
        document.body.classList.add('dark-theme');
        themeToggle.classList.remove('claro');
    }
    themeOptions.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.theme === theme);
    });
    localStorage.setItem('theme', theme);
}

themeOptions.forEach(btn => {
    btn.addEventListener('click', () => applyTheme(btn.dataset.theme));
});

const zoomDecreaseBtn = document.getElementById('zoom-decrease');
const zoomIncreaseBtn = document.getElementById('zoom-increase');
const zoomValueEl = document.getElementById('zoom-value');

let zoomLevel = 100;
const ZOOM_MIN = 80;
const ZOOM_MAX = 120;
const ZOOM_STEP = 10;

function applyZoom(level) {
    zoomLevel = Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, level));
    document.body.style.fontSize = `${zoomLevel}%`;
    zoomValueEl.textContent = `${zoomLevel}%`;
    localStorage.setItem('zoomLevel', zoomLevel);
}

zoomIncreaseBtn.addEventListener('click', () => applyZoom(zoomLevel + ZOOM_STEP));
zoomDecreaseBtn.addEventListener('click', () => applyZoom(zoomLevel - ZOOM_STEP));

const savedTheme = localStorage.getItem('theme') || 'dark';
applyTheme(savedTheme);

const savedZoom = parseInt(localStorage.getItem('zoomLevel'), 10);
applyZoom(isNaN(savedZoom) ? 100 : savedZoom);

    // --- Navigation Functions ---
    function showSection(stepNumber) {
        sections.forEach(section => section.classList.remove('active'));
        steps.forEach(step => step.classList.remove('active'));

        document.getElementById(`section-${getSectionId(stepNumber)}`).classList.add('active');
        for (let i = 0; i < stepNumber; i++) {
            steps[i].classList.add('active');
        }
        currentStep = stepNumber;
        updateSummary();
    }

    function getSectionId(stepNumber) {
        switch (stepNumber) {
            case 1: return 'planos';
            case 2: return 'cadastro';
            case 3: return 'pagamento';
            default: return 'planos';
        }
    }

    function updateSummary() {
        const planNameElements = document.querySelectorAll('[id^="summary-plan-name"]');
        const monthlyPriceElements = document.querySelectorAll('[id^="summary-monthly-price"]');
        const discountElements = document.querySelectorAll('[id^="summary-discount"]');
        const enrollmentFeeElements = document.querySelectorAll('[id^="summary-enrollment-fee"]');
        const totalTodayElements = document.querySelectorAll('[id^="summary-total-today"]');

        planNameElements.forEach(el => el.textContent = selectedPlan.name || 'Nenhum plano selecionado');
        monthlyPriceElements.forEach(el => el.textContent = `R$ ${selectedPlan.price.toFixed(2).replace('.', ',')}`);
        discountElements.forEach(el => el.textContent = 'R$ 0,00'); // Fixed as per request
        enrollmentFeeElements.forEach(el => el.textContent = 'R$ 0,00'); // Fixed as per request
        totalTodayElements.forEach(el => el.textContent = `R$ ${selectedPlan.price.toFixed(2).replace('.', ',')}`);
    }

    // --- Event Listeners ---

    // Plan Selection
    planButtons.forEach(button => {
        button.addEventListener('click', () => {
            selectedPlan.name = button.dataset.planName;
            selectedPlan.price = parseFloat(button.dataset.planPrice);
            showSection(2); // Go to Cadastro section
        });
    });

    // Registration Form Submission
    registrationForm.addEventListener('submit', (e) => {
        e.preventDefault();
        // Basic validation (user said "pode colocar qualquer coisa", so just check if form is valid)
        if (registrationForm.checkValidity()) {
            showSection(3); // Go to Pagamento section
        } else {
            alert('Por favor, preencha todos os campos obrigatórios e aceite os termos.');
        }
    });

    // "Alterar plano" buttons
    alterarPlanoBtns.forEach(button => {
        button.addEventListener('click', () => {
            showSection(1); // Go back to Planos section
        });
    });

    // Payment Tabs
    paymentTabs.forEach(button => {
        button.addEventListener('click', () => {
            paymentTabs.forEach(btn => btn.classList.remove('active'));
            paymentTabContents.forEach(content => content.classList.remove('active'));

            button.classList.add('active');
            document.getElementById(`tab-${button.dataset.tab}`).classList.add('active');
        });
    });

    // Finalize Purchase Buttons
    finalizePurchaseBtns.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            // Simulate purchase success
            alert('Compra finalizada com sucesso! Redirecionando para o Dashboard.');
            window.location.href = 'dashboard.html'; // Redirect to dashboard
        });
    });

    // Toggle Password Visibility
    togglePasswordIcons.forEach(icon => {
        icon.addEventListener('click', () => {
            const targetId = icon.dataset.target;
            const passwordInput = document.getElementById(targetId);
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                passwordInput.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    });

    // Copy Pix Code
    if (copyPixButton) {
        copyPixButton.addEventListener('click', () => {
            const pixCodeInput = document.querySelector('.pix-copy-paste');
            pixCodeInput.select();
            pixCodeInput.setSelectionRange(0, 99999); // For mobile devices
            document.execCommand('copy');
            alert('Código Pix copiado para a área de transferência!');
        });
    }

    // Initial setup
    showSection(1); // Start at the Planos section
});