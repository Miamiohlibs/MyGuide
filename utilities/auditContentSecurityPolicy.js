const approot = require('app-root-path');
const Librarians = require(approot + '/cache/Librarians');
const cspPolicy = require(approot + '/helpers/contentSecurityPolicy');

/* 
  This script compares the domains in the CSP policy with the domains in the Librarians array.
  If there are any domains in the Librarians array that are not in the CSP policy, it will log them.

  Note: because this script runs on the command line, were not using the logger -- we want output
  to be visible to the user, not logged.
*/

function elementsInFirstArray(a, b) {
  return a.filter((element) => !b.includes(element));
}

async function categorizeUrlsFromObjects(objectsArray) {
  try {
    // Define a function to extract FQDNs from a string based on file type
    const extractFqdnsFromString = (str, fileType) => {
      const urlRegex =
        /(?:^|[^"'])(\/\/([^"'\s\/]+(\.[^"'\s\/]+)+))(?:\/|\s|$)/gi;
      const matches = str.matchAll(urlRegex);
      const fqdns = [];
      for (const match of matches) {
        fqdns.push({ domain: match[2], fileType });
      }
      return fqdns;
    };

    // Extract and categorize FQDNs from profile properties of each object
    const categorizedDomains = objectsArray.reduce(
      (acc, obj) => {
        if (obj.profile) {
          if (obj.profile.image_url) {
            const imageDomains = extractFqdnsFromString(
              obj.profile.image_url,
              'image'
            );
            imageDomains.forEach((domain) => {
              acc.images[domain.domain] = true;
            });
          }
          if (obj.profile.widget_la) {
            const jsDomains = extractFqdnsFromString(
              obj.profile.widget_la,
              'javascript'
            );
            jsDomains.forEach((domain) => {
              acc.javascripts[domain.domain] = true;
            });
          }
          if (obj.profile.widget_lc) {
            const jsDomains = extractFqdnsFromString(
              obj.profile.widget_lc,
              'javascript'
            );
            jsDomains.forEach((domain) => {
              acc.javascripts[domain.domain] = true;
            });
          }
          if (obj.profile.widget_other) {
            const webPageDomains = extractFqdnsFromString(
              obj.profile.widget_other,
              'webpage'
            );
            webPageDomains.forEach((domain) => {
              acc.webpages[domain.domain] = true;
            });
          }
        }
        return acc;
      },
      { images: {}, javascripts: {}, webpages: {} }
    );

    return categorizedDomains;
  } catch (error) {
    console.error({ message: 'Error categorizing URLs from objects', error });
    return { images: {}, javascripts: {}, webpages: {} };
  }
}

categorizeUrlsFromObjects(Librarians)
  .then((categorizedDomains) => {
    imgSrcDomains = Object.keys(categorizedDomains.images);
    jsSrcDomains = Object.keys(categorizedDomains.javascripts);
    webSrcDomains = Object.keys(categorizedDomains.webpages);

    console.info(
      // list imgSrcDomains not in cspPolicy.imgSrc
      'Image domains missing from cspPolicy.imgSrc:',
      elementsInFirstArray(imgSrcDomains, cspPolicy.imgSrc)
    );
    console.info(
      'Script domains missing from cspPolicy.scriptSrc:',
      elementsInFirstArray(jsSrcDomains, cspPolicy.scriptSrc)
    );
    console.info(
      'Webpage domains missing from cspPolicy.defaultSrc:',
      elementsInFirstArray(webSrcDomains, cspPolicy.defaultSrc)
    );
  })
  .catch((error) => {
    console.error({ message: 'Error categorizing URLs from objects', error });
  });
