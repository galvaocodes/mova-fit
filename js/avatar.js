const AVATARES_MOVA = Array.from({ length: 12 }, (_, i) =>
    `assets/avatares/avatar-${String(i + 1).padStart(2, "0")}.jpg`
);

// Lê o usuário logado
function lerUsuarioAvatar() {
    return JSON.parse(localStorage.getItem("usuarioLogado"));
}

// Salva o avatar no usuário logado e no cadastro
function salvarAvatar(avatar) {
    const logado = lerUsuarioAvatar();
    const cadastrado = JSON.parse(localStorage.getItem("usuarioCadastrado"));

    logado.avatar = avatar;
    localStorage.setItem("usuarioLogado", JSON.stringify(logado));

    if (cadastrado && cadastrado.login === logado.login) {
        cadastrado.avatar = avatar;
        localStorage.setItem("usuarioCadastrado", JSON.stringify(cadastrado));
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
        salvarAvatar(avatar);
        atualizarAvatares();
        marcarSelecionado();
        mostrarMensagem(textoSucesso, "sucesso");
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
