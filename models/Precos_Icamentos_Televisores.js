const Sequelize = require('sequelize');
const db = require('./db');

const Precos_Icamentos_Televisores = db.define('precos_icamentos_televisores', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    uf: {
        type: Sequelize.CHAR(2),
        allowNull: false
    },
    local: {
        type: Sequelize.ENUM('CAPITAL', 'INTERIOR'),
        allowNull: false
    },
    regiao: {
        type: Sequelize.ENUM('NORTE', 'NORDESTE', 'CENTRO-OESTE', 'SUDESTE', 'SUL'),
        allowNull: false
    },
    icamento_para_instalacao: {
        type: Sequelize.STRING(50)
    },
    icamento_para_descida: {
        type: Sequelize.STRING(50)
    },
    art: {
        type: Sequelize.STRING(50)
    },
    vt: {
        type: Sequelize.STRING(50)
    },
    no_show: {
        type: Sequelize.STRING(50)
    },
});

// CRIAR TABELA
Precos_Icamentos_Televisores.sync();
//Precos_Icamentos_Televisores.sync({ force: true });

module.exports = Precos_Icamentos_Televisores