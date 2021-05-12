const User = require('../models').User;
const Picture = require('../models').Picture;
const Comment = require('../models').Comment;
const Role = require('../models').Role;
const bcrypt = require('bcrypt');
const TokenService = require('../services/token.service');

exports.findAll = (req, res, next) => {
  User.findAll({
    attributes: ['id', 'username'],
    include: [
      {
        model: Role,
        attributes: ['id', 'name']
      },
      {
        model: Picture,
        attributes: ['id', 'source', 'desc', 'createdAt'],
        include: {
          model: Comment,
          attributes: ['id', 'content', 'createdAt'],
          include: { model: User, attributes: ['id', 'username'] },
          through: { attributes: [] }
        },
        through: { attributes: [] }
      }
    ]
  })
    .then(data => res.status(200).json(data))
    .catch(err => console.log(err));
};

exports.findById = (req, res, next) => {
  const id = req.params.id;

  User.findOne({
    where: { id: id },
    attributes: ['id', 'username'],
    include: [
      {
        model: Role,
        attributes: ['id', 'name']
      },
      {
        model: Picture,
        attributes: ['id', 'source', 'desc', 'createdAt'],
        include: {
          model: Comment,
          attributes: ['id', 'content', 'createdAt'],
          include: { model: User, attributes: ['id', 'username'] },
          through: { attributes: [] }
        },
        through: { attributes: [] }
      }
    ]
  })
    .then(data => res.status(200).json(data))
    .catch(err => console.log(err));
};

exports.create = (req, res, next) => {
  bcrypt.hash(req.body.password, 10, (err, hash) => {
    if (err) throw err;

    let data = req.body;
    data.password = hash;

    User.create(data)
      .then(data => { res.status(201).json(data) })
      .catch(err => {
        err.name == "SequelizeUniqueConstraintError" ?
          res.status(403).json({ 'error': `Duplicate entry. Impossible to add` }) :
          res.status(400).json({ 'error': `Can't add, bad fields. Check the documentation` });
      });
  });
};

exports.updateById = (req, res, next) => {
  const token = TokenService.getDecodedToken(req);
  const id = req.params.id;
  const data = req.body;
  console.log('update by id: ' + id, 'token.id: ' + token.id);
  if (token.id != id && token.role != 'admin') {
    console.log(`if ${token.id} != ${id} && '${token.role}' != 'admin' return error 403 'No permision'`);
    return res.status(403).json({ 'error': 'No permision' });
  } else {
    User.update(data, { where: { id: id } })
      .then(() => { res.status(200).json({ message: 'User updated' }) })
      .catch(err => {
        err.name == "SequelizeUniqueConstraintError" ?
          res.status(403).json({ 'error': `Duplicate entry. Impossible to add` }) :
          res.status(400).json({ 'error': `Can't add, bad fields. Check the documentation` });
      });
  }
};

exports.destroyById = (req, res, next) => {
  const token = TokenService.getDecodedToken(req);
  const id = req.params.id;

  if (token.id != id && token.role != 'admin') {
    console.log(`if ${token.id} != ${id} && '${token.role}' != 'admin' return error 403 'No permision'`);
    return res.status(403).json({ 'error': 'No permision' });
  } else {
    User.destroy({ where: { id: id } })
      .then(user => res.status(200).json({ message: 'User deleted' }))
      .catch(err => console.log(err));
  }
};

exports.loginByUsername = (req, res, next) => {
  console.log('login by username: ' + req.body.username);
  User.findOne({
    where: { username: req.body.username },
    include: { model: Role, attributes: ['name'] }
  })
    .then(user => {
      if (user) {
        bcrypt.compare(req.body.password, user.password, (err, result) => {
          if (err) { return res.status(500).json(err); }
          else {
            if (result) {
              const token = TokenService.generateToken(user);
              console.log('log user', token);
              res.status(200).json({ token: token });
            } else { return res.status(404).json({ error: 'Credential error' }); }
          }
        })
      } else {
        // username does not matches to any users
        res.status(404).json({ error: 'Credential error' })
      }
    })
    .catch(error => { res.status(500).json(error); });
};
