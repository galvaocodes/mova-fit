/* ========================================
   FEEDBACK | MOVA FIT (LÓGICA)
======================================== */

document.addEventListener("DOMContentLoaded", () => {
    
    // 1. CARREGAR NOME DO USUÁRIO NO HEADER
    const usuarioLogadoJSON = localStorage.getItem("usuarioCadastrado");
    if (usuarioLogadoJSON) {
        const usuario = JSON.parse(usuarioLogadoJSON);
        const primeiroNome = String(usuario.nome || usuario.login || "Usuário").split(" ")[0];
        const spanNome = document.getElementById("nomeUsuario");
        if(spanNome) spanNome.textContent = primeiroNome;
    }

    // 2. SISTEMA DE ESTRELAS
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
                } else {
                    icone.classList.remove("fa-solid");
                    icone.classList.add("fa-regular");
                }
            });
        });
    });

    // 3. CONTADOR DA MENSAGEM
    const mensagem = document.getElementById("mensagem");
    const contador = document.getElementById("contador");

    if(mensagem && contador) {
        mensagem.addEventListener("input", () => {
            contador.textContent = `${mensagem.value.length}/500`;
        });
    }

    // 4. RANGE DE SATISFAÇÃO
    const satisfacao = document.getElementById("satisfacao");
    const valorSatisfacao = document.getElementById("valor-satisfacao");

    if(satisfacao && valorSatisfacao) {
        satisfacao.addEventListener("input", () => {
            valorSatisfacao.textContent = `${satisfacao.value}/10`;
        });
    }

    // 5. ENVIO DO FORMULÁRIO (SALVA NO LOCALSTORAGE E REDIRECIONA)
    const formularioFeedback = document.getElementById("form-feedback");

    if(formularioFeedback) {
        formularioFeedback.addEventListener("submit", (evento) => {
            evento.preventDefault();

            const categoria = document.getElementById("categoria").value;
            const avaliacao = document.getElementById("avaliacao").value;
            const tipoFeedback = document.querySelector('input[name="tipoFeedback"]:checked')?.value;
            const satisfacao = document.getElementById("satisfacao").value;
            const assunto = document.getElementById("assunto").value;
            const mensagemTexto = document.getElementById("mensagem").value;
            const retorno = document.getElementById("retorno").checked;

            const mensagemErro = document.getElementById("mensagem-erro");

            // Validação
            if (!categoria || !avaliacao || !tipoFeedback || !assunto.trim()) {
                mensagemErro.hidden = false;
                window.scrollTo({ top: 0, behavior: "smooth" }); // Sobe a tela para o cliente ver o erro
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

            // Guarda os dados que serão exibidos na tela de Confirmação (Exigência do PDF)
            localStorage.setItem("feedbackMovaFit", JSON.stringify(feedback));

            // Redireciona
            window.location.href = "confirmacao.html";
        });
    }
});