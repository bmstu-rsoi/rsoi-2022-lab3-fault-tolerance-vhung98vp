const router = require('express').Router();
const controller = require('../controllers/controller');

router
  .get('/', controller.getRatingByUsername)
  .patch('/', controller.updateRatingByUsername);

module.exports = router;