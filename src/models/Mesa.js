const { DataTypes } = require('sequelize');

module.exports = (sequelize) => sequelize.define('Mesa', {
  numero: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true
  },
  estado: {
    type: DataTypes.ENUM('disponible', 'ocupada', 'esperando_cuenta'),
    defaultValue: 'disponible'
  }
}, {
  tableName: 'mesas',
  timestamps: false
});