const router = require('express').Router();
const {
    getAdByUser,
    getAdByUserBuy,
    createAd,
    editAd,
    deteleAd,
    buyOrswap,
    acceptSolicitation,
    removeSolicitation,
    getSolicitationsByUserId,
} = require('../controllers/AdController');

router.route('/')
    .post(createAd)
    .put(editAd)
    .delete(deteleAd)

router.route('/:_id')
    .get(getAdByUser)

router.route('/buy/:_id')
    .get(getAdByUserBuy)
    .post(buyOrswap)

router.route('/solicitation/accept/:_id')
    .put(acceptSolicitation)

router.route('/solicitation/:_id')
    .put(removeSolicitation)

router.route('/solicitation/user/:_id')
    .get(getSolicitationsByUserId)

module.exports = router;