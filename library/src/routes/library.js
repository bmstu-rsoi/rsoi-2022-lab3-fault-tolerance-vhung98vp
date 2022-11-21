const router = require('express').Router();
const controller = require('../controllers/libraryController');

router
  .get('/', controller.getLibrariesByCity)
  .get('/:libraryUid/books', controller.getBooksByLibrary)
  .get('/:libraryUid', controller.getLibraryByUid);

module.exports = router;