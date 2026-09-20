/* ==========================================
   1. RECEBER AS INFORMAÇÕES DO FEEDBACK
========================================== */

const dadosSalvos =
    localStorage.getItem("feedbackMovaFit");


if (dadosSalvos) {

    const feedback =
        JSON.parse(dadosSalvos);


    /* CATEGORIA */

    document.getElementById("categoria")
        .textContent =
        feedback.categoria || "-";


    /* AVALIAÇÃO */

    const quantidadeEstrelas =
        Number(feedback.avaliacao) || 0;


    document.getElementById("avaliacao")
        .textContent =
        "★".repeat(quantidadeEstrelas) +
        "☆".repeat(5 - quantidadeEstrelas);


    /* TIPO */

    document.getElementById("tipo")
        .textContent =
        feedback.tipo || "-";


    /* SATISFAÇÃO */

    document.getElementById("satisfacao")
        .textContent =
        feedback.satisfacao
            ? feedback.satisfacao + "/10"
            : "-";


    /* ASSUNTO */

    document.getElementById("assunto")
        .textContent =
        feedback.assunto || "-";


    /* MENSAGEM */

    document.getElementById("mensagem")
        .textContent =
        feedback.mensagem || "-";


    /* RETORNO */

    document.getElementById("retorno")
        .textContent =
        feedback.retorno || "-";


    /* ENVIADO POR */

    document.getElementById("enviadoPor")
        .textContent =
        feedback.enviadoPor || "Usuário";


    /* DATA */

    document.getElementById("data")
        .textContent =
        feedback.data ||
        new Date().toLocaleDateString("pt-BR");


    /* STATUS */

    document.getElementById("status")
        .textContent =
        feedback.status || "Enviado";
}



/* ==========================================
   2. PAINEL DE ACESSIBILIDADE
========================================== */

const botaoAcessibilidade =
    document.getElementById(
        "botaoAcessibilidade"
    );


const painelAcessibilidade =
    document.getElementById(
        "painelAcessibilidade"
    );


/* ABRIR / FECHAR PAINEL */

botaoAcessibilidade.addEventListener(
    "click",
    function () {

        painelAcessibilidade.classList.toggle(
            "aberto"
        );

    }
);



/* ==========================================
   3. TEMA CLARO / ESCURO
========================================== */

const botaoClaro =
    document.getElementById("temaClaro");


const botaoEscuro =
    document.getElementById("temaEscuro");


/* FUNÇÃO PARA USAR O TEMA CLARO */

function usarTemaClaro() {

    document.body.classList.remove(
        "escuro"
    );


    botaoClaro.classList.add(
        "ativo"
    );


    botaoEscuro.classList.remove(
        "ativo"
    );


    localStorage.setItem(
        "tema",
        "claro"
    );

}


/* FUNÇÃO PARA USAR O TEMA ESCURO */

function usarTemaEscuro() {

    document.body.classList.add(
        "escuro"
    );


    botaoEscuro.classList.add(
        "ativo"
    );


    botaoClaro.classList.remove(
        "ativo"
    );


    localStorage.setItem(
        "tema",
        "escuro"
    );

}


/* CLIQUE NO CLARO */

botaoClaro.addEventListener(
    "click",
    usarTemaClaro
);


/* CLIQUE NO ESCURO */

botaoEscuro.addEventListener(
    "click",
    usarTemaEscuro
);



/* ==========================================
   4. ESCALABILIDADE DA FONTE
========================================== */

const botaoDiminuir =
    document.getElementById(
        "diminuirFonte"
    );


const botaoAumentar =
    document.getElementById(
        "aumentarFonte"
    );


const porcentagemFonte =
    document.getElementById(
        "porcentagemFonte"
    );


/*
    100 significa 100%.
*/

let tamanhoFonte =
    Number(
        localStorage.getItem(
            "tamanhoFonte"
        )
    ) || 100;


/* ALTERAR TAMANHO */

function atualizarFonte() {

    document.documentElement.style.fontSize =
        tamanhoFonte + "%";


    porcentagemFonte.textContent =
        tamanhoFonte + "%";


    localStorage.setItem(
        "tamanhoFonte",
        tamanhoFonte
    );

}


/* DIMINUIR */

botaoDiminuir.addEventListener(
    "click",
    function () {

        if (tamanhoFonte > 80) {

            tamanhoFonte -= 10;

            atualizarFonte();

        }

    }
);


/* AUMENTAR */

botaoAumentar.addEventListener(
    "click",
    function () {

        if (tamanhoFonte < 140) {

            tamanhoFonte += 10;

            atualizarFonte();

        }

    }
);



/* ==========================================
   5. CARREGAR PREFERÊNCIAS SALVAS
========================================== */

/* TEMA */

const temaSalvo =
    localStorage.getItem("tema");


if (temaSalvo === "escuro") {

    usarTemaEscuro();

} else {

    usarTemaClaro();

}


/* TAMANHO DA FONTE */

atualizarFonte();