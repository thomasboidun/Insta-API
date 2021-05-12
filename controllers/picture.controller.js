const User = require('../models').User;
const Picture = require('../models').Picture;
const UserPicture = require('../models').UserPicture;
const Comment = require('../models').Comment;
const TokenService = require('../services/token.service');

exports.findAll = (req, res, next) => {
  console.log('PictureController.findAll request');
  Picture.findAll({
    order: [['createdAt', 'ASC']],
    attributes: ['id', 'source', 'desc', 'createdAt'],
    include: [
      {
        model: User,
        attributes: ['id', 'username'],
        through: { attributes: [] }
      },
      {
        model: Comment,
        attributes: ['id', 'content', 'createdAt'],
        include: { model: User, attributes: ['id', 'username'] },
        through: { attributes: [] }
      }
    ]
  })
    .then(data => {
      console.log('PictureController.findAll return ' + data.length + 'row(s)');
      res.status(200).json(data);
    })
    .catch(err => console.log('PictureController.findAll error:', err))
}

exports.findById = (req, res, next) => {
  console.log('PictureController.findById request');
  const id = req.params.id;
  Picture.findOne({
    where: { id: id },
    attributes: ['id', 'source', 'desc', 'createdAt'],
    include: [
      {
        model: User,
        attributes: ['id', 'username'],
        through: { attributes: [] }
      }
    ]
  })
    .then(data => {
      data ?
        res.status(200).json(data) :
        res.status(400).json({ 'message': 'No picture found with id ' + id });
    })
    .catch(err => console.log(err));
};

exports.create = (req, res, next) => {
  const token = TokenService.getDecodedToken(req);
  const file = req.file;
  console.log(file);

  if (!file) return res.status(400).json({ 'error': 'No dile received' });

  const data = req.body;
  data.source = './pictures/' + file.filename;
  console.log('create picture:', data);

  Picture.create(data)
    .then(data => {
      UserPicture.create({ UserId: token.id, PictureId: data.id })
        .then(data2 => res.status(201).json(data));
    })
    .catch(err => {
      err.name == "SequelizeUniqueConstraintError" ?
        res.status(403).json({ 'error': `Duplicate entry. Impossible to add` }) :
        res.status(400).json({ 'error': `Can't add, bad fields. Check the documentation` });
    });
};

exports.updateById = (req, res, next) => {
  const token = TokenService.getDecodedToken(req);
  const pictureId = req.params.id;

  if (!req.body.desc) {
    return res.status(400).json({ 'error': `Can't update, bad fields. Check the documentation` });
  } else {
    const data = { desc: req.body.desc };

    // check if picture belongs to user
    UserPicture.findOne({ where: { PictureId: pictureId } })
      .then(check => {
        if (token.id === check.UserId) {
          Picture.update(data, { where: { id: pictureId } })
            .then(() => { res.status(200).json({ 'message': 'Picture updated' }) })
            .catch(err => console.log(err));
        } else {
          res.status(403).json({ 'error': 'No permision' })
        };
      });
  }
};

exports.destroyById = (req, res, next) => {
  const token = TokenService.getDecodedToken(req);
  const pictureId = req.params.id;

  // check if picture belongs to user or user is admin
  UserPicture.findOne({ where: { PictureId: pictureId } })
    .then(check => {
      if (token.id === check.UserId || token.role === 'admin') {
        Picture.destroy({ where: { id: pictureId } })
          .then(data => res.status(200).json({ 'message': 'Picture deleted' }))
          .catch(err => console.log(err));
      } else {
        res.status(403).json({ 'error': 'No permision' })
      };
    });
};
