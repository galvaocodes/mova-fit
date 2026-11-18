// Dashboard

document.addEventListener("DOMContentLoaded", function () {

    if (!localStorage.getItem("usuarioLogado")) {
        window.location.replace("404.html?erro=auth");
        return;
    }

    // Elementos principais da navegação
    const telas = document.querySelectorAll(".tela");
    const botoesNavegacao = document.querySelectorAll("[data-section]");
    const linksMenu = document.querySelectorAll(".menu-link");
    const btnLogout = document.getElementById("btnLogout");

    window.abrirSecao = (nome) => abrirSecao(nome);

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

    // Sistema de leitura dos dados do usuário
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

    // Preenchimento dos campos do dashboard
    function carregarUsuario() {
        const usuario = localizarUsuario();

        const nome = buscarCampo(usuario, ["nome", "nomeCompleto", "name"], ["nome", "nomeUsuario", "usuarioNome", "nomeCompleto"]);
        const cpf = buscarCampo(usuario, ["cpf", "CPF"], ["cpf", "usuarioCpf"]);
        const email = buscarCampo(usuario, ["email", "eMail"], ["email", "usuarioEmail"]);
        const telefone = buscarCampo(usuario, ["telefone", "celular", "phone"], ["telefone", "celular", "usuarioTelefone"]);
        const nascimento = buscarCampo(usuario, ["dataNascimento", "nascimento", "data_nascimento"], ["dataNascimento", "nascimento", "usuarioNascimento"]);

        const telefoneFixo = buscarCampo(usuario, ["telefoneFixo", "fixo"], []);
        const bairro = buscarCampo(usuario, ["bairro"], []);
        const nacionalidade = buscarCampo(usuario, ["nacionalidade"], []);
        const estadoCivil = buscarCampo(usuario, ["estadoCivil"], []);

        let endereco = "";
        if (usuario && usuario.rua) {
            endereco = usuario.rua;
            if (usuario.bairro) endereco += ", " + usuario.bairro;
            if (usuario.cidade && usuario.uf) endereco += ", " + usuario.cidade + " - " + usuario.uf;
        }

        const rua = buscarCampo(usuario, ["rua", "logradouro"], []);
        const cidade = buscarCampo(usuario, ["cidade"], ["cidade", "usuarioCidade"]);
        const uf = buscarCampo(usuario, ["uf", "estado", "UF"], ["uf", "estado", "usuarioUf"]);
        const cep = buscarCampo(usuario, ["cep", "CEP"], ["cep", "usuarioCep"]);

        // Header/Hero
        const primeiroNome = pegarPrimeiroNome(nome);
        definirTexto("nomeUsuario", primeiroNome, "Usuário");
        definirTexto("nomeBoasVindas", primeiroNome + "!", "Usuário!");

        // Perfil
        definirTexto("perfilNomeDestaque", nome, "Usuário");
        definirTexto("perfilNome", nome);
        definirTexto("perfilCpf", cpf);
        definirTexto("perfilEmail", email);
        definirTexto("perfilTelefone", telefone);
        definirTexto("perfilTelefoneFixo", telefoneFixo);
        definirTexto("perfilNascimento", nascimento ? formatarData(nascimento) : "");
        definirTexto("perfilNacionalidade", nacionalidade);
        definirTexto("perfilEstadoCivil", estadoCivil);
        definirTexto("perfilEndereco", endereco ? formatarEndereco(endereco) : "");

        // Meu endereço
        definirTexto("infoRua", rua);
        definirTexto("infoBairro", bairro);
        definirTexto("infoCidade", cidade);
        definirTexto("infoUf", uf);
        definirTexto("infoCep", cep);
    }

    // Ação de logout
    btnLogout.addEventListener("click", function () {
        localStorage.removeItem("usuarioLogado");
        localStorage.removeItem("usuarioAtual");
        localStorage.removeItem("clienteLogado");
        window.location.href = "index.html";
    });

    // Inicialização
    carregarUsuario();
    abrirSecao("inicio");

});
