/* 
    This is a sample configuration file for PM2. It is used to manage the MyGuide app and 
    its associated data retrieval script. The app is run in both production and development 
    environments. The data retrieval script is run once a week to update the app's data 
    cache. The app is restarted after the data retrieval script runs to ensure the cache is 
    up to date.

    This file should be saved as ecosystem.config.js in the root directory of the app. If
    you are running multiple instances of the app (such as a production and development
    versions shown in this sample), you only need one ecosystem.config.js file to run both 
    instances. 

    Instantiate the app with the following command:
    pm2 start ecosystem.config.js

    To save the configuration file, run the following command:
    pm2 save

    Finally, to ensure that the app and data retrieval script restart automatically after a 
    server reboot, run the following command:
    pm2 startup
*/

module.exports = {
  apps: [
    // MyGuide app -- production
    {
      name: 'myguide-prod',
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
      post_update: ['pm2 restart myguide-prod'],
    },

    // MyGuide app -- development
    {
      name: 'myguide-dev',
      script: '/path/to/myguidedev/MyGuide/app.js',
      env: {
        NODE_ENV: 'development',
      },
    },
    {
      name: 'myguide-getdata-dev',
      script: '/path/to/myguidedev/MyGuide/getData.sh',
      autorestart: false,
      cron_restart: '0 3 * * 6', // Runs every Saturday at 3:00 AM
      exec_interpreter: 'bash',
      env: {
        NODE_ENV: 'development',
      },
      post_update: ['pm2 restart myguide-dev'],
    },
  ],
};
