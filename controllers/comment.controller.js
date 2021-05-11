const Comment = require('../models').Comment;
const User = require('../models').User;
const Picture = require('../models').Picture;
const PictureComment = require('../models').PictureComment;
const TokenService = require('../services/token.service');

exports.findAll = (req, res, next) => {
  Comment.findAll({
    order: [['createdAt', 'ASC']],
    attributes: ['id', 'content', 'createdAt'],
    include: [
      {
        model: User,
        attributes: ['id', 'username']
      },
      {
        model: Picture,
        attributes: ['id', 'source', 'desc', 'createdAt'],
        include: { model: User, attributes: ['id', 'username'] }
      }
    ]
  })
    .then(data => res.status(200).json(data))
    .catch(err => console.log(err))
};

exports.findById = (req, res, next) => {
  const id = req.params.id;

  Comment.findOne({
    where: { id: id },
    attributes: ['id', 'content', 'createdAt'],
    include: [
      {
        model: User,
        attributes: ['id', 'username']
      },
      {
        model: Picture,
        attributes: ['id', 'source', 'desc', 'createdAt'],
        include: { model: User, attributes: ['id', 'username'] }
      }
    ]
  })
    .then(data => {
      data ?
        res.status(200).json(data) :
        res.status(404).json({ message: 'No comment found with id ' + id });
    })
    .catch(err => console.log(err))
};

exports.create = (req, res, next) => {
  const token = TokenService.getDecodedToken(req);

  const data = req.body;
  data.UserId = token.id;

  const pictureId = data.PictureId;
  console.log('create:', data);

  Comment.create(data)
    .then(createdData => {
      PictureComment.create({ PictureId: pictureId, CommentId: createdData.id })
        .then(() => res.status(201).json(createdData)).catch(err => console.log(err));
    })
    .catch(err => {
      err.name == "SequelizeUniqueConstraintError" ?
        res.status(403).json({ 'error': `Duplicate entry. Impossible to add` }) :
        res.status(400).json({ 'error': `Can't add, bad fields. Check the documentation` });
    })
};

exports.updateById = (req, res, next) => {
  const token = TokenService.getDecodedToken(req);
  const commentId = req.params.id;
  const data = req.body;

  // check if comment belongs to user
  Comment.findOne({ where: { id: commentId } })
    .then(check => {
      if (token.id === check.UserId) {
        Comment.update(data, { where: { id: commentId } })
          .then(() => { res.status(200).json({ message: 'Comment updated' }) })
          .catch(err => console.log(err));
      } else {
        res.status(403).json({ 'error': 'No permision' });
      }
    })
};

exports.destroyById = (req, res, next) => {
  const token = TokenService.getDecodedToken(req);
  const commentId = req.params.id;

  Comment.findOne({ where: { id: commentId } })
    .then(check => {
      if (token.id === check.UserId || token.role === 'admin') {
        Comment.destroy({ where: { id: commentId } })
          .then(data => res.status(200).json({ message: 'Comment deleted' }))
          .catch(err => console.log(err))
      } else {
        res.status(403).json({ 'error': 'No permision' });
      }
    })
};
