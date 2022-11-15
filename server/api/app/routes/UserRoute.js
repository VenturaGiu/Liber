const router = require('express').Router();

const {
    listAll,
    register,
    login,
    validate,
    updateUserInformation,
    forgotPassword,
    changePass,
    settingsAccount,
    listAllIfosUser,
    saveNewAddress,
    updateAddress,
    listAddressByUser,
    deleteAddressById,
    saveNewCard,
    updateCard,
    listCardsByUser,
    deleteCardById,
    getRecommendations
} = require('../controllers/UserController');

router.route('/')
    .get(listAll)
    .post(register)
    .put(updateUserInformation);

router.route('/:email')
    .get(listAllIfosUser)

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

router.route('/address')
    .post(saveNewAddress)
    .put(updateAddress)
    .delete(deleteAddressById);

router.route('/address/:email')
    .get(listAddressByUser)

router.route('/card')
    .post(saveNewCard)
    .put(updateCard)
    .delete(deleteCardById);

router.route('/card/:email')
    .get(listCardsByUser)

router.route('/getRecommendations')
    .get(getRecommendations)
module.exports = router;