// ========================================
// FEEDBACK | MOVA FIT
// ========================================

// ESTRELAS
const estrelas = document.querySelectorAll(".estrela");
const campoAvaliacao = document.getElementById("avaliacao");

estrelas.forEach((estrela) => {
    estrela.addEventListener("click", () => {
        const valor = Number(estrela.dataset.valor);

        campoAvaliacao.value = valor;

        estrelas.forEach((item) => {
            const valorItem = Number(item.dataset.valor);
            const icone = item.querySelector("i");

            if (valorItem <= valor) {
                icone.classList.remove("fa-regular");
                icone.classList.add("fa-solid");
                item.style.color = "#8b2cff";
            } else {
                icone.classList.remove("fa-solid");
                icone.classList.add("fa-regular");
                item.style.color = "#aab4c5";
            }
        });
    });
});


// CONTADOR DA MENSAGEM
const mensagem = document.getElementById("mensagem");
const contador = document.getElementById("contador");

mensagem.addEventListener("input", () => {
    contador.textContent = `${mensagem.value.length}/500`;
});
// RANGE DE SATISFAÇÃO
const satisfacao = document.getElementById("satisfacao");
const valorSatisfacao = document.getElementById("valor-satisfacao");

satisfacao.addEventListener("input", () => {
    valorSatisfacao.textContent = `${satisfacao.value}/10`;
});
// ENVIO DO FORMULÁRIO

const formularioFeedback = document.getElementById("form-feedback");

formularioFeedback.addEventListener("submit", (evento) => {
    evento.preventDefault();

    const categoria = document.getElementById("categoria").value;
    const avaliacao = document.getElementById("avaliacao").value;
    const tipoFeedback = document.querySelector(
        'input[name="tipoFeedback"]:checked'
    )?.value;
    const satisfacao = document.getElementById("satisfacao").value;
    const assunto = document.getElementById("assunto").value;
    const mensagemTexto = document.getElementById("mensagem").value;
    const retorno = document.getElementById("retorno").checked;

    const mensagemErro = document.getElementById("mensagem-erro");

if (
    !categoria ||
    !avaliacao ||
    !tipoFeedback ||
    !assunto.trim() 
) {
    mensagemErro.hidden = false;
    return;
}

mensagemErro.hidden = true;

    const feedback = {
        categoria: categoria,
        avaliacao: avaliacao,
        tipo: tipoFeedback,
        satisfacao: satisfacao,
        assunto: assunto,
        mensagem: mensagemTexto,
        retorno: retorno,
        data: new Date().toLocaleString("pt-BR")
    };

    localStorage.setItem(
        "feedbackMovaFit",
        JSON.stringify(feedback)
    );

    window.location.href = "confirmacao.html";
});