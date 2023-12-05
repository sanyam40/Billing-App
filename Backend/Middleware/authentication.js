const jwt = require('jsonwebtoken');
require('dotenv').config();
const secretKey = process.env.SECRET_KEY;

function authenticateJWT(req, res, next) {
  const bearerHeader = req.headers['authorization'];

  if (typeof bearerHeader !== 'undefined') {
    const bearer = bearerHeader.split(" ");
    const token = bearer[1];
    req.token = token;

    try {
      jwt.verify(req.token, secretKey, (err, authData) => {
        if (err) {
          res.status(403).json({ message: "Forbidden: Invalid Token" });
        } else {
          req.user = authData.user;
          next();
        }
      });
    } catch (e) {
      console.error(e);
      res.status(401).json({ msg: 'Token is not valid' });
    }
  } else {
    res.status(403).json({ message: "Token not found" });
  }
}

module.exports = { authenticateJWT };
