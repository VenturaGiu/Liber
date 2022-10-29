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

router.route('/')
    .get(listAll)
    .post(register)
    .put(updateUserInformation);

router.route('/login')
    .post(login);

router.route('/validate')
    .post(validate);

router.route('/forgotpassword')
    .post(forgotPassword);

router.route('/changePass')
    .put(changePass);

router.route('/settings')
    .put(settingsAccount);

module.exports = router;