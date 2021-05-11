const express = require('express');
const controller = require('../controllers/comment.controller');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/', controller.findAll);
router.get('/:id', controller.findById);
router.post('/', auth(), controller.create);
router.put('/:id', auth(), controller.updateById);
router.delete('/:id', auth(), controller.destroyById);

module.exports = router;