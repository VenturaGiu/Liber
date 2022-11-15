const router = require('express').Router();
const {
    getAdByUser,
    getAdByUserBuy,
} = require('../controllers/AdController');

router.route('/:_id')
    .get(getAdByUser)

router.route('/buy/:_id')
    .get(getAdByUserBuy)

module.exports = router ;