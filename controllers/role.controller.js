const Role = require('../models').Role;
const TokenService = require('../services/token.service');

exports.findAll = (req, res, next) => {
  Role.findAll({
    order: [['name', 'ASC']],
    attributes: ['id', 'name']
  })
    .then(data => res.status(200).json(data))
    .catch(err => console.log(err));
};

exports.findById = (req, res, next) => {
  const id = req.params.id;

  Role.findByPk(id)
    .then(role => res.status(200).json(role))
    .catch(err => console.log(err));
};

exports.create = (req, res, next) => {
  const token = TokenService.getDecodedToken(req);
  if (token.role !== 'admin') return res.status(403).json({ 'error': 'No permision' });

  const roleData = req.body;

  if (!roleData.name || roleData.name.trim().length < 1) return res.status(400).json({ 'error': `Can't add, bad fields. Check the documentation` });

  Role.create(roleData)
    .then(data => { res.status(201).json(data) })
    .catch(err => {
      err.name == "SequelizeUniqueConstraintError" ?
        res.status(403).json({ 'error': `Duplicate entry. Impossible to add` }) :
        res.status(400).json({ 'error': `Can't add, bad fields. Check the documentation` });
    });
};

exports.updateById = (req, res, next) => {
  const token = TokenService.getDecodedToken(req);
  if (token.role !== 'admin') return res.status(403).json({ 'error': 'No permision' });

  const id = req.params.id;
  const data = req.body;

  Role.update(data, { where: { id: id } })
    .then(() => { res.status(200).json({ 'message': 'Role updated' }) })
    .catch(err => {
      err.name == "SequelizeUniqueConstraintError" ?
        res.status(403).json({ 'error': `Duplicate entry. Impossible to add` }) :
        res.status(400).json({ 'error': `Can't add, bad fields. Check the documentation` });
    });
};

exports.destroyById = (req, res, next) => {
  const token = TokenService.getDecodedToken(req);
  if (token.role !== 'admin') return res.status(403).json({ 'error': 'No permision' });

  const id = req.params.id;

  Role.destroy({ where: { id: id } })
    .then(data => res.status(200).json({ 'message': 'Role deleted' }))
    .catch(err => console.log(err))
};
