const mongoose = require('mongoose');
const express = require('express')
const cors = require('cors');
const parser = require('body-parser')
const api = require('./api');
const path = require('path');
const config = require('./config/variables');
const session = require('express-session');
const cookieParser = require("cookie-parser");
const uploadImg = require('./lib/uploadImage')

// Connect to database.

const url = `mongodb://${config.db.host}:${config.db.port}/${config.db.name}`;
// const url = `mongodb+srv://giulia:senha@liber.1re6hip.mongodb.net/test`;
mongoose.Promise = global.Promise;
mongoose.connect(url, { useNewUrlParser: true });
// Init Express 
const app = express()
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // intercept OPTIONS method
    if (req.method === 'OPTIONS') {
      res.sendStatus(200);
    } else {
      next();
    }
});

app.use(cors());
app.use(parser.json())
const oneDay = 1000 * 60 * 60 * 24;
app.use(session({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized:true,
    cookie: { maxAge: oneDay },
    resave: false 
}));
app.use('/api', api);
app.use(cookieParser());

app.use(express.static(path.join(path.resolve('./'), 'images')));
console.log(path.join(path.resolve('./'), 'images'))
app.get('/', (req, res) => {
    res.json({ message: 'Rota raiz, vai pa ota (/users)' })
})

app.get('/images/:isbn', (req, res) => {
  const { isbn } = req.params
  res.sendFile(path.join(path.resolve('./'), `images/books/${isbn}`))
})

app.post('/upload/image/:isbn', uploadImg.single('image'), async (req, res) => {
    if(req.file) return res.status(200).json({ message: 'upload OK' })
    return res.status(500).json(error)
})

app.listen(config.server.port, () => {
    console.log(`API Server running on PORT: ${config.server.port}`)
})