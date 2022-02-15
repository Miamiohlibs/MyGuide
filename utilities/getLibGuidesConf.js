const config = require('config');
const args = process.argv.slice(2);
if (args[0] === '--api_key') {
  console.log(config.get('LibGuides.api_key'));
} else if (args[0] === '--site_id') {
  console.log(config.get('LibGuides.site_id'));
}
