const AVATARES_MOVA = Array.from({ length: 12 }, (_, i) =>
    `assets/avatares/avatar-${String(i + 1).padStart(2, "0")}.jpg`
);

function lerUsuarioAvatar() {
    for (const chave of ["usuarioLogado", "usuarioCadastrado"]) {
        try {
            const dados = JSON.parse(localStorage.getItem(chave));
            if (dados && typeof dados === "object") return dados;
        } catch (erro) { /* ignora JSON inválido */ }
    }
    return null;
}

function salvarAvatar(avatar) {
    const logado = lerUsuarioAvatar();
    for (const chave of ["usuarioLogado", "usuarioCadastrado"]) {
        let dados = null;
        try { dados = JSON.parse(localStorage.getItem(chave)); } catch (erro) { dados = null; }
        if (!dados) continue;
        if (chave === "usuarioCadastrado" && logado && dados.login !== logado.login) continue;

        if (avatar) dados.avatar = avatar;
        else delete dados.avatar;
        localStorage.setItem(chave, JSON.stringify(dados));
    }
}

function desenharAvatar(elemento, avatar, iconePadrao) {
    if (!elemento) return;
    elemento.innerHTML = "";
    if (avatar) {
        const img = document.createElement("img");
        img.src = avatar;
        img.alt = "Foto de perfil";
        img.onerror = () => desenharAvatar(elemento, "", iconePadrao);
        elemento.appendChild(img);
    } else {
        const icone = document.createElement("i");
        icone.className = iconePadrao;
        elemento.appendChild(icone);
    }
}

function atualizarAvatares() {
    const usuario = lerUsuarioAvatar();
    const avatar = usuario && usuario.avatar ? usuario.avatar : "";
    desenharAvatar(document.getElementById("avatarMini"), avatar, "fa-solid fa-circle-user");
    desenharAvatar(document.getElementById("avatarPerfil"), avatar, "fa-solid fa-user");
}

document.addEventListener("DOMContentLoaded", () => {
    atualizarAvatares();

    // A janela de escolha só existe no Dashboard
    const modal = document.getElementById("modalFoto");
    if (!modal) return;

    const grade = document.getElementById("gradeAvatares");
    const mensagem = document.getElementById("mensagemFoto");

    function mostrarMensagem(texto, tipo) {
        mensagem.textContent = texto;
        mensagem.className = "mensagem-foto" + (tipo ? " " + tipo : "");
    }

    function marcarSelecionado() {
        const usuario = lerUsuarioAvatar();
        const atual = usuario && usuario.avatar ? usuario.avatar : "";
        grade.querySelectorAll(".opcao-avatar").forEach(botao => {
            botao.classList.toggle("selecionado", botao.dataset.avatar === atual);
        });
    }

    function escolher(avatar, textoSucesso) {
        try {
            salvarAvatar(avatar);
            atualizarAvatares();
            marcarSelecionado();
            mostrarMensagem(textoSucesso, "sucesso");
        } catch (erro) {
            mostrarMensagem("Não foi possível salvar a foto. Tente de novo.", "erro");
        }
    }

    // Monta a grade de avatares
    AVATARES_MOVA.forEach((caminho, indice) => {
        const botao = document.createElement("button");
        botao.type = "button";
        botao.className = "opcao-avatar";
        botao.dataset.avatar = caminho;
        botao.setAttribute("aria-label", "Avatar " + (indice + 1));
        botao.innerHTML = `<img src="${caminho}" alt="">`;
        botao.addEventListener("click", () => escolher(caminho, "Foto atualizada!"));
        grade.appendChild(botao);
    });

    function abrirModal() {
        mostrarMensagem("", "");
        marcarSelecionado();
        modal.hidden = false;
        document.body.classList.add("modal-aberto");
        modal.querySelector(".modal-foto-fechar").focus();
    }

    function fecharModal() {
        modal.hidden = true;
        document.body.classList.remove("modal-aberto");
    }

    document.getElementById("btnTrocarFoto").addEventListener("click", abrirModal);
    document.getElementById("btnTrocarFotoTexto").addEventListener("click", abrirModal);
    modal.querySelectorAll("[data-fechar-modal]").forEach(el => el.addEventListener("click", fecharModal));
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && !modal.hidden) fecharModal();
    });

    document.getElementById("btnRemoverFoto").addEventListener("click", () => {
        escolher("", "Foto removida.");
    });
});
