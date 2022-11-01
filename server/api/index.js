const router = require('express').Router();

const userApp = require('./app/routes/UserRoute');
const genreApp = require('./app/routes/GenreRoute');

router.use('/app_user', userApp);
router.use('/app_genre', genreApp);

module.exports = router;