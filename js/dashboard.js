/* =========================================================
   MOVA FIT - DASHBOARD
   js/dashboard.js
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    /* =====================================================
       1. ELEMENTOS PRINCIPAIS DA NAVEGAÇÃO
    ====================================================== */
    const telas = document.querySelectorAll(".tela");
    const botoesNavegacao = document.querySelectorAll("[data-section]");
    const linksMenu = document.querySelectorAll(".menu-link");
    const btnLogout = document.getElementById("btnLogout");

    /* =====================================================
       2. NAVEGAÇÃO INTERNA DO DASHBOARD (TABS)
    ====================================================== */
    function abrirSecao(nomeSecao) {
        const secaoDestino = document.getElementById(nomeSecao);
        
        if (!secaoDestino) return;

        // Esconde todas as seções e mostra a escolhida
        telas.forEach(tela => tela.classList.remove("ativa"));
        secaoDestino.classList.add("ativa");

        // Atualiza a classe 'ativo' no menu
        linksMenu.forEach(link => {
            if (link.getAttribute("data-section") === nomeSecao) {
                link.classList.add("ativo");
            } else {
                link.classList.remove("ativo");
            }
        });

        // Volta para o topo da página suavemente
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    botoesNavegacao.forEach(botao => {
        botao.addEventListener("click", function () {
            abrirSecao(this.getAttribute("data-section"));
        });
    });

    /* =====================================================
       3. SISTEMA DE LEITURA DOS DADOS DO USUÁRIO
    ====================================================== */
    function tentarLerJSON(chave) {
        const valor = localStorage.getItem(chave);
        if (!valor) return null;
        try {
            const convertido = JSON.parse(valor);
            if (convertido !== null && typeof convertido === "object" && !Array.isArray(convertido)) {
                return convertido;
            }
        } catch (erro) {}
        return null;
    }

    function localizarUsuario() {
        const possiveisChaves = ["usuarioCadastrado", "usuarioLogado", "usuario", "dadosUsuario", "usuarioAtual", "clienteLogado", "cliente"];
        for (let chave of possiveisChaves) {
            const usuario = tentarLerJSON(chave);
            if (usuario) return usuario;
        }
        return {};
    }

    function buscarCampo(objeto, propriedades, chavesLocalStorage) {
        // Procura no objeto
        for (let prop of propriedades) {
            if (objeto && objeto[prop] !== undefined && objeto[prop] !== null && String(objeto[prop]).trim() !== "") {
                return objeto[prop];
            }
        }
        // Procura em chaves avulsas no localStorage
        for (let chave of chavesLocalStorage) {
            const valor = localStorage.getItem(chave);
            if (valor !== null && String(valor).trim() !== "") {
                return valor;
            }
        }
        return "";
    }

    function formatarData(data) {
        if (!data) return "Não informado";
        const texto = String(data).trim();
        if (/^\d{2}\/\d{2}\/\d{4}$/.test(texto)) return texto;
        if (/^\d{4}-\d{2}-\d{2}$/.test(texto)) {
            const partes = texto.split("-");
            return `${partes[2]}/${partes[1]}/${partes[0]}`;
        }
        return texto;
    }

    function formatarEndereco(endereco) {
        if (!endereco) return "Não informado";
        if (typeof endereco === "string") return endereco;
        
        if (typeof endereco === "object") {
            const partes = [];
            if (endereco.rua) partes.push(endereco.rua);
            else if (endereco.logradouro) partes.push(endereco.logradouro);
            if (endereco.numero) partes.push(endereco.numero);
            if (endereco.bairro) partes.push(endereco.bairro);
            if (endereco.cidade) partes.push(endereco.cidade);
            if (endereco.uf) partes.push(endereco.uf);
            
            if (partes.length > 0) return partes.join(", ");
        }
        return "Não informado";
    }

    function pegarPrimeiroNome(nome) {
        if (!nome) return "Usuário";
        return String(nome).trim().split(/\s+/)[0];
    }

    function definirTexto(id, valor, padrao = "Não informado") {
        const elemento = document.getElementById(id);
        if (!elemento) return;
        if (valor !== undefined && valor !== null && String(valor).trim() !== "") {
            elemento.textContent = String(valor);
        } else {
            elemento.textContent = padrao;
        }
    }

    /* =====================================================
       4. PREENCHIMENTO DOS CAMPOS DO DASHBOARD
    ====================================================== */
    function carregarUsuario() {
        const usuario = localizarUsuario();

        // Buscas de Dados
        const nome = buscarCampo(usuario, ["nome", "nomeCompleto", "name"], ["nome", "nomeUsuario", "usuarioNome", "nomeCompleto"]);
        const cpf = buscarCampo(usuario, ["cpf", "CPF"], ["cpf", "usuarioCpf"]);
        const email = buscarCampo(usuario, ["email", "eMail"], ["email", "usuarioEmail"]);
        const telefone = buscarCampo(usuario, ["telefone", "celular", "phone"], ["telefone", "celular", "usuarioTelefone"]);
        const nascimento = buscarCampo(usuario, ["dataNascimento", "nascimento", "data_nascimento"], ["dataNascimento", "nascimento", "usuarioNascimento"]);
        
        let endereco = "";
        if (usuario && usuario.rua) {
            endereco = usuario.rua;
            if (usuario.cidade && usuario.uf) endereco += ", " + usuario.cidade + " - " + usuario.uf;
        }

        const nacionalidade = buscarCampo(usuario, ["nacionalidade"], ["nacionalidade", "usuarioNacionalidade"]);
        const estadoCivil = buscarCampo(usuario, ["estadoCivil", "estado_civil"], ["estadoCivil", "usuarioEstadoCivil"]);
        const escolaridade = buscarCampo(usuario, ["escolaridade"], ["escolaridade", "usuarioEscolaridade"]);
        const cidade = buscarCampo(usuario, ["cidade"], ["cidade", "usuarioCidade"]);
        const uf = buscarCampo(usuario, ["uf", "estado", "UF"], ["uf", "estado", "usuarioUf"]);
        const cep = buscarCampo(usuario, ["cep", "CEP"], ["cep", "usuarioCep"]);

        // Preenchimento Visual - Header/Hero
        const primeiroNome = pegarPrimeiroNome(nome);
        definirTexto("nomeUsuario", primeiroNome, "Usuário");
        definirTexto("nomeBoasVindas", primeiroNome + "!", "Usuário!");

        // Preenchimento Visual - Perfil
        definirTexto("perfilNomeDestaque", nome, "Usuário");
        definirTexto("perfilNome", nome);
        definirTexto("perfilCpf", cpf);
        definirTexto("perfilEmail", email);
        definirTexto("perfilTelefone", telefone);
        definirTexto("perfilNascimento", nascimento ? formatarData(nascimento) : "");
        definirTexto("perfilEndereco", endereco ? formatarEndereco(endereco) : "");

        // Preenchimento Visual - Informações Adicionais
        definirTexto("infoNacionalidade", nacionalidade);
        definirTexto("infoEstadoCivil", estadoCivil);
        definirTexto("infoEscolaridade", escolaridade);
        definirTexto("infoCidade", cidade);
        definirTexto("infoUf", uf);
        definirTexto("infoCep", cep);
    }

    /* =====================================================
       5. AÇÃO DE LOGOUT
    ====================================================== */
    btnLogout.addEventListener("click", function () {
        localStorage.removeItem("usuarioLogado");
        localStorage.removeItem("usuarioAtual");
        localStorage.removeItem("clienteLogado");
        window.location.href = "login.html";
    });

    /* =====================================================
       6. INICIALIZAÇÃO
    ====================================================== */
    carregarUsuario();
    abrirSecao("inicio"); // Garante que a tela inicial carregue primeiro

});