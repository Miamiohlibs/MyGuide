const api = require('./models/libGuides/LibGuidesApi');
const libGuidesApi = new api();
(async () => {
  await libGuidesApi.getToken();
})();
