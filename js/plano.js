const PLANOS_MOVA = {
    basic: {
        nome: "Basic",
        preco: 79,
        descricao: "O essencial para começar a sua rotina de treinos.",
        inclui: ["Acesso à área de musculação", "Treino em 1 unidade à escolha"],
        naoInclui: ["Aulas coletivas"]
    },
    plus: {
        nome: "Plus",
        preco: 119,
        descricao: "Acesso total para resultados máximos.",
        inclui: ["Musculação e Cardio livres", "Acesso a todas as unidades", "Todas as aulas coletivas inclusas"],
        naoInclui: [],
        recomendado: true
    }
};

document.addEventListener("DOMContentLoaded", () => {
    const grade = document.getElementById("planosGrade");
    if (!grade || !localStorage.getItem("usuarioLogado")) return;

    const mensagem = document.getElementById("mensagemPlano");
    const textoCard = document.getElementById("cardPlanoTexto");

    function lerUsuario() {
        return JSON.parse(localStorage.getItem("usuarioLogado"));
    }

    // Salva no usuário logado e também no cadastro
    function salvarNoUsuario(campos) {
        const logado = Object.assign(lerUsuario(), campos);
        localStorage.setItem("usuarioLogado", JSON.stringify(logado));

        const cadastrado = JSON.parse(localStorage.getItem("usuarioCadastrado"));
        if (cadastrado && cadastrado.login === logado.login) {
            localStorage.setItem("usuarioCadastrado", JSON.stringify(Object.assign(cadastrado, campos)));
        }
    }

    function planoAtual() {
        const usuario = lerUsuario();
        return PLANOS_MOVA[usuario.plano] ? usuario.plano : "";
    }

    function planoPago() {
        const usuario = lerUsuario();
        const pg = usuario.pagamento;
        return pg && pg.plano === usuario.plano ? pg : null;
    }

    function avisar(html, tipo) {
        mensagem.className = "mensagem-plano" + (tipo ? " " + tipo : "");
        mensagem.innerHTML = html;
        mensagem.hidden = false;
    }

    // Monta o cartão de cada plano
    function montarCartao(chave) {
        const p = PLANOS_MOVA[chave];
        const atual = planoAtual();
        const ehAtual = chave === atual;
        const pago = planoPago();

        const itens = p.inclui.map(item => `<li><i class="fa-solid fa-check"></i> ${item}</li>`).join("")
            + p.naoInclui.map(item => `<li class="nao-inclui"><i class="fa-solid fa-minus"></i> ${item}</li>`).join("");

        let rodape;
        if (ehAtual && pago) {
            rodape = `<span class="plano-atual-selo"><i class="fa-solid fa-circle-check"></i> Seu plano atual · Pago</span>
                      <p class="plano-pagamento-info">Ativo desde ${pago.data}</p>`;
        } else if (ehAtual) {
            rodape = `<span class="plano-pendente-selo"><i class="fa-solid fa-clock"></i> Aguardando pagamento</span>
                      <button type="button" class="btn-principal btn-pagar-plano" data-plano="${chave}">Pagar mensalidade</button>`;
        } else {
            rodape = `<button type="button" class="btn-principal btn-pagar-plano" data-plano="${chave}">${atual ? "Trocar para " : "Contratar "}${p.nome}</button>`;
        }

        return `
            <article class="plano-cartao${ehAtual ? " atual" : ""}" data-cartao="${chave}">
                ${p.recomendado ? '<span class="plano-recomendado">Recomendado</span>' : ""}
                <h2>${p.nome}</h2>
                <div class="plano-preco">R$ ${p.preco}<span>/mês</span></div>
                <p class="plano-descricao">${p.descricao}</p>
                <ul class="plano-lista">${itens}</ul>
                <div class="plano-rodape">${rodape}</div>
            </article>`;
    }

    function desenharPlanos() {
        grade.innerHTML = Object.keys(PLANOS_MOVA).map(montarCartao).join("");

        const atual = planoAtual();
        if (textoCard) {
            textoCard.textContent = !atual
                ? "Você ainda não escolheu um plano."
                : `Plano ${PLANOS_MOVA[atual].nome} · ${planoPago() ? "Pago" : "Aguardando pagamento"}`;
        }

        grade.querySelectorAll(".btn-pagar-plano").forEach(botao =>
            botao.addEventListener("click", () => ativarPlano(botao.dataset.plano))
        );
    }

    // Ao clicar, o plano já fica ativo e pago
    function ativarPlano(chave) {
        salvarNoUsuario({
            plano: chave,
            pagamento: { plano: chave, data: new Date().toLocaleDateString("pt-BR") }
        });
        desenharPlanos();
        avisar(`<i class="fa-solid fa-circle-check"></i><span>Pronto! Seu plano <strong>${PLANOS_MOVA[chave].nome}</strong> está ativo e pago. Bons treinos!</span>`, "sucesso");
    }

    document.querySelectorAll('[data-section="plano"]').forEach(botao =>
        botao.addEventListener("click", () => { mensagem.hidden = true; })
    );

    desenharPlanos();

    // Veio da página inicial com um plano escolhido (?plano=)
    const planoPedido = new URLSearchParams(window.location.search).get("plano");
    if (PLANOS_MOVA[planoPedido]) {
        history.replaceState(null, "", "dashboard.html");
        window.abrirSecao("plano");
        if (planoPedido === planoAtual() && planoPago()) {
            avisar(`<i class="fa-solid fa-circle-check"></i><span>Seu plano <strong>${PLANOS_MOVA[planoPedido].nome}</strong> já está ativo e pago.</span>`, "sucesso");
        }
    }
});
