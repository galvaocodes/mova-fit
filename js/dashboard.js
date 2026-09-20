/* =========================================================
   MOVA FIT - DASHBOARD
   js/dashboard.js
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    /* =====================================================
       1. ELEMENTOS PRINCIPAIS
    ====================================================== */

    const body = document.body;
    const html = document.documentElement;

    const telas = document.querySelectorAll(".tela");
    const botoesNavegacao =
        document.querySelectorAll("[data-section]");

    const linksMenu =
        document.querySelectorAll(".menu-link");


    /* =====================================================
       2. ACESSIBILIDADE
    ====================================================== */

    const btnAcessibilidade =
        document.getElementById("btnAcessibilidade");

    const painelAcessibilidade =
        document.getElementById("painelAcessibilidade");

    const btnModoEscuro =
        document.getElementById("btnModoEscuro");

    const btnContraste =
        document.getElementById("btnContraste");

    const diminuirFonte =
        document.getElementById("diminuirFonte");

    const aumentarFonte =
        document.getElementById("aumentarFonte");

    const indicadorFonte =
        document.getElementById("indicadorFonte");


    /* =====================================================
       3. USUÁRIO / LOGOUT
    ====================================================== */

    const btnLogout =
        document.getElementById("btnLogout");

    const nomeUsuario =
        document.getElementById("nomeUsuario");

    const nomeBoasVindas =
        document.getElementById("nomeBoasVindas");


    /* =====================================================
       4. NAVEGAÇÃO INTERNA DO DASHBOARD
    ====================================================== */

    function abrirSecao(nomeSecao) {

        const secaoDestino =
            document.getElementById(nomeSecao);


        /* Se a seção não existir, não faz nada */
        if (!secaoDestino) {
            return;
        }


        /* Esconde todas */
        telas.forEach(function (tela) {

            tela.classList.remove("ativa");

        });


        /* Mostra a escolhida */
        secaoDestino.classList.add("ativa");


        /* Atualiza o menu */
        linksMenu.forEach(function (link) {

            const secaoLink =
                link.getAttribute("data-section");


            if (secaoLink === nomeSecao) {

                link.classList.add("ativo");

            } else {

                link.classList.remove("ativo");

            }

        });


        /* Volta para o topo */
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }


    /* =====================================================
       5. CLIQUES DA NAVEGAÇÃO
    ====================================================== */

    botoesNavegacao.forEach(function (botao) {

        botao.addEventListener("click", function () {

            const secao =
                this.getAttribute("data-section");

            abrirSecao(secao);

        });

    });


    /* =====================================================
       IMPORTANTE:

       O card de Feedback NÃO possui data-section.

       Por isso ele NÃO entra nessa navegação.

       O próprio HTML:

       href="feedback.html"

       faz o redirecionamento normalmente.
    ====================================================== */


    /* =====================================================
       6. ABRIR / FECHAR ACESSIBILIDADE
    ====================================================== */

    function abrirPainel() {

        painelAcessibilidade.classList.add("aberto");

        painelAcessibilidade.setAttribute(
            "aria-hidden",
            "false"
        );

        btnAcessibilidade.setAttribute(
            "aria-expanded",
            "true"
        );

    }


    function fecharPainel() {

        painelAcessibilidade.classList.remove("aberto");

        painelAcessibilidade.setAttribute(
            "aria-hidden",
            "true"
        );

        btnAcessibilidade.setAttribute(
            "aria-expanded",
            "false"
        );

    }


    btnAcessibilidade.addEventListener(
        "click",
        function (evento) {

            /* Evita que o clique chegue ao document */
            evento.stopPropagation();


            const estaAberto =
                painelAcessibilidade
                    .classList
                    .contains("aberto");


            if (estaAberto) {

                fecharPainel();

            } else {

                abrirPainel();

            }

        }
    );


    /* Não fecha quando clicar dentro da caixa */

    painelAcessibilidade.addEventListener(
        "click",
        function (evento) {

            evento.stopPropagation();

        }
    );


    /* Fecha ao clicar fora */

    document.addEventListener(
        "click",
        function () {

            if (
                painelAcessibilidade
                    .classList
                    .contains("aberto")
            ) {

                fecharPainel();

            }

        }
    );


    /* Fecha com ESC */

    document.addEventListener(
        "keydown",
        function (evento) {

            if (evento.key === "Escape") {

                fecharPainel();

            }

        }
    );


    /* =====================================================
       7. MODO ESCURO
    ====================================================== */

    function atualizarBotaoModoEscuro() {

        const ativo =
            body.classList.contains("modo-escuro");


        btnModoEscuro.classList.toggle(
            "ativo",
            ativo
        );


        btnModoEscuro.setAttribute(
            "aria-pressed",
            ativo.toString()
        );


        const texto =
            btnModoEscuro.querySelector("span");


        if (texto) {

            texto.textContent =
                ativo
                    ? "Desativar modo escuro"
                    : "Modo escuro";

        }

    }


    function ativarModoEscuro() {

        /*
           Alto contraste e modo escuro não ficam
           ligados ao mesmo tempo.
        */

        body.classList.remove(
            "alto-contraste"
        );


        body.classList.add(
            "modo-escuro"
        );


        localStorage.setItem(
            "movaModoEscuro",
            "true"
        );


        localStorage.setItem(
            "movaAltoContraste",
            "false"
        );


        atualizarBotaoModoEscuro();
        atualizarBotaoContraste();

    }


    function desativarModoEscuro() {

        body.classList.remove(
            "modo-escuro"
        );


        localStorage.setItem(
            "movaModoEscuro",
            "false"
        );


        atualizarBotaoModoEscuro();

    }


    btnModoEscuro.addEventListener(
        "click",
        function () {

            const ativo =
                body.classList.contains(
                    "modo-escuro"
                );


            if (ativo) {

                desativarModoEscuro();

            } else {

                ativarModoEscuro();

            }

        }
    );


    /* =====================================================
       8. ALTO CONTRASTE
    ====================================================== */

    function atualizarBotaoContraste() {

        const ativo =
            body.classList.contains(
                "alto-contraste"
            );


        btnContraste.classList.toggle(
            "ativo",
            ativo
        );


        btnContraste.setAttribute(
            "aria-pressed",
            ativo.toString()
        );


        const texto =
            btnContraste.querySelector("span");


        if (texto) {

            texto.textContent =
                ativo
                    ? "Desativar alto contraste"
                    : "Alto contraste";

        }

    }


    function ativarContraste() {

        /*
           Remove modo escuro antes de
           ativar o alto contraste.
        */

        body.classList.remove(
            "modo-escuro"
        );


        body.classList.add(
            "alto-contraste"
        );


        localStorage.setItem(
            "movaModoEscuro",
            "false"
        );


        localStorage.setItem(
            "movaAltoContraste",
            "true"
        );


        atualizarBotaoModoEscuro();
        atualizarBotaoContraste();

    }


    function desativarContraste() {

        body.classList.remove(
            "alto-contraste"
        );


        localStorage.setItem(
            "movaAltoContraste",
            "false"
        );


        atualizarBotaoContraste();

    }


    btnContraste.addEventListener(
        "click",
        function () {

            const ativo =
                body.classList.contains(
                    "alto-contraste"
                );


            if (ativo) {

                desativarContraste();

            } else {

                ativarContraste();

            }

        }
    );


    /* =====================================================
       9. TAMANHO DA FONTE
       CORREÇÃO DO PROBLEMA ANTERIOR

       Aqui NÃO alteramos somente uma variável CSS.

       Alteramos diretamente:

       document.documentElement.style.fontSize

       Como os textos do CSS usam rem,
       a interface inteira acompanha.
    ====================================================== */


    /*
       Tamanhos disponíveis:

       90%  = 14.4px
       100% = 16px
       110% = 17.6px
       120% = 19.2px
       130% = 20.8px
    */

    const fonteMinima = 90;
    const fonteMaxima = 130;
    const passoFonte = 10;

    let tamanhoFonte = 100;


    function aplicarTamanhoFonte() {

        /*
           Calcula o tamanho em pixels.

           Exemplo:
           110% de 16 = 17.6px
        */

        const tamanhoPixels =
            16 * (tamanhoFonte / 100);


        /*
           ESTA É A LINHA PRINCIPAL DA CORREÇÃO.
        */

        html.style.fontSize =
            tamanhoPixels + "px";


        /* Atualiza o número no painel */

        indicadorFonte.textContent =
            tamanhoFonte + "%";


        /* Salva a preferência */

        localStorage.setItem(
            "movaTamanhoFonte",
            tamanhoFonte.toString()
        );


        /* Desabilita A- no mínimo */

        diminuirFonte.disabled =
            tamanhoFonte <= fonteMinima;


        /* Desabilita A+ no máximo */

        aumentarFonte.disabled =
            tamanhoFonte >= fonteMaxima;

    }


    /* DIMINUIR */

    diminuirFonte.addEventListener(
        "click",
        function () {

            if (
                tamanhoFonte >
                fonteMinima
            ) {

                tamanhoFonte -=
                    passoFonte;


                aplicarTamanhoFonte();

            }

        }
    );


    /* AUMENTAR */

    aumentarFonte.addEventListener(
        "click",
        function () {

            if (
                tamanhoFonte <
                fonteMaxima
            ) {

                tamanhoFonte +=
                    passoFonte;


                aplicarTamanhoFonte();

            }

        }
    );


    /* =====================================================
       10. CARREGAR PREFERÊNCIAS SALVAS
    ====================================================== */

    function carregarPreferencias() {

        const modoEscuroSalvo =
            localStorage.getItem(
                "movaModoEscuro"
            );


        const contrasteSalvo =
            localStorage.getItem(
                "movaAltoContraste"
            );


        const fonteSalva =
            localStorage.getItem(
                "movaTamanhoFonte"
            );


        /*
           Alto contraste tem prioridade caso,
           por algum motivo, os dois tenham sido
           salvos como true.
        */

        if (contrasteSalvo === "true") {

            body.classList.add(
                "alto-contraste"
            );

            body.classList.remove(
                "modo-escuro"
            );

        } else if (
            modoEscuroSalvo === "true"
        ) {

            body.classList.add(
                "modo-escuro"
            );

            body.classList.remove(
                "alto-contraste"
            );

        }


        /* Recupera tamanho da fonte */

        if (fonteSalva !== null) {

            const valor =
                Number(fonteSalva);


            if (
                !Number.isNaN(valor) &&
                valor >= fonteMinima &&
                valor <= fonteMaxima
            ) {

                tamanhoFonte = valor;

            }

        }


        aplicarTamanhoFonte();

        atualizarBotaoModoEscuro();
        atualizarBotaoContraste();

    }


    /* =====================================================
       11. FUNÇÕES PARA LOCALSTORAGE DO USUÁRIO

       O cadastro/login pode ter salvo os dados
       de formas diferentes.

       Por isso tentamos localizar:
       - objetos JSON
       - chaves individuais
    ====================================================== */


    function tentarLerJSON(chave) {

        const valor =
            localStorage.getItem(chave);


        if (!valor) {
            return null;
        }


        try {

            const convertido =
                JSON.parse(valor);


            if (
                convertido !== null &&
                typeof convertido === "object" &&
                !Array.isArray(convertido)
            ) {

                return convertido;

            }

        } catch (erro) {

            /*
               Não é JSON.
               Isso não significa necessariamente
               que exista erro no sistema.
            */

        }


        return null;

    }


    /* =====================================================
       12. LOCALIZAR OBJETO DO USUÁRIO
    ====================================================== */

    function localizarUsuario() {

        /*
           Tentamos nomes comuns que podem estar
           sendo usados pelo login/cadastro.
        */

        const possiveisChaves = [

            "usuarioLogado",
            "usuario",
            "dadosUsuario",
            "usuarioAtual",
            "clienteLogado",
            "cliente"

        ];


        for (
            let i = 0;
            i < possiveisChaves.length;
            i++
        ) {

            const usuario =
                tentarLerJSON(
                    possiveisChaves[i]
                );


            if (usuario) {

                return usuario;

            }

        }


        return {};

    }


    /* =====================================================
       13. BUSCAR CAMPO

       Primeiro procura no objeto.
       Depois procura em chaves individuais.
    ====================================================== */

    function buscarCampo(
        objeto,
        propriedades,
        chavesLocalStorage
    ) {

        /* Procura dentro do objeto */

        for (
            let i = 0;
            i < propriedades.length;
            i++
        ) {

            const propriedade =
                propriedades[i];


            if (
                objeto &&
                objeto[propriedade] !== undefined &&
                objeto[propriedade] !== null &&
                String(
                    objeto[propriedade]
                ).trim() !== ""
            ) {

                return objeto[propriedade];

            }

        }


        /* Procura no localStorage */

        for (
            let i = 0;
            i < chavesLocalStorage.length;
            i++
        ) {

            const valor =
                localStorage.getItem(
                    chavesLocalStorage[i]
                );


            if (
                valor !== null &&
                String(valor).trim() !== ""
            ) {

                return valor;

            }

        }


        return "";

    }


    /* =====================================================
       14. FORMATAR DATA
    ====================================================== */

    function formatarData(data) {

        if (!data) {
            return "Não informado";
        }


        const texto =
            String(data).trim();


        /*
           Se já estiver DD/MM/AAAA,
           deixa como está.
        */

        if (
            /^\d{2}\/\d{2}\/\d{4}$/
                .test(texto)
        ) {

            return texto;

        }


        /*
           Se estiver AAAA-MM-DD,
           converte.
        */

        if (
            /^\d{4}-\d{2}-\d{2}$/
                .test(texto)
        ) {

            const partes =
                texto.split("-");


            return (
                partes[2] +
                "/" +
                partes[1] +
                "/" +
                partes[0]
            );

        }


        return texto;

    }


    /* =====================================================
       15. FORMATAR ENDEREÇO
    ====================================================== */

    function formatarEndereco(endereco) {

        if (!endereco) {

            return "Não informado";

        }


        /*
           Caso seja apenas texto:
        */

        if (
            typeof endereco === "string"
        ) {

            return endereco;

        }


        /*
           Caso o cadastro tenha salvo
           endereço como objeto.
        */

        if (
            typeof endereco === "object"
        ) {

            const partes = [];


            if (endereco.rua) {

                partes.push(
                    endereco.rua
                );

            } else if (
                endereco.logradouro
            ) {

                partes.push(
                    endereco.logradouro
                );

            }


            if (endereco.numero) {

                partes.push(
                    endereco.numero
                );

            }


            if (endereco.bairro) {

                partes.push(
                    endereco.bairro
                );

            }


            if (endereco.cidade) {

                partes.push(
                    endereco.cidade
                );

            }


            if (endereco.uf) {

                partes.push(
                    endereco.uf
                );

            }


            if (partes.length > 0) {

                return partes.join(", ");

            }

        }


        return "Não informado";

    }


    /* =====================================================
       16. PRIMEIRO NOME
    ====================================================== */

    function pegarPrimeiroNome(nome) {

        if (!nome) {

            return "Usuário";

        }


        return String(nome)
            .trim()
            .split(/\s+/)[0];

    }


    /* =====================================================
       17. ALTERAR TEXTO COM SEGURANÇA
    ====================================================== */

    function definirTexto(
        id,
        valor,
        padrao = "Não informado"
    ) {

        const elemento =
            document.getElementById(id);


        if (!elemento) {
            return;
        }


        if (
            valor !== undefined &&
            valor !== null &&
            String(valor).trim() !== ""
        ) {

            elemento.textContent =
                String(valor);

        } else {

            elemento.textContent =
                padrao;

        }

    }


    /* =====================================================
       18. CARREGAR DADOS DO USUÁRIO
    ====================================================== */

    function carregarUsuario() {

        const usuario =
            localizarUsuario();


        /* NOME */

        const nome =
            buscarCampo(
                usuario,

                [
                    "nome",
                    "nomeCompleto",
                    "name"
                ],

                [
                    "nome",
                    "nomeUsuario",
                    "usuarioNome",
                    "nomeCompleto"
                ]
            );


        /* CPF */

        const cpf =
            buscarCampo(
                usuario,

                [
                    "cpf",
                    "CPF"
                ],

                [
                    "cpf",
                    "usuarioCpf"
                ]
            );


        /* EMAIL */

        const email =
            buscarCampo(
                usuario,

                [
                    "email",
                    "eMail"
                ],

                [
                    "email",
                    "usuarioEmail"
                ]
            );


        /* TELEFONE */

        const telefone =
            buscarCampo(
                usuario,

                [
                    "telefone",
                    "celular",
                    "phone"
                ],

                [
                    "telefone",
                    "celular",
                    "usuarioTelefone"
                ]
            );


        /* NASCIMENTO */

        const nascimento =
            buscarCampo(
                usuario,

                [
                    "dataNascimento",
                    "nascimento",
                    "data_nascimento"
                ],

                [
                    "dataNascimento",
                    "nascimento",
                    "usuarioNascimento"
                ]
            );


        /* ENDEREÇO */

        const endereco =
            buscarCampo(
                usuario,

                [
                    "endereco",
                    "endereço",
                    "address"
                ],

                [
                    "endereco",
                    "usuarioEndereco"
                ]
            );


        /* NACIONALIDADE */

        const nacionalidade =
            buscarCampo(
                usuario,

                [
                    "nacionalidade"
                ],

                [
                    "nacionalidade",
                    "usuarioNacionalidade"
                ]
            );


        /* ESTADO CIVIL */

        const estadoCivil =
            buscarCampo(
                usuario,

                [
                    "estadoCivil",
                    "estado_civil"
                ],

                [
                    "estadoCivil",
                    "usuarioEstadoCivil"
                ]
            );


        /* ESCOLARIDADE */

        const escolaridade =
            buscarCampo(
                usuario,

                [
                    "escolaridade"
                ],

                [
                    "escolaridade",
                    "usuarioEscolaridade"
                ]
            );


        /* CIDADE */

        const cidade =
            buscarCampo(
                usuario,

                [
                    "cidade"
                ],

                [
                    "cidade",
                    "usuarioCidade"
                ]
            );


        /* ESTADO / UF */

        const uf =
            buscarCampo(
                usuario,

                [
                    "uf",
                    "estado",
                    "UF"
                ],

                [
                    "uf",
                    "estado",
                    "usuarioUf"
                ]
            );


        /* CEP */

        const cep =
            buscarCampo(
                usuario,

                [
                    "cep",
                    "CEP"
                ],

                [
                    "cep",
                    "usuarioCep"
                ]
            );


        /* =================================================
           NOME NO HEADER
        ================================================== */

        const primeiroNome =
            pegarPrimeiroNome(nome);


        definirTexto(
            "nomeUsuario",
            primeiroNome,
            "Usuário"
        );


        definirTexto(
            "nomeBoasVindas",
            primeiroNome + "!",
            "Usuário!"
        );


        /* =================================================
           PERFIL
        ================================================== */

        definirTexto(
            "perfilNomeDestaque",
            nome,
            "Usuário"
        );


        definirTexto(
            "perfilNome",
            nome
        );


        definirTexto(
            "perfilCpf",
            cpf
        );


        definirTexto(
            "perfilEmail",
            email
        );


        definirTexto(
            "perfilTelefone",
            telefone
        );


        definirTexto(
            "perfilNascimento",
            nascimento
                ? formatarData(nascimento)
                : ""
        );


        definirTexto(
            "perfilEndereco",
            endereco
                ? formatarEndereco(endereco)
                : ""
        );


        /* =================================================
           INFORMAÇÕES ADICIONAIS
        ================================================== */

        definirTexto(
            "infoNacionalidade",
            nacionalidade
        );


        definirTexto(
            "infoEstadoCivil",
            estadoCivil
        );


        definirTexto(
            "infoEscolaridade",
            escolaridade
        );


        definirTexto(
            "infoCidade",
            cidade
        );


        definirTexto(
            "infoUf",
            uf
        );


        definirTexto(
            "infoCep",
            cep
        );

    }


    /* =====================================================
       19. LOGOUT
    ====================================================== */

    btnLogout.addEventListener(
        "click",
        function () {

            /*
               Remove somente as informações que normalmente
               representam a sessão.

               NÃO usamos localStorage.clear(), porque isso
               apagaria cadastro, acessibilidade e outros
               dados do projeto.
            */

            localStorage.removeItem(
                "usuarioLogado"
            );


            localStorage.removeItem(
                "usuarioAtual"
            );


            localStorage.removeItem(
                "clienteLogado"
            );


            /*
               Volta para o login.
            */

            window.location.href =
                "login.html";

        }
    );


    /* =====================================================
       20. INICIALIZAÇÃO
    ====================================================== */


    /*
       1 - Carrega acessibilidade
    */

    carregarPreferencias();


    /*
       2 - Carrega dados do usuário
    */

    carregarUsuario();


    /*
       3 - Garante que o Dashboard
           comece no Início.
    */

    abrirSecao("inicio");

});