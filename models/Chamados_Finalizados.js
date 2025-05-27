const Sequelize = require('sequelize');
const db = require('./db');
const Chamados = require('./Chamados');

const Chamados_Finalizados = db.define('chamados_finalizados', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    chamado_id: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    horario_finalizacao: {
        type: Sequelize.STRING(255),
        allowNull: false
    },
    observacoes: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    caminho: {
        type: Sequelize.STRING(255),
        allowNull: false
    }
});

// Associações
Chamados.hasMany(Chamados_Finalizados, {
    foreignKey: 'id',
    onDelete: 'CASCADE'
});

Chamados_Finalizados.belongsTo(Chamados, {
    foreignKey: 'id',
    onDelete: 'CASCADE'
});

// CRIAR TABELA
Chamados_Finalizados.sync();
//Chamados_Finalizados.sync({ force:true });

module.exports = Chamados_Finalizados;