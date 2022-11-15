const router = require('express').Router();
const { spawn } = require('child_process')
// APP
const userApp = require('./app/routes/UserRoute');
const genreApp = require('./app/routes/GenreRoute');
const bookApp = require('./app/routes/BookRoute');
const adApp = require('./app/routes/AdRoute')

//DASHBOARD
const userDash = require('./dashboard/routes/UserRoute')

// APP
router.use('/app_user', userApp);
router.use('/app_genre', genreApp);
router.use('/app_book', bookApp);
router.use('/app_ad', adApp)

//DASHBOARD
router.use('/dash_user', userDash)

module.exports = router;