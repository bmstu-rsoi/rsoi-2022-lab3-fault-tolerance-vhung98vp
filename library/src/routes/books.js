const router = require('express').Router();
const controller = require('../controllers/bookController');

router
  .get('/:bookUid', controller.getBookByUid)
  .patch('/:bookUid', controller.updateBookByUid);

module.exports = router;