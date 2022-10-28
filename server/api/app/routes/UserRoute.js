const router = require('express').Router();

const {
    listAll,
    register,
    login,
    validate,
    updateUserInformation,
    forgotPassword,
    changePass,
    settingsAccount
} = require('../controllers/UserController');
const { 
    requiresLogin
} = require('../../../lib/routeIntercept');

router.route('/')
    .get(requiresLogin, listAll)
    .post(register)
    .put(updateUserInformation);

router.route('/login')
    .post(login);

router.route('/validate')
    .get(validate);

router.route('/forgotpassword')
    .post(forgotPassword);

router.route('/changePass')
    .put(changePass);

router.route('/settings')
    .put(settingsAccount);

module.exports = router;