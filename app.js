const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;
const cadastros = require('./routes/cadastros.js'); 
const admin = require('./routes/admin.js'); 
const chamados = require('./routes/chamados.js');
const empresasIcamentos = require('./routes/empresasIcamentos.js');
const Empresas = require('./models/Empresas');
const Usuarios_Autorizados = require('./models/Usuarios_Autorizados');
const Empresas_Icamento = require('./models/Empresas_Icamento');
const Chamados = require('./models/Chamados.js');
const Chamados_Finalizados = require('./models/Chamados_Finalizados.js');
const Precos_Icamentos_Televisores = require('./models/Precos_Icamentos_Televisores.js');
const Precos_Icamentos_Geladeiras = require('./models/Precos_Icamentos_Geladeiras.js');

// Middlewares
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/', cadastros);
app.use('/', admin);
app.use('/', chamados);
app.use('/', empresasIcamentos);

// Rotas
app.get('/', (req, res) => {
    try {
        const html = fs.readFileSync(path.join(__dirname, './public/html/login.html'), 'utf8');
        res.send(html);
    } catch (error) {
        console.error('Erro ao carregar o login.html:', error);
        res.status(500).send('Erro interno no servidor.');
    }
});

app.get('/cadastro-cliente', (req, res) => {
    try {
        const cadastroHtmlContent = fs.readFileSync(path.join(__dirname, './public/html/cadastro-cliente.html'), 'utf-8');
        res.send(cadastroHtmlContent);
    } catch (error) {
        console.error('Erro ao carregar o cadastro-cliente.html:', error);
        res.status(500).send('Erro interno no servidor.');
    }
});

app.get('/cadastro-usuarios-autorizados', (req, res) => {
    try {
        const cadastroHtmlContent = fs.readFileSync(path.join(__dirname, './public/html/cadastro-usuarios-autorizados.html'), 'utf-8');
        res.send(cadastroHtmlContent);
    } catch (error) {
        console.error('Erro ao carregar o cadastro-usuarios-autorizados.html:', error);
        res.status(500).send('Erro interno no servidor.');
    }
});


app.get('/dashboard', (req, res) => {
    try {
        const dashboardHtmlContent = fs.readFileSync(path.join(__dirname, './public/html/dashboard.html'), 'utf8');
        res.send(dashboardHtmlContent)
    } catch (error) {
        console.error('Erro ao carregar o dashboard.html:', error);
        res.status(500).send('Erro interno no servidor.');
    }
});

app.get('/novo-chamado', (req, res) => {
    try {
        const novoChamadoHtmlContent = fs.readFileSync(path.join(__dirname, './public/html/novo-chamado.html'), 'utf8');
        res.send(novoChamadoHtmlContent)
    } catch (error) {
        console.error('Erro ao carregar o novo-chamado.html:', error);
        res.status(500).send('Erro interno no servidor.');
    }
});

app.get('/chamado-detalhes', (req, res) => {
    try {
        const detalhesChamadoHtmlContent = fs.readFileSync(path.join(__dirname, './public/html/chamado-detalhes.html'), 'utf8');
        res.send(detalhesChamadoHtmlContent)
    } catch (error) {
        console.error('Erro ao carregar o chamado-detalhes.html:', error);
        res.status(500).send('Erro interno no servidor.');
    }
});

app.get('/esqueci-senha', (req, res) => {
    try {
        const esqueciSenhaHtmlContent = fs.readFileSync(path.join(__dirname, './public/html/esqueci-senha.html'), 'utf8');
        res.send(esqueciSenhaHtmlContent);
    } catch (error) {
        console.error('Erro ao carregar o esqueci-senha.html:', error);
        res.status(500).send('Erro interno no servidor.');
    }
});

app.get('/redefinir-senha', (req, res) => {
    try {
        const redefinirSenhaHtmlContent = fs.readFileSync(path.join(__dirname, './public/html/resetar-senha.html'), 'utf8');
        res.send(redefinirSenhaHtmlContent);
    } catch (error) {
        console.error('Erro ao carregar o resetar-senha.html:', error);
        res.status(500).send('Erro interno no servidor.');
    }
});

app.get('/administradores/painel', (req, res) => {
    try {
        const redefinirSenhaHtmlContent = fs.readFileSync(path.join(__dirname, './public/html/admin/painel.html'), 'utf8');
        res.send(redefinirSenhaHtmlContent);
    } catch (error) {
        console.error('Erro ao carregar o painel:', error);
        res.status(500).send('Erro interno no servidor.');
    }
});

app.get('/administradores/dados-empresa', (req, res) => {
    try {
        const dadosHtmlContent = fs.readFileSync(path.join(__dirname, './public/html/admin/dados-empresa.html'), 'utf8');
        res.send(dadosHtmlContent);
    } catch (error) {
        console.error('Erro ao carregar o dados-empresa:', error);
        res.status(500).send('Erro interno no servidor.');
    }
});

app.get('/administradores/dados-assistencia', (req, res) => {
    try {
        const dadosHtmlContent = fs.readFileSync(path.join(__dirname, './public/html/admin/dados-assistencia.html'), 'utf8');
        res.send(dadosHtmlContent);
    } catch (error) {
        console.error('Erro ao carregar o dados-assistencia:', error);
        res.status(500).send('Erro interno no servidor.');
    }
});

app.get('/cadastro-empresas-icamento', (req, res) => {
    try {
        const icamentoHtmlContent = fs.readFileSync(path.join(__dirname, './public/html/cadastro-empresas-icamento.html'), 'utf8');
        res.send(icamentoHtmlContent);
    } catch (error) {
        console.error('Erro ao carregar o cadastro-empresas-icamento:', error);
        res.status(500).send('Erro interno no servidor.');
    }
});

app.get('/download/:filename', (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(__dirname, 'uploads', filename);

  res.download(filePath, filename, (err) => {
    if (err) {
      console.error('Erro ao fazer download:', err);
      res.status(404).json({ message: 'Arquivo não encontrado' });
    }
  });
});

app.get('/empresas-icamento/login', (req, res) => {
    try {
        const loginHtmlContent = fs.readFileSync(path.join(__dirname, './public/html/empresas-icamento/login.html'), 'utf8');
        res.send(loginHtmlContent);
    } catch (error) {
        console.error('Erro ao carregar o login:', error);
        res.status(500).send('Erro interno no servidor.');
    }
});

app.get('/empresas-icamento/painel', (req, res) => {
    try {
        const painelHtmlContent = fs.readFileSync(path.join(__dirname, './public/html/empresas-icamento/painel.html'), 'utf8');
        res.send(painelHtmlContent);
    } catch (error) {
        console.error('Erro ao carregar o painel:', error);
        res.status(500).send('Erro interno no servidor.');
    }
});

app.get('/empresas-icamento/chamado', (req, res) => {
    try {
        const painelHtmlContent = fs.readFileSync(path.join(__dirname, './public/html/empresas-icamento/detalhes-chamado.html'), 'utf8');
        res.send(painelHtmlContent);
    } catch (error) {
        console.error('Erro ao carregar o painel:', error);
        res.status(500).send('Erro interno no servidor.');
    }
});

// Inicialização do servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});