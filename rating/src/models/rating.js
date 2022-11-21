const Sequelize = require('sequelize');
const db = require('../database');

const Rating = db.define('rating',{
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  username: {
    type: Sequelize.STRING(80),
    allowNull: false,
  },
  stars: {
    type: Sequelize.INTEGER,
    allowNull: false,
    validate: {
      min: 0,
      max: 100
    }
  }
});
module.exports = Rating;
  