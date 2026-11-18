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

const METODOS_PAGAMENTO = {
    pix: "Pix",
    boleto: "Boleto",
    recepcao: "Pagamento na recepção"
};

document.addEventListener("DOMContentLoaded", () => {
    const grade = document.getElementById("planosGrade");
    if (!grade || !localStorage.getItem("usuarioLogado")) return;

    const mensagem = document.getElementById("mensagemPlano");
    const textoCard = document.getElementById("cardPlanoTexto");
    let planoNoPagamento = "";

    function lerUsuario() {
        try { return JSON.parse(localStorage.getItem("usuarioLogado")) || {}; }
        catch (erro) { return {}; }
    }

    function salvarNoUsuario(campos) {
        const logado = Object.assign(lerUsuario(), campos);
        localStorage.setItem("usuarioLogado", JSON.stringify(logado));

        const cadastrado = JSON.parse(localStorage.getItem("usuarioCadastrado") || "null");
        if (cadastrado && cadastrado.login === logado.login) {
            localStorage.setItem("usuarioCadastrado", JSON.stringify(Object.assign(cadastrado, campos)));
        }
    }

    function planoAtual() {
        const usuario = lerUsuario();
        return PLANOS_MOVA[usuario.plano] ? usuario.plano : "";
    }

    function pagamentoAtual() {
        const usuario = lerUsuario();
        const pg = usuario.pagamento;
        return pg && pg.plano === usuario.plano ? pg : null;
    }

    function formatarReais(valor) {
        return "R$ " + valor.toFixed(2).replace(".", ",");
    }

    function avisar(html, tipo) {
        mensagem.className = "mensagem-plano" + (tipo ? " " + tipo : "");
        mensagem.innerHTML = html;
        mensagem.hidden = false;
    }

    /* ---------- Tela "Meu plano" ---------- */
    function montarCartao(chave) {
        const p = PLANOS_MOVA[chave];
        const atual = planoAtual();
        const ehAtual = chave === atual;
        const pago = pagamentoAtual();

        const itens = p.inclui.map(item => `<li><i class="fa-solid fa-check"></i> ${item}</li>`).join("")
            + p.naoInclui.map(item => `<li class="nao-inclui"><i class="fa-solid fa-minus"></i> ${item}</li>`).join("");

        let rodape;
        if (ehAtual && pago) {
            rodape = `<span class="plano-atual-selo"><i class="fa-solid fa-circle-check"></i> Seu plano atual · Pago</span>
                      <p class="plano-pagamento-info">${METODOS_PAGAMENTO[pago.metodo]} · ${pago.data}</p>`;
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
                : `Plano ${PLANOS_MOVA[atual].nome} · ${pagamentoAtual() ? "Pago" : "Aguardando pagamento"}`;
        }

        grade.querySelectorAll(".btn-pagar-plano").forEach(botao =>
            botao.addEventListener("click", () => abrirPagamento(botao.dataset.plano))
        );
    }

    function irParaPlanos() {
        window.abrirSecao("plano");
    }

    /* ---------- Tela "Pagamento" ---------- */
    const formPagamento = document.getElementById("formPagamento");
    const erroPagamento = document.getElementById("erroPagamento");

    function abrirPagamento(chave) {
        const p = PLANOS_MOVA[chave];
        planoNoPagamento = chave;

        document.getElementById("resumoPlanoNome").textContent = "Plano " + p.nome;
        document.getElementById("resumoPlanoDesc").textContent = p.descricao;
        document.getElementById("resumoValor").textContent = formatarReais(p.preco);
        document.getElementById("resumoTotal").textContent = formatarReais(p.preco);
        document.getElementById("resumoVencimento").textContent = "Todo dia " + new Date().getDate() + " de cada mês";
        document.getElementById("valorBoleto").textContent = formatarReais(p.preco);

        formPagamento.reset();
        mostrarDetalheMetodo("");
        erroPagamento.hidden = true;

        window.abrirSecao("pagamento");
        const linkPlano = document.querySelector('.menu-link[data-section="plano"]');
        if (linkPlano) linkPlano.classList.add("ativo");
    }

    function mostrarDetalheMetodo(metodo) {
        document.querySelectorAll(".detalhe-metodo").forEach(painel => {
            painel.hidden = painel.dataset.metodo !== metodo;
        });
        if (metodo === "pix") desenharQrExemplo();
    }

    function desenharQrExemplo() {
        const canvas = document.getElementById("qrExemplo");
        if (!canvas || canvas.dataset.pronto) return;
        const ctx = canvas.getContext("2d");
        const n = 25, t = canvas.width / n;
        let semente = 7;
        const aleatorio = () => (semente = (semente * 9301 + 49297) % 233280) / 233280;

        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#111118";
        for (let y = 0; y < n; y++) {
            for (let x = 0; x < n; x++) {
                if (aleatorio() > 0.5) ctx.fillRect(x * t, y * t, t, t);
            }
        }
        [[0, 0], [n - 7, 0], [0, n - 7]].forEach(([cx, cy]) => {
            ctx.fillStyle = "#ffffff"; ctx.fillRect((cx - 1) * t, (cy - 1) * t, 9 * t, 9 * t);
            ctx.fillStyle = "#111118"; ctx.fillRect(cx * t, cy * t, 7 * t, 7 * t);
            ctx.fillStyle = "#ffffff"; ctx.fillRect((cx + 1) * t, (cy + 1) * t, 5 * t, 5 * t);
            ctx.fillStyle = "#111118"; ctx.fillRect((cx + 2) * t, (cy + 2) * t, 3 * t, 3 * t);
        });
        canvas.dataset.pronto = "1";
    }

    formPagamento.querySelectorAll('input[name="metodo"]').forEach(radio =>
        radio.addEventListener("change", () => {
            erroPagamento.hidden = true;
            mostrarDetalheMetodo(radio.value);
        })
    );

    // Botão "Copiar código" do Pix
    document.getElementById("btnCopiarPix").addEventListener("click", (e) => {
        const codigo = document.getElementById("codigoPix").textContent;
        const botao = e.currentTarget;
        const pronto = () => { botao.innerHTML = '<i class="fa-solid fa-check"></i> Copiado!'; };
        if (navigator.clipboard) navigator.clipboard.writeText(codigo).then(pronto).catch(pronto);
        else pronto();
    });

    document.getElementById("btnVoltarPlanos").addEventListener("click", irParaPlanos);

    formPagamento.addEventListener("submit", (e) => {
        e.preventDefault();
        const marcado = formPagamento.querySelector('input[name="metodo"]:checked');
        if (!marcado) {
            erroPagamento.hidden = false;
            return;
        }

        const p = PLANOS_MOVA[planoNoPagamento];
        salvarNoUsuario({
            plano: planoNoPagamento,
            pagamento: {
                plano: planoNoPagamento,
                metodo: marcado.value,
                valor: p.preco,
                data: new Date().toLocaleDateString("pt-BR"),
                status: "confirmado (simulado)"
            }
        });

        desenharPlanos();
        irParaPlanos();
        avisar(`<i class="fa-solid fa-circle-check"></i><span>Pagamento confirmado! Seu plano <strong>${p.nome}</strong> está ativo. Bons treinos!</span>`, "sucesso");
    });

    document.querySelectorAll('[data-section="plano"]').forEach(botao =>
        botao.addEventListener("click", () => { mensagem.hidden = true; })
    );

    desenharPlanos();

    const planoPedido = new URLSearchParams(window.location.search).get("plano");
    if (PLANOS_MOVA[planoPedido]) {
        history.replaceState(null, "", "dashboard.html");
        if (planoPedido === planoAtual() && pagamentoAtual()) {
            irParaPlanos();
            avisar(`<i class="fa-solid fa-circle-check"></i><span>Seu plano <strong>${PLANOS_MOVA[planoPedido].nome}</strong> já está ativo e pago.</span>`, "sucesso");
        } else {
            abrirPagamento(planoPedido);
        }
    }
});
