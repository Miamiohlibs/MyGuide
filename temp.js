const express = require('express');
const helmet = require('helmet');

// const directives = require('./helpers/contentSecurityPolicy');

// console.log(directives);

let nonce = '1234567890';

const app = express();
app.use(helmet.frameguard());
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: [
        "'self'",
        "'nonce-" + nonce + "'",
        "'sha256-tF61fkF9jqKAYfyKLyk2kPTFFkV99XI3doRxVepVXU8='",
      ],
    },
  })
);

app.get('/', (req, res) => {
  res.send(
    '<script nonce=' +
      nonce +
      '>console.log("Nonce in action")</script><body>Plain HTML</body>' +
      '<script>console.log("Hash in Action");</script>'
  );
});

app.listen(3000, () => console.log('Example app listening on port 3000!'));
