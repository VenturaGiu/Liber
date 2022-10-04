const router = require('express').Router();

const {
    listAll,
    register,
    login
} = require('../controllers/UserController');
const { 
    requiresLogin
} = require('../../../lib/routeIntercept');

router.route('/')
    .get(requiresLogin, listAll)
    .post(register);

router.route('/login')
    .post(login);

module.exports = router;