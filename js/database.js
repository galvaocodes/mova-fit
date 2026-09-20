// ==========================================
// BANCO DE DADOS - PROJETO FRONT-END
// Armazenamento utilizando localStorage
// ==========================================


// ------------------------------------------
// CHAVES DO BANCO
// ------------------------------------------

const CHAVE_USUARIOS = "usuarios";
const CHAVE_FEEDBACKS = "feedbacks";
const CHAVE_USUARIO_LOGADO = "usuarioLogado";


// ------------------------------------------
// USUÁRIOS
// ------------------------------------------

// Retorna todos os usuários cadastrados
function obterUsuarios() {
    const dados = localStorage.getItem(CHAVE_USUARIOS);

    if (!dados) {
        return [];
    }

    return JSON.parse(dados);
}


// Salva a lista de usuários
function salvarUsuarios(usuarios) {
    localStorage.setItem(
        CHAVE_USUARIOS,
        JSON.stringify(usuarios)
    );
}


// Cadastra um novo usuário
function cadastrarUsuario(usuario) {
    const usuarios = obterUsuarios();

    // Verifica se o login já existe
    const usuarioExistente = usuarios.find(
        u => u.login === usuario.login
    );

    if (usuarioExistente) {
        return {
            sucesso: false,
            mensagem: "Este login já está cadastrado."
        };
    }

    // Cria um ID para o usuário
    usuario.id = Date.now();

    usuarios.push(usuario);

    salvarUsuarios(usuarios);

    return {
        sucesso: true,
        mensagem: "Usuário cadastrado com sucesso."
    };
}


// Busca um usuário pelo login
function buscarUsuario(login) {
    const usuarios = obterUsuarios();

    return usuarios.find(
        usuario => usuario.login === login
    );
}


// ------------------------------------------
// LOGIN
// ------------------------------------------

// Verifica login e senha
function realizarLogin(login, senha) {
    const usuario = buscarUsuario(login);

    if (!usuario) {
        return {
            sucesso: false,
            mensagem: "Usuário não encontrado."
        };
    }

    if (usuario.senha !== senha) {
        return {
            sucesso: false,
            mensagem: "Senha incorreta."
        };
    }

    // Salva o usuário logado
    localStorage.setItem(
        CHAVE_USUARIO_LOGADO,
        JSON.stringify(usuario)
    );

    return {
        sucesso: true,
        mensagem: "Login realizado com sucesso.",
        usuario: usuario
    };
}


// Retorna o usuário que está logado
function obterUsuarioLogado() {
    const dados = localStorage.getItem(CHAVE_USUARIO_LOGADO);

    if (!dados) {
        return null;
    }

    return JSON.parse(dados);
}


// Faz logout
function realizarLogout() {
    localStorage.removeItem(CHAVE_USUARIO_LOGADO);
}


// ------------------------------------------
// FEEDBACK
// ------------------------------------------

// Retorna todos os feedbacks
function obterFeedbacks() {
    const dados = localStorage.getItem(CHAVE_FEEDBACKS);

    if (!dados) {
        return [];
    }

    return JSON.parse(dados);
}


// Salva um feedback
function salvarFeedback(feedback) {
    const feedbacks = obterFeedbacks();

    feedback.id = Date.now();

    feedbacks.push(feedback);

    localStorage.setItem(
        CHAVE_FEEDBACKS,
        JSON.stringify(feedbacks)
    );

    return {
        sucesso: true,
        mensagem: "Feedback salvo com sucesso."
    };
}


// Busca os feedbacks de um usuário
function obterFeedbacksDoUsuario(usuarioId) {
    const feedbacks = obterFeedbacks();

    return feedbacks.filter(
        feedback => feedback.usuarioId === usuarioId
    );
}