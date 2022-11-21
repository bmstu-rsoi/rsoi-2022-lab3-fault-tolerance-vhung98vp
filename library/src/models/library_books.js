const Sequelize = require('sequelize');
const db = require('../database');
const Library = require('./library');
const Books = require('./books');

const LibraryBooks = db.define('library_books',{
  // book_id: {
  //   type: Sequelize.INTEGER,
  //   references: {
  //     model: Books,
  //     key: 'id'
  //   }
  // },
  // library_id: {
  //   type: Sequelize.INTEGER,
  //   references: {
  //     model: Library,
  //     key: 'id'
  //   }
  // },
  available_count: {
    type: Sequelize.INTEGER,
    allowNull: false
  }
});
Library.belongsToMany(Books, {through: LibraryBooks, foreignKey: 'library_id'});
Books.belongsToMany(Library, {through: LibraryBooks, foreignKey: 'book_id'});

module.exports = LibraryBooks;
  