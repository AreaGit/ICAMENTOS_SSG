const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const Empresas = require('../models/Empresas');
const Usuarios_Autorizados = require('../models/Usuarios_Autorizados');
const { client, sendMessage } = require('./api/whatsapp-web');
client.on('ready', () => {
  console.log('Cliente WhatsApp pronto para uso no admin.js');
});
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const { Op } = require('sequelize');
const Empresas_Icamento = require('../models/Empresas_Icamento');
const Chamados = require('../models/Chamados');
const Sequelize = require('sequelize');

// Funções
async function enviarNotificacaoWhatsapp(destinatario, corpo) {
  try {
      const response = await sendMessage(destinatario, corpo);
      console.log(`Mensagem de código de verificação enviada com sucesso para o cliente ${destinatario}:`, response);
      return response;
  } catch (error) {
      console.error(`Erro ao enviar mensagem para o cliente ${destinatario}:`, error);
      throw error;
  }
}

async function enviarEmailNotificacao(destinatario, assunto, corpo) {
  const transporter = nodemailer.createTransport({
    host: 'email-ssl.com.br',  // Servidor SMTP da LocalWeb
    port: 465,                 // Porta para SSL (465)
    secure: true,              // Usar conexão segura (SSL)
    auth: {
      user: 'atendimento@areapromocional.com.br',  // E-mail que você vai usar para enviar
      pass: 'Z1mb@bue',                    // Senha do e-mail
    },
  })

  const info = await transporter.sendMail({
    from: 'atendimento@areapromocional.com.br',
    to: destinatario,
    subject: assunto,
    html: corpo,
  });

  console.log('E-mail enviado:', info);
}

// Rotas

// Buscar empresa por ID
app.get('/empresa/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const empresa = await Empresas_Icamento.findByPk(id);

    if (!empresa) {
      return res.status(404).json({ message: 'Empresa não encontrada' });
    }

    res.json(empresa);
  } catch (error) {
    console.error('Erro ao buscar empresa por ID:', error);
    res.status(500).json({ message: 'Erro ao buscar empresa' });
  }
});

// Buscar assistencia por ID
app.get('/assistencia/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const empresa = await Empresas_Icamento.findByPk(id);

    if (!empresa) {
      return res.status(404).json({ message: 'Empresa não encontrada' });
    }

    res.json(empresa);
  } catch (error) {
    console.error('Erro ao buscar empresa por ID:', error);
    res.status(500).json({ message: 'Erro ao buscar empresa' });
  }
});

app.post('/empresa/salvar', async (req, res) => {
  try {
    const {
      id,
      nome,
      cnpj,
      email,
      telefone,
      endereco,
      cidade,
      estado,
      cep
    } = req.body;

    const dados = {
      nome,
      cnpj,
      email,
      telefone,
      endereco,
      cidade,
      estado,
      cep
    };

    let empresa;
    if (id) {
      empresa = await Empresas.findByPk(id);
      if (!empresa) return res.status(404).json({ message: 'Empresa não encontrada' });
      await empresa.update(dados);
    } else {
      empresa = await Empresas.create(dados);
    }

    res.json({ message: 'Empresa salva com sucesso', empresa });

  } catch (error) {
    console.error('Erro ao salvar empresa:', error);
    res.status(500).json({ message: 'Erro ao salvar empresa' });
  }
});

app.post('/assistencia/salvar', async (req, res) => {
  try {
    const {
      id,
      nome,
      cnpj,
      email,
      telefone,
      endereco,
      cidade,
      estado,
      cep
    } = req.body;

    const dados = {
      nome,
      cnpj,
      email,
      telefone,
      endereco,
      cidade,
      estado,
      cep
    };

    let empresa;
    if (id) {
      empresa = await Empresas_Icamento.findByPk(id);
      if (!empresa) return res.status(404).json({ message: 'Empresa não encontrada' });
      await empresa.update(dados);
    } else {
      empresa = await Empresas_Icamento.create(dados);
    }

    res.json({ message: 'Empresa salva com sucesso', empresa });

  } catch (error) {
    console.error('Erro ao salvar empresa:', error);
    res.status(500).json({ message: 'Erro ao salvar empresa' });
  }
});

app.get('/all-empresas', async (req, res) => {
  try {
    const empresas = await Empresas.findAll({
      attributes: {
        exclude: ['senha', 'reset_token', 'reset_token_expiration', 'createdAt', 'updatedAt']
      }
    });
    res.json(empresas);
  } catch (error) {
    console.error('Erro ao listar empresas:', error);
    res.status(500).json({ message: 'Erro ao listar empresas' });
  }
});

app.get('/all-assistencias', async (req, res) => {
  try {
    const assistencias = await Empresas_Icamento.findAll({
      attributes: {
        exclude: ['senha', 'createdAt', 'updatedAt']
      }
    });
    res.json(assistencias);
  } catch (error) {
    console.error('Erro ao listar assistencias:', error);
    res.status(500).json({ message: 'Erro ao listar assistencias' });
  }
});

app.get('/all-chamados', async (req, res) => {
  try {
    const { status, dataInicio, dataFim } = req.query;

    const where = {};
    if (status) where.status = status;
    if (dataInicio && dataFim) {
      where.data_agenda = {
        [Sequelize.Op.between]: [dataInicio, dataFim]
      };
    } else if (dataInicio) {
      where.data_agenda = { [Sequelize.Op.gte]: dataInicio };
    } else if (dataFim) {
      where.data_agenda = { [Sequelize.Op.lte]: dataFim };
    }

    const chamados = await Chamados.findAll({
      where,
      attributes: { exclude: ['createdAt', 'updatedAt'] }
    });

    res.json(chamados);
  } catch (error) {
    console.error('Erro ao listar chamados com filtros:', error);
    res.status(500).json({ message: 'Erro ao listar chamados' });
  }
});

app.put('/chamados/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const chamado = await Chamados.findByPk(id);
    if (!chamado) {
      return res.status(404).json({ message: 'Chamado não encontrado' });
    }

    chamado.status = status;
    await chamado.save();

    res.json({ message: 'Status atualizado com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar status do chamado:', error);
    res.status(500).json({ message: 'Erro ao atualizar status' });
  }
});

module.exports = app;