const Sequelize = require('sequelize');
const db = require('../database');

const Reservation = db.define('reservation',{
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  reservation_uid: {
    type: Sequelize.UUID,
    unique: true,
    defaultValue: Sequelize.UUIDV4
  },
  username: {
    type: Sequelize.STRING(80),
    allowNull: false,
  },
  book_uid: {
    type: Sequelize.UUID,
    allowNull: false
  },
  library_uid: {
    type: Sequelize.UUID,
    allowNull: false
  },
  status: {
    type: Sequelize.ENUM('RENTED', 'RETURNED', 'EXPIRED'),
    allowNull: false
  },
  start_date: {
    type: Sequelize.DATEONLY,
    allowNull: false
  },
  till_date: {
    type: Sequelize.DATEONLY,
    allowNull: false
  }
});
module.exports = Reservation;
  