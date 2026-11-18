# MOVA FIT

Projeto web desenvolvido como trabalho da disciplina de Front-End (UNISUAM), focado em persistência de dados, consumo de APIs externas e usabilidade.

## Sobre o projeto
O MOVA FIT é o site de uma academia fictícia. Ele tem página inicial com os planos e as unidades, cadastro, login, área do aluno, página de feedback e um menu de acessibilidade.

## Funcionalidades
- Cadastro com validação dos campos (CPF real, telefone no formato (+55)XX-XXXXXXXX, login de 6 letras e senha de 8 letras).
- Endereço preenchido pelo CEP usando a API ViaCEP (rua, bairro, cidade e UF ficam travados).
- Login e área do aluno com perfil, endereço, foto de perfil (avatares) e o plano contratado.
- Escolha do plano (Basic ou Plus) com pagamento simulado (Pix, boleto ou na recepção).
- Formulário de feedback com página de confirmação.
- Dados salvos no `localStorage`.
- Acessibilidade: tema claro/escuro e aumentar/diminuir a fonte (A+ / A-).
- Página de erro 404 e aviso de acesso restrito quando a pessoa não está logada.

## Tecnologias
- **HTML5**: estrutura das páginas (`index.html`, `cadastro.html`, `login.html`, `dashboard.html`, `feedback.html`, `confirmacao.html`, `404.html`).
- **CSS3**: estilo, temas e responsividade.
- **JavaScript**: validações, manipulação do DOM, localStorage e integração com a API ViaCEP.
