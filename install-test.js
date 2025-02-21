const config = require('config');
const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');
const session = require('express-session');
const MemoryStore = require('memorystore')(session);
const salt = config.get('app.salt') || 'you should set salt in config file';

/* 
   This is a tiny app you can run to confirm that your server can serve the full app.
   This will run even if other parts of the app (such as LibGuides content) are not set up.
   It will only run the install page, and will not run the full app.
*/

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

app.get('/', (req, res) => {
  // forward to install page
  res.redirect('/install');
});

app.get('/install', (req, res) => {
  res.send(
    '<style>body{ text-align:center; padding: 1em; border: 6px solid white; height: 4em;font-size: 145%; font-weight:bold; margin: auto; margin-top: 2em;width: 60%; background-color: lightgreen}</style><body><p>If you can read this, the app is serving the install page.<p> <p>That means your web server is set up correctly to serve the full app. <br>You may still have additional work to do to set up the app content.</p></body>'
  );
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
        `Server app listening on port ${PORT}! Go to https://${server.hostname}:${PORT}/install`
      );
    });
} else {
  app.listen(PORT, function () {
    console.log(
      `Localhost app listening on port ${PORT}! Go to http://localhost:${PORT}/install`
    );
  });
}
