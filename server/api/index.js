const router = require('express').Router();

// APP
const userApp = require('./app/routes/UserRoute');
const genreApp = require('./app/routes/GenreRoute');
const bookApp = require('./app/routes/BookRoute');

//DASHBOARD
const userDash = require('./dashboard/routes/UserRoute')

// APP
router.use('/app_user', userApp);
router.use('/app_genre', genreApp);
router.use('/app_book', bookApp);

//DASHBOARD
router.use('/dash_user', userDash)

module.exports = router;