const router = require('express').Router();
const {
    getAdByUser,
    getAdByUserBuy,
    createAd,
    editAd,
    deteleAd,
} = require('../controllers/AdController');

router.route('/')
    .post(createAd)
    .put(editAd)
    .delete(deteleAd)

router.route('/:_id')
    .get(getAdByUser)

router.route('/buy/:_id')
    .get(getAdByUserBuy)

module.exports = router ;