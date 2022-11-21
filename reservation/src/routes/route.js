const router = require('express').Router();
const controller = require('../controllers/controller');

router
  .get('/', controller.getReservationsByUsername)
  .post('/', controller.takeBook)
  .post('/:reservationUid/return', controller.returnBook);

module.exports = router;