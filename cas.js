const config = require('config');
const logger = require('./helpers/Logger');
const fs = require('fs');
const path = require('path');
const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const https = require('https');
const MemoryStore = require('memorystore')(session);
const salt = config.get('app.salt') || 'you should set salt in config file';

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  session({
    cookie: { maxAge: 86400000 },
    store: new MemoryStore({
      checkPeriod: 86400000, // prune expired entries every 24h
    }),
    resave: false,
    secret: salt,
    saveUninitialized: true,
  })
);

global.onServer =
  config.has('app.onServer') && config.get('app.onServer') === true;
logger.debug('On Server: ' + global.onServer);

//if (global.onServer === true && global.skipLogin === false) {
if (config.get('app.authType') == 'CAS') {
  app.use(
    session({
      cookie: { maxAge: 86400000 },
      name: config.get('CAS.sessionName'),
      secret: config.get('CAS.secret'),
      store: new MemoryStore({ checkPeriod: 86400000 }), // or other session store
      resave: false,
      secret: salt,
      saveUninitialized: true,
    })
  );
  const casClient = require('./middleware/cas-client');
  app.use(casClient.core());

  // add logout route is CAS-specific
  if (global.onServer === true) {
    app.get('/logout', function (req, res, next) {
      // Do whatever you like here, then call the logout middleware
      casClient.logout()(req, res, next);
    });
  }
}
//}

app.use(cookieParser());
app.use(express.static(path.resolve(__dirname, 'public')));
app.set('views', path.resolve(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', async (req, res) => {
  //    res.json({"Hello": "World"});
  res.json(req.session);
});

const PORT = config.get('app.port') || '4000';
if (global.onServer === true) {
  const server = config.get('server');

  https
    .createServer(
      {
        key: fs.readFileSync(server.key),
        cert: fs.readFileSync(server.cert),
      },
      app
    )
    .listen(PORT, function () {
      console.log(
        `Server app listening on port ${PORT}! Go to https://${server.hostname}:${PORT}/`
      );
    });
} else {
  app.listen(PORT, function () {
    console.log(
      `Localhost app listening on port ${PORT}! Go to http://localhost:${PORT}/`
    );
  });
}
