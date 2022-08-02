const config = require('config');
const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');
const session = require('express-session');
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

app.get('/install', (req, res) => {
  res.send('If you can read this, the app is serving the install page.');
});

global.onServer =
  config.has('app.onServer') && config.get('app.onServer') === true;

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
