const { DataTypes } = require('sequelize');

module.exports = (sequelize) => sequelize.define('Pedido', {
  mesa_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  platillo: {
    type: DataTypes.STRING,
    allowNull: false
  },
  estado: {
    type: DataTypes.ENUM('pendiente', 'en_preparacion', 'listo', 'entregado'),
    defaultValue: 'pendiente'
  },
  creado_en: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'pedidos',
  timestamps: false
});