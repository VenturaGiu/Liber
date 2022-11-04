const router = require('express').Router();
const {
    getBookByISBN,
} = require('../controllers/BookController');

router.route('/:isbn')
    .get(getBookByISBN)

module.exports = router