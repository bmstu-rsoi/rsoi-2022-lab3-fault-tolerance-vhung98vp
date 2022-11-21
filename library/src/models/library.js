const Sequelize = require('sequelize');
const db = require('../database');

const Library = db.define('library',{
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  library_uid: {
    type: Sequelize.UUID,
    allowNull: false,
    unique: true
  },
  name: {
    type: Sequelize.STRING(80),
    allowNull: false
  },
  city: {
    type: Sequelize.STRING(255),
    allowNull: false
  },
  address: {
    type: Sequelize.STRING(255),
    allowNull: false
  }
});
module.exports = Library;
  