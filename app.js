const config = require('config');
const fs = require('fs');
const path = require('path');
const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const MemoryStore = require('session-memory-store')(session);

const app = express();
app.use(cookieParser());

app.use(express.static(path.resolve(__dirname, 'public')));
app.set('views', path.resolve(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

require('./routes')(app);

const PORT = config.get('app.port') || '4000';
app.listen(PORT, function () {
  console.log(
    `Localhost app listening on port ${PORT}! Go to http://localhost:${PORT}/`
  );
});
