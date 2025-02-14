const approot = require('app-root-path');
const Librarians = require(approot + '/cache/Librarians');
const axios = require('axios');
const fs = require('fs');

async function downloadImage(lib) {
  let url = lib.profile.image.url;
  let filename = lib.profile.image.file;

  // If URL starts with // add an https
  if (url && url.startsWith('//')) {
    url = 'https:' + url;
  }

  // Query URL and copy file to public/img/cache
  if (url && filename) {
    try {
      const response = await axios({
        method: 'get',
        url: url,
        responseType: 'stream',
      });

      const writer = fs.createWriteStream(
        approot + '/public/img/cache/' + filename
      );
      response.data.pipe(writer);

      await new Promise((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', reject);
      });

      console.info('Saved image to public/img/cache/' + filename);
    } catch (error) {
      console.error(
        'Error saving image to public/img/cache/' + filename,
        error
      );
    }
  }
}

async function processLibrarians() {
  for (const lib of Librarians) {
    await downloadImage(lib);
  }
}

processLibrarians();
