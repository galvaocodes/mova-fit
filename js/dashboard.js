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

    // Coloca um texto no elemento (ou "Não informado" se estiver vazio)
    function mostrar(id, valor, padrao = "Não informado") {
        document.getElementById(id).textContent = valor || padrao;
    }

    // Converte a data de 2002-03-15 para 15/03/2002
    function formatarData(data) {
        if (!data) return "";
        const [ano, mes, dia] = data.split("-");
        return `${dia}/${mes}/${ano}`;
    }

    // Preenche o painel com os dados do usuário logado
    function carregarUsuario() {
        const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));
        const primeiroNome = usuario.nome.split(" ")[0];

        let endereco = usuario.rua || "";
        if (usuario.bairro) endereco += ", " + usuario.bairro;
        if (usuario.cidade) endereco += ", " + usuario.cidade + " - " + usuario.uf;

        mostrar("nomeUsuario", primeiroNome);
        mostrar("nomeBoasVindas", primeiroNome + "!");

        // Perfil
        mostrar("perfilNomeDestaque", usuario.nome);
        mostrar("perfilNome", usuario.nome);
        mostrar("perfilCpf", usuario.cpf);
        mostrar("perfilEmail", usuario.email);
        mostrar("perfilTelefone", usuario.telefone);
        mostrar("perfilTelefoneFixo", usuario.telefoneFixo);
        mostrar("perfilNascimento", formatarData(usuario.dataNascimento));
        mostrar("perfilNacionalidade", usuario.nacionalidade);
        mostrar("perfilEstadoCivil", usuario.estadoCivil);
        mostrar("perfilEndereco", endereco);

        // Meu endereço
        mostrar("infoRua", usuario.rua);
        mostrar("infoBairro", usuario.bairro);
        mostrar("infoCidade", usuario.cidade);
        mostrar("infoUf", usuario.uf);
        mostrar("infoCep", usuario.cep);
    }

    // Sair da conta
    btnLogout.addEventListener("click", function () {
        localStorage.removeItem("usuarioLogado");
        window.location.href = "index.html";
    });

    // Inicialização
    carregarUsuario();
    abrirSecao("inicio");

});
