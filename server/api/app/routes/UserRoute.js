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
    getRecommendations,
    listAllIfosUserBuy,
} = require('../controllers/UserController');

router.route('/')
    .get(listAll)
    .post(register)

router.route('/update/infos')
    .put(updateUserInformation);

router.route('/:_id')
    .get(listAllIfosUser)

router.route('/listAllIfosUserBuy/:_id')
    .get(listAllIfosUserBuy)

router.route('/login')
    .post(login);

router.route('/validate/email')
    .get(validate);

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

router.route('/ia/recommendations/:_id')
    .get(getRecommendations)

module.exports = router;