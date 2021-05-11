const jwt = require('jsonwebtoken');

exports.generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      username: user.username,
      role: user.Role.name
    },
    process.env.SECRET_PHRASE,
    { expiresIn: '24h' });
}

exports.getDecodedToken = (req) => {
  const token = req.headers.authorization.split(" ")[1];
  return jwt.decode(token);
}