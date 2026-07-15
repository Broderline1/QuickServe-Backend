const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: process.env.NODE_ENV === 'production'
      ? { require: true, rejectUnauthorized: false }
      : false
  },
  logging: false
});

const Usuario = require('./Usuario')(sequelize);
const Mesa    = require('./Mesa')(sequelize);
const Pedido  = require('./Pedido')(sequelize);

// Relaciones
Mesa.hasMany(Pedido,    { foreignKey: 'mesa_id' });
Pedido.belongsTo(Mesa, { foreignKey: 'mesa_id' });

module.exports = { sequelize, Usuario, Mesa, Pedido };