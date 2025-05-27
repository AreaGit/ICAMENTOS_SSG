const Sequelize = require('sequelize');
const db = require('./db');
const Empresas = require('./Empresas');

const Usuarios_Autorizados = db.define('usuarios_autorizados', {
    id: {
        type: Sequelize.INTEGER, 
        autoIncrement: true,
        primaryKey: true
    },
    empresa_id: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    nome: {
        type: Sequelize.STRING(100),
        allowNull: false
    },
    email: {
        type: Sequelize.STRING(100),
        allowNull: false
    },
    telefone: {
        type: Sequelize.STRING(100),
        allowNull: false
    },
    senha: {
        type: Sequelize.STRING(255),
        allowNull: false
    },
    ativo: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
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

// Associações
Empresas.hasMany(Usuarios_Autorizados, {
    foreignKey: 'empresa_id',
    onDelete: 'CASCADE'
});

Usuarios_Autorizados.belongsTo(Empresas, {
    foreignKey: 'empresa_id',
    onDelete: 'CASCADE'
});

// CRIAR TABELA
Usuarios_Autorizados.sync();
//Usuarios_Autorizados.sync({ force: true });

module.exports = Usuarios_Autorizados;