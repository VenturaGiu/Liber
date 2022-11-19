(function() {
  var childProcess = require("child_process");
  var oldSpawn = childProcess.spawn;
  function mySpawn() {
      console.log('spawn called');
      console.log(arguments);
      var result = oldSpawn.apply(this, arguments);
      return result;
  }
  childProcess.spawn = mySpawn;
})();

const mongoose = require('mongoose');
const express = require('express')
const cors = require('cors');
const fs = require('fs');
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
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb'}));
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
app.use(express.static(path.join(path.resolve('./'), 'server')));

app.get('/', (req, res) => {
    res.json({ message: 'Rota raiz, vai pa ota (/users)' })
})

app.get('/books/:isbn', (req, res) => {
  const { isbn } = req.params
  res.sendFile(path.join(path.resolve('./'), `images/books/${isbn}`))
})

app.get('/users/:email', (req, res) => {
  const { email } = req.params;
  const path_ = path.join(path.resolve('./'), `images/users/${email}.jpeg`);
  if (fs.existsSync(path_)) {
    res.sendFile(path_)
  } else {
    res.sendFile(path.join(path.resolve('./'), `images/defaultUser.png`));
  }
})

app.get('/reports/:page', (req, res) => {
  const { page } = req.params
  res.sendFile(path.join(path.resolve('./'), `scripts/generate_report/reports/${page}Report.html`))
})

app.post('/image/:isbn', (req, res) => {
  const { isbn } = req.params
  const { image } = req.body
  if (image != null) {
    fs.writeFileSync(`./images/books/${isbn}.jpeg`, Buffer.from(image));
    return res.status(200);
  }
  return res.status(500);
})

app.post('/user/:email', (req, res) => {
  const { email } = req.params
  const { image } = req.body
  if (image != null) {
    fs.writeFileSync(`./images/users/${email}.jpeg`, Buffer.from(image));
    return res.status(200);
  }
  return res.status(500);
})

app.listen(config.server.port, () => {
    console.log(`API Server running on PORT: ${config.server.port}`)
})