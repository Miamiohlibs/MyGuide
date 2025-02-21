const approot = require('app-root-path');
const inquirer = require('inquirer');
const config = require('config');
const colors = require('colors');
const hasSierraConf = config.has('sierra');
const hasAlmaConf = config.has('alma');

/* 
   This script is a commmand-line utility to check the connection to the Sierra and Alma APIs.
   It will let you test the API independent of the rest of the application.
   If the config files are set up correctly, it will return a message that the connection is 
   good. If not, it will return an error message.

   For most users, you will only have one ILS set up (Alma or Sierra), so you can ignore the other
   if you have both set up, you can run this script to check both connections.

   For each ILS, you can check that the API connection is established, and get user data
   based on the a user ID you enter in the command line.
*/

const SierraApi = require(approot + '/models/circulation/sierra/SierraApi');
const SierraDataGetter = require(approot +
  '/models/circulation/sierra/SierraDataGetter');
const AlmaApi = require(approot + '/models/circulation/alma/AlmaApi');
const AlmaDataGetter = require(approot +
  '/models/circulation/alma/AlmaDataGetter');

const sierraConf = hasSierraConf ? config.get('sierra') : null;
const almaConf = hasAlmaConf ? config.get('alma') : null;

const mainMenu = () => {
  console.log();
  choices = [];
  exclusions = [];
  if (hasSierraConf) {
    choices.push([
      {
        name: 'Check Sierra access',
        value: 'sierraToken',
      },
      {
        name: 'Get Sierra user data',
        value: 'getSierraUserData',
      },
    ]);
  } else {
    exclusions.push('Sierra');
  }
  if (hasAlmaConf) {
    choices.push([
      {
        name: 'Check Alma access',
        value: 'listUsers',
      },
      {
        name: 'Get Alma user data',
        value: 'findUser',
      },
    ]);
  } else {
    exclusions.push('Alma');
  }
  choices.push({
    name: 'Quit',
    value: 'quit',
  });
  exclusions.forEach((ex) => {
    console.log(
      colors.cyan(
        `Notice: ${ex} config not found. To activate, add ${ex.toLowerCase()} object in config/default.json`
      )
    );
  });
  return inquirer.prompt([
    {
      type: 'list',
      name: 'mainMenu',
      message: 'What would you like to do?',
      choices: choices.flat(),
    },
  ]);
  console.log();
};

const main = async () => {
  const action = await mainMenu();
  switch (action.mainMenu) {
    case 'sierraToken':
      await checkSierraToken();
      main();
      break;
    case 'getSierraUserData':
      await getSierraUserData();
      main();
      break;
    case 'listUsers':
      await listAlmaUsers();
      main();
      break;
    case 'findUser':
      await findAlmaUser();
      main();
      break;
    default:
      break;
  }
};

main();

const checkSierraToken = async () => {
  const api = new SierraApi(sierraConf);
  try {
    const res = await api.getToken();
    if (api.accessToken) {
      console.log(colors.green('Sierra API token received - config is good'));
    } else {
      // console.error(res);
      throw new Error(
        'Error getting Sierra API token; maybe a problem with the config.\n' +
          `${res.status}: ${res.message} \n${res.response.data.description}`
      );
    }
  } catch (err) {
    console.error(colors.red(err.message));
  }
};

const inquireUserId = async () => {
  return await inquirer.prompt([
    {
      type: 'input',
      name: 'userId',
      message: 'Enter a user ID:',
    },
  ]);
};

const getSierraUserData = async () => {
  let getter = new SierraDataGetter(sierraConf);
  const answer = await inquireUserId();
  await getter.getUserData(answer.userId);
  console.log(getter.user);
};

const listAlmaUsers = async () => {
  const api = new AlmaApi(almaConf);
  try {
    let res = await api.listUsers();

    if (!res || !res.data) {
      throw new Error('listUsers() did not return a valid response');
    }

    if (res.data.hasOwnProperty('total_record_count')) {
      console.log(
        `Connected to Alma API. Total users: ${res.data.total_record_count}`
          .green
      );
    } else {
      console.log('No data returned from Alma API listUsers() call'.red);
    }
  } catch (err) {
    console.error(colors.red('Error connecting with Alma API:', err.message));
  }
};

const findAlmaUser = async () => {
  const getter = new AlmaDataGetter(almaConf);
  const answer = await inquireUserId();
  try {
    await getter.getUserData(answer.userId);
    console.log(getter.user);
  } catch (err) {
    console.error(
      colors.red('Error getting user data from Alma:', err.message)
    );
  }
};
