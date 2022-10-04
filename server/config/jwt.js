const jwt = require('jsonwebtoken');
const config = require('./variables');

module.exports = {
    sign: payload => jwt.sign(payload, config.jwt.secret, {expiresIn: config.jwt.expiration}),
    verify:  token => jwt.verify(token, config.jwt.secret)
}