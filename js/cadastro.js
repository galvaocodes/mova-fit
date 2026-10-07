/* =========================================================
   MOVA FIT - VALIDAÇÕES E CADASTRO
   js/cadastro.js
========================================================= */

document.addEventListener("DOMContentLoaded", function () {
    const formCadastro = document.getElementById("formCadastro");
    const feedbackMensagem = document.getElementById("feedbackMensagem");

    // Máscara e validação de CPF
    const inputCpf = document.getElementById("cpf");
    inputCpf.addEventListener("input", function (e) {
        let v = e.target.value.replace(/\D/g, "");
        if (v.length > 11) v = v.slice(0, 11);
        v = v.replace(/(\d{3})(\d)/, "$1.$2");
        v = v.replace(/(\d{3})(\d)/, "$1.$2");
        v = v.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
        e.target.value = v;
    });

    // Máscara simplificada para o Telefone
    const inputTelefone = document.getElementById("telefone");
    inputTelefone.addEventListener("input", function (e) {
        let v = e.target.value.replace(/\D/g, "");
        if (v.startsWith("55")) v = v.slice(2);
        if (v.length > 9) v = v.slice(0, 9);

        let formatado = "(+55)";
        if (v.length > 0) formatado += v.slice(0, 2);
        if (v.length > 2) formatado += "-" + v.slice(2);
        
        e.target.value = formatado;
    });

    inputTelefone.addEventListener("focus", function() {
        if (!this.value) this.value = "(+55)";
    });

    // Integração ViaCEP
    const inputCep = document.getElementById("cep");
    inputCep.addEventListener("input", function (e) {
        let v = e.target.value.replace(/\D/g, "");
        if (v.length > 8) v = v.slice(0, 8);
        v = v.replace(/(\d{5})(\d)/, "$1-$2");
        e.target.value = v;
    });

    inputCep.addEventListener("blur", function () {
        const cepLimpo = inputCep.value.replace(/\D/g, "");
        if (cepLimpo.length === 8) {
            fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`)
                .then(res => res.json())
                .then(data => {
                    if (!data.erro) {
                        document.getElementById("rua").value = data.logradouro || "";
                        document.getElementById("cidade").value = data.localidade || "";
                        document.getElementById("uf").value = data.uf || "";
                    }
                })
                .catch(() => {});
        }
    });

    // Validação do Algoritmo de CPF real
    function validarCPF(cpf) {
        cpf = cpf.replace(/[^\d]/g, "");
        if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;
        let soma = 0, resto;
        for (let i = 1; i <= 9; i++) soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
        resto = (soma * 10) % 11;
        if (resto === 10 || resto === 11) resto = 0;
        if (resto !== parseInt(cpf.substring(9, 10))) return false;
        soma = 0;
        for (let i = 1; i <= 10; i++) soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
        resto = (soma * 10) % 11;
        if (resto === 10 || resto === 11) resto = 0;
        return resto === parseInt(cpf.substring(10, 11));
    }

    function mostrarErro(idCampo, mensagem) {
        const campo = document.getElementById(idCampo);
        const spanErro = document.querySelector(`[id-erro="${idCampo}"]`);
        if (campo) campo.classList.add("invalido");
        if (spanErro) spanErro.textContent = mensagem;
    }

    function limparErros() {
        document.querySelectorAll("input, select").forEach(el => el.classList.remove("invalido"));
        document.querySelectorAll(".erro-texto").forEach(el => el.textContent = "");
        feedbackMensagem.className = "feedback-mensagem";
        feedbackMensagem.textContent = "";
    }

    formCadastro.addEventListener("submit", function (e) {
        e.preventDefault();
        limparErros();

        let valido = true;

        // 1. Nome Completo: Entre 15 e 80 caracteres, apenas letras
        const nome = document.getElementById("nome").value.trim();
        const regexNome = /^[A-Za-zÀ-ÿ\s]{15,80}$/;
        if (!regexNome.test(nome)) {
            mostrarErro("nome", "O nome deve conter apenas letras e entre 15 e 80 caracteres.");
            valido = false;
        }

        // 2. CPF Real
        const cpf = inputCpf.value;
        if (!validarCPF(cpf)) {
            mostrarErro("cpf", "CPF inválido ou dígitos verificadores incorretos.");
            valido = false;
        }

       // Validação flexível do Telefone
    const telefone = inputTelefone.value.trim();
    const regexTel = /^\(\+55\)\d{2}-\d{4,9}$/;
    if (!regexTel.test(telefone)) {
        mostrarErro("telefone", "Formato obrigatório: (+55)XX-XXXXXXXX");
        valido = false;
    }

        // Outros campos obrigatórios básicos
        const dataNascimento = document.getElementById("dataNascimento").value;
        if (!dataNascimento) {
            mostrarErro("dataNascimento", "Informe a data de nascimento.");
            valido = false;
        }

        const email = document.getElementById("email").value.trim();
        if (!email.includes("@") || !email.includes(".")) {
            mostrarErro("email", "E-mail inválido.");
            valido = false;
        }

        const cep = inputCep.value.trim();
        if (cep.length < 9) {
            mostrarErro("cep", "CEP incompleto.");
            valido = false;
        }

        const nacionalidade = document.getElementById("nacionalidade").value.trim();
        if (!nacionalidade) {
            mostrarErro("nacionalidade", "Campo obrigatório.");
            valido = false;
        }

        const estadoCivil = document.getElementById("estadoCivil").value;
        if (!estadoCivil) {
            valido = false;
        }

        const escolaridade = document.getElementById("escolaridade").value;
        if (!escolaridade) {
            valido = false;
        }

        // 4. Login: Exatamente 6 caracteres alfabéticos
        const login = document.getElementById("login").value.trim();
        const regexAlfabetico6 = /^[A-Za-z]{6}$/;
        if (!regexAlfabetico6.test(login)) {
            mostrarErro("login", "O login deve ter exatamente 6 letras (sem números ou símbolos).");
            valido = false;
        }

        // 5. Senha: Exatamente 8 caracteres alfabéticos
        const senha = document.getElementById("senha").value;
        const confirmaSenha = document.getElementById("confirmaSenha").value;
        const regexAlfabetico8 = /^[A-Za-z]{8}$/;
        if (!regexAlfabetico8.test(senha)) {
            mostrarErro("senha", "A senha deve ter exatamente 8 letras.");
            valido = false;
        }

        if (senha !== confirmaSenha) {
            mostrarErro("confirmaSenha", "As senhas não coincidem.");
            valido = false;
        }

        if (!valido) {
            feedbackMensagem.className = "feedback-mensagem erro";
            feedbackMensagem.textContent = "Por favor, corrija os erros destacadas no formulário.";
            return;
        }

        // Objeto JSON para salvar no localStorage
        const dadosUsuario = {
            nome: nome,
            cpf: cpf,
            dataNascimento: dataNascimento,
            email: email,
            telefone: telefone,
            cep: cep,
            rua: document.getElementById("rua").value,
            cidade: document.getElementById("cidade").value,
            uf: document.getElementById("uf").value,
            nacionalidade: nacionalidade,
            estadoCivil: estadoCivil,
            escolaridade: escolaridade,
            login: login,
            senha: senha
        };

        // Salva os dados do cadastro no localStorage
        localStorage.setItem("usuarioCadastrado", JSON.stringify(dadosUsuario));

        feedbackMensagem.className = "feedback-mensagem sucesso";
        feedbackMensagem.textContent = "Cadastro realizado com sucesso! Redirecionando para o login...";

        setTimeout(() => {
            window.location.href = "login.html";
        }, 2000);
    });
});
// ==========================================
// FUNÇÃO PARA MOSTRAR/OCULTAR SENHA
// ==========================================
window.toggleSenha = function(idCampo, btn) {
    const campo = document.getElementById(idCampo);
    // Pega o ícone <i> que está dentro do botão
    const icone = btn.querySelector('i');
    
    if (campo.type === 'password') {
        campo.type = 'text'; // Mostra a senha
        icone.classList.remove('fa-eye');
        icone.classList.add('fa-eye-slash'); // Muda para o ícone de olho riscado
    } else {
        campo.type = 'password'; // Oculta a senha
        icone.classList.remove('fa-eye-slash');
        icone.classList.add('fa-eye'); // Volta para o ícone de olho normal
    }
};