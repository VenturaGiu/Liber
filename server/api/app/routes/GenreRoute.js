const router = require('express').Router();
const {
    getGenreByTag,
    saveGenreByName,
    getAllGenres,
} = require('../controllers/GenreController');

router.route('/:tag')
    .get(getGenreByTag)

router.route('/')
    .get(getAllGenres)

router.route('/:name')
    .post(saveGenreByName)


module.exports = router ;