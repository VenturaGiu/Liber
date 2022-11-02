const router = require('express').Router();
const {
    getGenreByTag,
    saveGenreByName,
} = require('../controllers/GenreController');

router.route('/:tag')
    .get(getGenreByTag)


router.route('/:name')
    .post(saveGenreByName)


module.exports = router ;