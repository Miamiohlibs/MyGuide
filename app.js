const config = require('config');
const logger = require('./services/Logger');
const fs = require('fs');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const MemoryStore = require('session-memory-store')(session);

const app = express();

global.onServer =
  config.has('app.onServer') && config.get('app.onServer') === 'true';
logger.debug('On Server: ' + global.onServer);

if (global.onServer === true) {
  if (config.get('app.authType') == 'CAS') {
    app.use(
      session({
        name: config.get('CAS.sessionName'),
        secret: config.get('CAS.secret'),
        store: new MemoryStore(), // or other session store
      })
    );
  }
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

app.use(cookieParser());
app.use(express.static(path.resolve(__dirname, 'public')));
app.set('views', path.resolve(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

require('./routes')(app);

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
