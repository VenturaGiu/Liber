const router = require('express').Router();

const {
    list,
    register
} = require('../controllers/UserController');

router.route('/')
    .get(list)
    .post(register);

module.exports = router;