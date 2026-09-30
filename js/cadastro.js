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
        discountElements.forEach(el => el.textContent = 'R$ 0,00');
        enrollmentFeeElements.forEach(el => el.textContent = 'R$ 0,00');
        totalTodayElements.forEach(el => el.textContent = `R$ ${selectedPlan.price.toFixed(2).replace('.', ',')}`);
    }

    // --- Sistema de Notificações (Substitui window.alert) ---
    function showToast(message, type = 'error') {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.classList.add('toast');
        if (type === 'success') toast.classList.add('success');
        toast.innerText = message;
        
        container.appendChild(toast);
        
        // Remove o toast após 4 segundos
        setTimeout(() => {
            toast.remove();
        }, 4000);
    }

    // --- Máscaras de Input ---
    function formatCPF(e) {
        let v = e.target.value.replace(/\D/g,"");
        v = v.replace(/(\d{3})(\d)/,"$1.$2");
        v = v.replace(/(\d{3})(\d)/,"$1.$2");
        v = v.replace(/(\d{3})(\d{1,2})$/,"$1-$2");
        e.target.value = v;
    }
    const inputCpf = document.getElementById('cpf');
    if (inputCpf) inputCpf.addEventListener('input', formatCPF);

    function formatCEP(e) {
        let v = e.target.value.replace(/\D/g,"");
        v = v.replace(/^(\d{5})(\d)/,"$1-$2");
        e.target.value = v;
    }
    const inputCep = document.getElementById('cep');
    if (inputCep) inputCep.addEventListener('input', formatCEP);

    function formatPhone(e) {
        let val = e.target.value.replace(/\D/g, '');
        if (!val.startsWith('55') && val.length > 0) val = '55' + val;
        val = val.substring(0, 12); 
        
        let res = '';
        if (val.length > 0) res += '(+' + val.substring(0, 2) + ')';
        if (val.length > 2) res += val.substring(2, 4);
        if (val.length > 4) res += '-' + val.substring(4, 12);
        e.target.value = res;
    }
    const inputFixo = document.getElementById('phone-fixo');
    const inputCelular = document.getElementById('phone');
    if (inputFixo) inputFixo.addEventListener('input', formatPhone);
    if (inputCelular) inputCelular.addEventListener('input', formatPhone);

    // --- Integração API ViaCEP ---
    if (inputCep) {
        inputCep.addEventListener('blur', async (e) => {
            const cep = e.target.value.replace(/\D/g, '');
            if (cep.length === 8) {
                try {
                    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
                    const data = await response.json();
                    if (!data.erro) {
                        document.getElementById('rua').value = data.logradouro;
                        document.getElementById('bairro').value = data.bairro;
                        document.getElementById('cidade').value = data.localidade;
                        document.getElementById('uf').value = data.uf;
                    } else {
                        showToast("CEP não encontrado.");
                    }
                } catch (err) {
                    showToast("Erro ao buscar o CEP.");
                }
            }
        });
    }

    // --- Função de Validação do Algoritmo do CPF ---
    function validarCPFAlgoritmo(cpf) {
        cpf = cpf.replace(/[^\d]+/g, '');
        if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;
        let soma = 0, resto;
        for (let i = 1; i <= 9; i++) soma += parseInt(cpf.substring(i-1, i)) * (11 - i);
        resto = (soma * 10) % 11;
        if ((resto === 10) || (resto === 11)) resto = 0;
        if (resto !== parseInt(cpf.substring(9, 10))) return false;
        soma = 0;
        for (let i = 1; i <= 10; i++) soma += parseInt(cpf.substring(i-1, i)) * (12 - i);
        resto = (soma * 10) % 11;
        if ((resto === 10) || (resto === 11)) resto = 0;
        if (resto !== parseInt(cpf.substring(10, 11))) return false;
        return true;
    }

    // --- Event Listeners ---

    // Plan Selection
    planButtons.forEach(button => {
        button.addEventListener('click', () => {
            selectedPlan.name = button.dataset.planName;
            selectedPlan.price = parseFloat(button.dataset.planPrice);
            showSection(2); 
        });
    });

    // Registration Form Submission (NOVO)
    if (registrationForm) {
        registrationForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const nome = document.getElementById('full-name').value;
            const cpf = document.getElementById('cpf').value;
            const login = document.getElementById('login').value;
            const senha = document.getElementById('password').value;
            const confirmSenha = document.getElementById('confirm-password').value;

            // Validação Nome: 15 a 80 caracteres (apenas letras e espaços)
            if (!/^[A-Za-zÀ-ÿ\s]{15,80}$/.test(nome)) {
                return showToast("O nome deve ter entre 15 e 80 letras.");
            }

            // Validação CPF
            if (!validarCPFAlgoritmo(cpf)) {
                return showToast("CPF inválido. Verifique os dígitos.");
            }

            // Validação Login: Exatamente 6 caracteres alfabéticos
            if (!/^[A-Za-z]{6}$/.test(login)) {
                return showToast("O login deve ter exatamente 6 letras.");
            }

            // Validação Senha: Exatamente 8 caracteres alfabéticos
            if (!/^[A-Za-z]{8}$/.test(senha)) {
                return showToast("A senha deve ter exatamente 8 letras.");
            }

            // Confirmação de Senha
            if (senha !== confirmSenha) {
                return showToast("As senhas não coincidem.");
            }

            // Se tudo estiver correto, constrói e salva o JSON no localStorage
            const usuario = {
                nome: nome,
                cpf: cpf,
                email: document.getElementById('email').value,
                dataNascimento: document.getElementById('dob').value,
                cep: document.getElementById('cep').value,
                endereco: `${document.getElementById('rua').value}, ${document.getElementById('bairro').value} - ${document.getElementById('cidade').value}/${document.getElementById('uf').value}`,
                telefoneFixo: document.getElementById('phone-fixo').value,
                telefoneCelular: document.getElementById('phone').value,
                login: login,
                senha: senha,
                planoEscolhido: selectedPlan.name
            };

            localStorage.setItem('usuarioMovaFit', JSON.stringify(usuario));
            
            showToast("Cadastro realizado com sucesso!", "success");
            
            setTimeout(() => {
                showSection(3);
            }, 1500);
        });
    }

    // "Alterar plano" buttons
    alterarPlanoBtns.forEach(button => {
        button.addEventListener('click', () => {
            showSection(1); 
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

    // Finalize Purchase Buttons (Modificado para usar Toast)
    finalizePurchaseBtns.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            showToast('Compra finalizada com sucesso!', 'success');
            setTimeout(() => {
                window.location.href = 'dashboard.html'; 
            }, 1500);
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
            pixCodeInput.setSelectionRange(0, 99999); 
            document.execCommand('copy');
            showToast('Código Pix copiado com sucesso!', 'success'); // Modificado para usar Toast
        });
    }

    // Initial setup
    showSection(1); 
});