const router = require('express').Router();

const userApp = require('./app/routes/UserRoute');
const genreApp = require('./app/routes/GenreRoute');
const bookApp = require('./app/routes/BookRoute');

router.use('/app_user', userApp);
router.use('/app_genre', genreApp);
router.use('/app_book', bookApp);

module.exports = router;