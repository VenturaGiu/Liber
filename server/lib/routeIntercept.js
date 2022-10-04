const jwt = require('../config/jwt');
const UserController = require('../api/app/controllers/UserController')

async function requiresLogin(req, res, next) {
    const token = req.body.token || req.query.token || req.headers.authorization;
    if (token) {
      req.session.email = jwt.verify(token);
      if (!req.session.user) {
        req.session.user = await UserController.getByEmail(req.session.email.email);
      }
      return next();
    }
    if (req.session.email) {
      req.session.user = await UserController.getByEmail(req.session.email);
      return next();
    }
    return res.status(403).json({ message: `Forbidden` });
  }

module.exports = {
    requiresLogin,
}