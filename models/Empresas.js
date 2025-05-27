const Sequelize = require('sequelize');
const db = require('./db');

const Empresas = db.define('empresas', {
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
    senha: {
        type: Sequelize.STRING(255),
        allowNull: true
    },
    reset_token: {
        type: Sequelize.STRING(255),
        allowNull: true
    },
    reset_token_expiration: {
        type: Sequelize.DATE,
        allowNull: true
    }
});

// CRIAR TABELA
Empresas.sync();
//Empresas.sync({ force: true });

module.exports = Empresas;