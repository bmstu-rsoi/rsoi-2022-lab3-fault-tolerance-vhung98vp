const Sequelize = require('sequelize');
const db = require('../database');

const Books = db.define('books',{
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  book_uid: {
    type: Sequelize.UUID,
    allowNull: false,
    unique: true
  },
  name: {
    type: Sequelize.STRING(255),
    allowNull: false
  },
  author: {
    type: Sequelize.STRING(255),
    allowNull: false
  },
  genre: {
    type: Sequelize.STRING(255),
    allowNull: false
  },
  condition: {
    type: Sequelize.ENUM('EXCELLENT', 'GOOD', 'BAD'),
    defaultValue: 'EXCELLENT'
  }
});
module.exports = Books;
  