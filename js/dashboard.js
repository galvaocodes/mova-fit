// ==========================================
// DASHBOARD MOVA FIT
// ==========================================


// ==========================================
// SAUDAÇÃO AUTOMÁTICA
// ==========================================

const tituloBoasVindas =
    document.querySelector(".boas-vindas h1");

const horaAtual = new Date().getHours();

let saudacao;

if (horaAtual >= 5 && horaAtual < 12) {

    saudacao = "Bom dia";

} else if (horaAtual >= 12 && horaAtual < 18) {

    saudacao = "Boa tarde";

} else {

    saudacao = "Boa noite";

}

if (tituloBoasVindas) {

    tituloBoasVindas.textContent =
        `${saudacao}, Usuário! 👋`;

}


// ==========================================
// NOTIFICAÇÕES
// ==========================================

const botaoNotificacao =
    document.querySelector(".botao-notificacao");

if (botaoNotificacao) {

    botaoNotificacao.addEventListener(
        "click",
        function () {

            alert(
                "Notificações Mova Fit\n\n" +
                "🏋️ Seu treino funcional começa hoje às 18:30.\n\n" +
                "🔥 Você está com uma sequência de 4 dias!"
            );

        }
    );

}


// ==========================================
// ACESSIBILIDADE
// ==========================================

const botaoAcessibilidade =
    document.querySelector(".botao-acessibilidade");

let fonteAumentada = false;

if (botaoAcessibilidade) {

    botaoAcessibilidade.addEventListener(
        "click",
        function () {

            if (fonteAumentada === false) {

                document.body.style.fontSize = "18px";

                fonteAumentada = true;

            } else {

                document.body.style.fontSize = "";

                fonteAumentada = false;

            }

        }
    );

}


// ==========================================
// BOTÃO SAIR
// ==========================================

const botaoSair =
    document.querySelector(".sair");

if (botaoSair) {

    botaoSair.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            const confirmar =
                confirm(
                    "Deseja realmente sair da sua conta?"
                );

            if (confirmar) {

                window.location.href =
                    "login.html";

            }

        }
    );

}


// ==========================================
// ANIMAÇÃO DO GRÁFICO
// ==========================================

const barras =
    document.querySelectorAll(".barra");

window.addEventListener(
    "load",
    function () {

        barras.forEach(function (barra) {

            const alturaOriginal =
                barra.offsetHeight;

            barra.style.height = "0px";

            barra.style.transition =
                "height 0.8s ease";

            setTimeout(
                function () {

                    barra.style.height =
                        alturaOriginal + "px";

                },
                200
            );

        });

    }
);


// ==========================================
// ANIMAÇÃO DOS CARDS
// ==========================================

const cards =
    document.querySelectorAll(".card");

cards.forEach(function (card) {

    card.addEventListener(
        "mouseenter",
        function () {

            card.style.transform =
                "translateY(-3px)";

        }
    );


    card.addEventListener(
        "mouseleave",
        function () {

            card.style.transform =
                "translateY(0)";

        }
    );

});