const mongoose = require('mongoose');
const express = require('express')
const cors = require('cors');
const parser = require('body-parser')
const api = require('./api');
// const path = require('path');
const config = require('./config/variables');

// Connect to database.
const url = `mongodb://${config.db.host}:${config.db.port}/${config.db.name}`;
mongoose.Promise = global.Promise;
mongoose.connect(url, { useNewUrlParser: true });
// Init Express 
const app = express()
app.use(parser.json())
app.use(cors());
app.use('/api', api);
// const usersRoute = require('./routes/users')
// app.use('/users', usersRoute)

app.get('/', (req, res) => {
    res.json({
        message: 'Rota raiz, vai pa ota (/users)'
    })
})

app.listen(config.server.port, () => {
    console.log(`API Server running on PORT: ${config.server.port}`)
})