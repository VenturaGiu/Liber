const router = require('express').Router();

const userApp = require('./app/routes/UserRoute');

router.use('/app_user', userApp);

module.exports = router;