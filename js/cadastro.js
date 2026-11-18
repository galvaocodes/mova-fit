// Validações e cadastro

document.addEventListener("DOMContentLoaded", function () {
    const formCadastro = document.getElementById("formCadastro");
    const feedbackMensagem = document.getElementById("feedbackMensagem");

    const planoDaUrl = new URLSearchParams(window.location.search).get("plano");
    if (planoDaUrl === "basic" || planoDaUrl === "plus") {
        if (localStorage.getItem("usuarioLogado")) {
            window.location.replace("dashboard.html?plano=" + planoDaUrl);
            return;
        }

        const radioPlano = document.querySelector(`input[name="plano"][value="${planoDaUrl}"]`);
        if (radioPlano) radioPlano.checked = true;

        const linkLogin = document.getElementById("linkLogin");
        if (linkLogin) linkLogin.href = "login.html?plano=" + planoDaUrl;
    }

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

    function aplicarMascaraTelefone(input) {
        input.addEventListener("input", function (e) {
            let v = e.target.value.replace(/^\(\+?5?5?\)?/, "").replace(/\D/g, "");
            if (v.length > 10) v = v.slice(0, 10);

            let formatado = "(+55)";
            if (v.length > 0) formatado += v.slice(0, 2);
            if (v.length > 2) formatado += "-" + v.slice(2);

            e.target.value = formatado;
        });

        input.addEventListener("focus", function () {
            if (!this.value) this.value = "(+55)";
        });

        input.addEventListener("blur", function () {
            if (this.value === "(+55)") this.value = "";
        });
    }

    const inputTelefone = document.getElementById("telefone");
    const inputTelefoneFixo = document.getElementById("telefoneFixo");
    aplicarMascaraTelefone(inputTelefone);
    aplicarMascaraTelefone(inputTelefoneFixo);

    // Integração ViaCEP
    const inputCep = document.getElementById("cep");
    inputCep.addEventListener("input", function (e) {
        let v = e.target.value.replace(/\D/g, "");
        if (v.length > 8) v = v.slice(0, 8);
        v = v.replace(/(\d{5})(\d)/, "$1-$2");
        e.target.value = v;
    });

    const camposEndereco = ["rua", "bairro", "cidade", "uf"].map(id => document.getElementById(id));
    const spanErroCep = document.querySelector('[id-erro="cep"]');

    function travarEndereco() {
        camposEndereco.forEach(campo => {
            campo.readOnly = true;
            campo.classList.add("travado");
            campo.title = "Preenchido automaticamente pelo CEP";
        });
    }

    function limparEndereco() {
        camposEndereco.forEach(campo => { campo.value = ""; });
    }

    travarEndereco();

    // O endereço só vale se veio de um CEP encontrado no ViaCEP
    let ultimoCepBuscado = "";
    let cepConfirmado = false;

    function buscarCep() {
        const cepLimpo = inputCep.value.replace(/\D/g, "");
        if (cepLimpo.length !== 8 || cepLimpo === ultimoCepBuscado) return;
        ultimoCepBuscado = cepLimpo;
        cepConfirmado = false;
        spanErroCep.textContent = "Buscando endereço...";

        fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`)
            .then(res => res.json())
            .then(data => {
                if (data.erro) {
                    limparEndereco();
                    inputCep.classList.add("invalido");
                    spanErroCep.textContent = "CEP não encontrado. Confira os números.";
                    return;
                }
                document.getElementById("rua").value = data.logradouro || "";
                document.getElementById("bairro").value = data.bairro || "";
                document.getElementById("cidade").value = data.localidade || "";
                document.getElementById("uf").value = data.uf || "";
                inputCep.classList.remove("invalido");
                spanErroCep.textContent = "";
                cepConfirmado = true;
            })
            .catch(() => {
                ultimoCepBuscado = "";
                limparEndereco();
                spanErroCep.textContent = "Não foi possível buscar o CEP. Verifique a internet e digite o CEP de novo.";
            });
    }

    inputCep.addEventListener("input", () => {
        const cepLimpo = inputCep.value.replace(/\D/g, "");
        if (cepLimpo !== ultimoCepBuscado) {
            // Mudou o CEP: apaga o endereço antigo até a nova busca confirmar
            if (ultimoCepBuscado) limparEndereco();
            cepConfirmado = false;
            ultimoCepBuscado = "";
        }
        if (cepLimpo.length === 8) buscarCep();
    });
    inputCep.addEventListener("blur", buscarCep);

    // Validação do CPF
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
        document.querySelectorAll("input, select, .opcoes-plano").forEach(el => el.classList.remove("invalido"));
        document.querySelectorAll(".erro-texto").forEach(el => el.textContent = "");
        feedbackMensagem.className = "feedback-mensagem";
        feedbackMensagem.textContent = "";
    }

    formCadastro.addEventListener("submit", function (e) {
        e.preventDefault();
        limparErros();

        let valido = true;

        const nome = document.getElementById("nome").value.trim();
        const regexNome = /^[A-Za-zÀ-ÿ\s]{15,80}$/;
        if (!regexNome.test(nome)) {
            mostrarErro("nome", "O nome deve conter apenas letras e entre 15 e 80 caracteres.");
            valido = false;
        }

        // Cpf
        const cpf = inputCpf.value;
        if (!validarCPF(cpf)) {
            mostrarErro("cpf", "CPF inválido ou dígitos verificadores incorretos.");
            valido = false;
        }

        const regexTel = /^\(\+55\)\d{2}-\d{8}$/;
        const telefone = inputTelefone.value.trim();
        if (!regexTel.test(telefone)) {
            mostrarErro("telefone", "Formato obrigatório: (+55)XX-XXXXXXXX");
            valido = false;
        }
        let telefoneFixo = inputTelefoneFixo.value.trim();
        if (telefoneFixo === "(+55)") telefoneFixo = "";
        if (telefoneFixo && !regexTel.test(telefoneFixo)) {
            mostrarErro("telefoneFixo", "Formato obrigatório: (+55)XX-XXXXXXXX");
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
        } else if (!cepConfirmado) {
            mostrarErro("cep", "Digite um CEP válido para preencher o endereço.");
            valido = false;
        }

        const rua = document.getElementById("rua").value.trim();
        const bairro = document.getElementById("bairro").value.trim();
        const cidade = document.getElementById("cidade").value.trim();
        const uf = document.getElementById("uf").value.trim().toUpperCase();

        // Nacionalidade e estado civil
        const nacionalidade = document.getElementById("nacionalidade").value.trim();
        if (!/^[A-Za-zÀ-ÿ\s]{3,40}$/.test(nacionalidade)) {
            mostrarErro("nacionalidade", "Informe a nacionalidade (só letras).");
            valido = false;
        }
        const estadoCivil = document.getElementById("estadoCivil").value;
        if (!estadoCivil) {
            mostrarErro("estadoCivil", "Selecione o estado civil.");
            valido = false;
        }

        const radioPlanoMarcado = document.querySelector('input[name="plano"]:checked');
        const plano = radioPlanoMarcado ? radioPlanoMarcado.value : "";
        if (!plano) {
            document.querySelector(".opcoes-plano").classList.add("invalido");
            document.querySelector('[id-erro="plano"]').textContent = "Escolha um plano.";
            valido = false;
        }

        // Login: Exatamente 6 caracteres alfabéticos
        const login = document.getElementById("login").value.trim().toLowerCase();
        const regexAlfabetico6 = /^[A-Za-z]{6}$/;
        if (!regexAlfabetico6.test(login)) {
            mostrarErro("login", "O login deve ter exatamente 6 letras (sem números ou símbolos).");
            valido = false;
        }

        // Senha: Exatamente 8 caracteres alfabéticos
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
            feedbackMensagem.textContent = "Por favor, corrija os erros destacados no formulário.";
            return;
        }

        // Objeto JSON para salvar no localStorage
        const dadosUsuario = {
            nome: nome,
            cpf: cpf,
            dataNascimento: dataNascimento,
            email: email,
            telefone: telefone,
            telefoneFixo: telefoneFixo,
            cep: cep,
            rua: rua,
            bairro: bairro,
            cidade: cidade,
            uf: uf,
            nacionalidade: nacionalidade,
            estadoCivil: estadoCivil,
            plano: plano,
            login: login,
            senha: senha
        };

        // Salva os dados do cadastro no localStorage
        localStorage.setItem("usuarioCadastrado", JSON.stringify(dadosUsuario));

        feedbackMensagem.className = "feedback-mensagem sucesso";
        feedbackMensagem.textContent = "Cadastro realizado com sucesso! Redirecionando para o login...";

        setTimeout(() => {
            window.location.href = "login.html?plano=" + plano;
        }, 2000);
    });
});

window.toggleSenha = function(idCampo, btn) {
    const campo = document.getElementById(idCampo);

    const icone = btn.querySelector('i');

    if (campo.type === 'password') {
        campo.type = 'text';
        icone.classList.remove('fa-eye');
        icone.classList.add('fa-eye-slash');
    } else {
        campo.type = 'password';
        icone.classList.remove('fa-eye-slash');
        icone.classList.add('fa-eye');
    }
};
