const Librarians = require('./cache/Librarians');
const cspPolicy = require('./helpers/contentSecurityPolicy');

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
    console.error('Error categorizing URLs from objects:', error);
    return { images: {}, javascripts: {}, webpages: {} };
  }
}

categorizeUrlsFromObjects(Librarians)
  .then((categorizedDomains) => {
    imgSrcDomains = Object.keys(categorizedDomains.images);
    jsSrcDomains = Object.keys(categorizedDomains.javascripts);
    webSrcDomains = Object.keys(categorizedDomains.webpages);

    console.log(
      // list imgSrcDomains not in cspPolicy.imgSrc
      'Image domains missing from cspPolicy.imgSrc:',
      elementsInFirstArray(imgSrcDomains, cspPolicy.imgSrc)
    );
    console.log(
      'Script domains missing from cspPolicy.scriptSrc:',
      elementsInFirstArray(jsSrcDomains, cspPolicy.scriptSrc)
    );
    console.log(
      'Webpage domains missing from cspPolicy.defaultSrc:',
      elementsInFirstArray(webSrcDomains, cspPolicy.defaultSrc)
    );
  })
  .catch((error) => {
    console.error('Error categorizing URLs from objects:', error);
  });
