const express = require('express');
const path = require('path');
const controller = require('../controllers/picture.controller');
const auth = require('../middleware/auth');
const TokenServie = require('../services/token.service');

const router = express.Router();

// For uploaded images
const multer = require('multer');

const DIR = "./pictures";

let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, DIR);
  },
  filename: (req, file, cb) => {
    const token = TokenServie.getDecodedToken(req);
    const originalname = file.originalname.split(path.extname(file.originalname))[0];
    cb(null, file.fieldname + '-' + Date.now() + '-' + token.id + '-' + originalname + path.extname(file.originalname));
  }
});

let upload = multer({ storage: storage });

router.get('/', controller.findAll);
router.get('/:id', controller.findById);
router.post('/', auth(), upload.single('picture'), controller.create);
router.put('/:id', auth(), controller.updateById);
router.delete('/:id', auth(), controller.destroyById);

module.exports = router;