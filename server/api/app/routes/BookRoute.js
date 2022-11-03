const router = require('express').Router();
const {
    getBookByISBN,
    registerBook,
} = require('../controllers/BookController');

router.route('/')
    .post(registerBook)

router.route('/:isbn')
    .get(getBookByISBN)

module.exports = router