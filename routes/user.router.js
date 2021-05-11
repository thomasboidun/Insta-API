const express = require('express');
const controller = require('../controllers/user.controller');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/', controller.findAll);
router.get('/:id', controller.findById);
router.post('/', controller.create);
router.post('/login', controller.loginByUsername);
router.put('/:id', auth(), controller.updateById);
router.delete('/:id', auth(), controller.destroyById);

module.exports = router;