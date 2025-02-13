/* 
    This is a sample configuration file for PM2. It is used to manage the MyGuide app and 
    its associated data retrieval script. The data retrieval script is run once a week to update 
    the app's data cache. The app is restarted after the data retrieval script runs to ensure the 
    cache is up to date.

    This file should be saved as ecosystem.config.js in the root directory of the app. If
    you are running multiple instances of the app (such as a production and development
    versions shown in this sample), each instance should have its own ecosystem.config.js file.

    Clear the existing instances before setting up the ecosystem:
    `pm2 delete all`

    Instantiate the app with the following command:
    `pm2 start /path/to/ecosystem.config.js`

    If running more than one instance, also instantiate the other instance with:
    `pm2 start /path/to/other/ecosystem.config.js`

    To save the configurations for one or more, run the following command:
    `pm2 save`
*/

module.exports = {
  apps: [
    {
      name: 'myguide-prod', // change this as you wish
      script: '/path/to/myguide/MyGuide/app.js',
      env: {
        NODE_ENV: 'production',
      },
    },
    {
      name: 'myguide-getdata-prod',
      script: '/path/to/myguide/MyGuide/getData.sh',
      autorestart: false,
      cron_restart: '0 2 * * 6', // Runs every Saturday at 2:00 AM
      exec_interpreter: 'bash',
      env: {
        NODE_ENV: 'production',
      },
      post_update: ['pm2 restart myguide-prod'], // the last argument should match the app named in apps[0]
    },
  ],
};
