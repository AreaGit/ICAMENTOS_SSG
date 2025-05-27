const Sequelize = require('sequelize');
const db = require('./db');

const Empresas_Icamento = db.define('empresas_icamentos', {
    id: {
        type: Sequelize.INTEGER, 
        autoIncrement: true,
        primaryKey: true
    },
    nome: {
        type: Sequelize.STRING(100),
        allowNull: false
    },
    cep: {
        type: Sequelize.STRING(11),
        allowNull: false
    },
    estado: {
        type: Sequelize.STRING(50),
        allowNull: true
    },
    cidade: {
        type: Sequelize.STRING(50),
        allowNull: true
    },
    bairro: {
        type: Sequelize.STRING(50),
        allowNull: true
    },
    rua: {
        type: Sequelize.STRING(50),
        allowNull: true
    },
    numeroResidencia: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    complemento: {
        type: Sequelize.STRING(50),
        allowNull: true
    },
    razao_social: {
        type: Sequelize.STRING(150),
        allowNull: true
    },
    cnpj: {
        type: Sequelize.STRING(18),
        allowNull: true,
        unique: true
    },
    telefone: {
        type: Sequelize.STRING(50),
        allowNull: true
    },
    email: {
        type: Sequelize.STRING(100),
        allowNull: true,
        unique: true
    },
    conta_corrente: {
        type: Sequelize.STRING(50),
        allowNull: false
    },
    agencia: {
        type: Sequelize.STRING(50),
        allowNull: false
    },
    banco: {
        type: Sequelize.STRING(50),
        allowNull: false
    },
    recipientId: {
        type: Sequelize.STRING(255),
        allowNull: false
    },
    senha: {
        type: Sequelize.STRING(255),
        allowNull: true
    },
    status: {
        type: Sequelize.STRING(50),
        allowNull: false
    }
});

// CRIAR TABELA
Empresas_Icamento.sync();
//Empresas_Icamento.sync({ force: true });

module.exports = Empresas_Icamento;