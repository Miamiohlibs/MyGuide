# MyGuide

A personalized, open-source library user dashboard. Integrates with campus authentication, LibGuides, and local settings to show users librarians, subject guides, and databases pertinent to their interests.

Note: this project integrates closely with campus resources and will require some development to work your environment. Please contact Ken Irwin at [irwinkr@miamioh.edu](mailto:irwinkr@miamioh.edu) to help get this set up.

## Requirements

- server running Node.js (18.20.4 or higher)
- command line tools including `bash` and `jq`
- access to SpringShare's LibGuides + LibGuides API
- an authentication system (currently only supports CAS, but modules could be written for other systems)
- optional: Sierra or Alma ILS

## Configuration

- copy `config/default_sample.json` to `config/default.json`
- copy `config/fakeUserConf_sample.json` to `config/fakeUserConf.json`

- customize configs for your environment

  - if running on a server, note the path to an OpenSSL key/cert pair on your server
  - enter the LibGuides API credentials and set the "groups" equal to whichever LibGuides group IDs contain your libraries' content. (If you share a LibGuides installation with other campuses or units, there may be several group ids. By default, group 0 may be the only one you need.)
  - configuring to work with campus authentication is beyond the scope of this document so far. Please [contact Ken](mailto:irwinkr@miamioh.edu)

  - the `allowedUsersCommaSeparated` defines which users can start/stop the service on the command line using the './killapp' and './restart' scripts. This setting is a comma separated list, not a true JSON array, e.g.: `"root,fred,wilma"`

  - CAS.exposeStatsOutsideCas -- default `false`. If set to `true`, the `/stats/` routes (for data and visualizations) will be available to non-logged in users.

  - Google Analytics -- set the `googleAnalyticsTrackingId` in the `viewConfigs` object in `config/default.json` to your add your Google Analytics tracking ID to enable tracking of user interactions with the app.

### fakeUserConf

- for testing on localhost or when you don't want to use an authenticated user, you can test with a fake user. To use a fake user, in `config/default.json`, set `app.useFakeUser` to `true`. When this is set to true, MyGuide will read from settings in `config/fakeUserConf.json` to determine which fakeUser to use and whether to use fake Circulation information as well. The fake Circ info can be set directly in `fakeUserConf.json`. Each fakeUser will have its own files in the `fakeUsers/` directory. You can create or modify the fakeUsers to test MyGuide with different subjects or user parameters. fakeUser files should be based on how what data is passed to MyGuide by your authentication system. The fields in the fakeUser should correspond to fields in `config/cas_field_map.json`

### cas_field_map

`config/cas_field_map.json` defines the relationships between CAS user attributes and the user attributes used by MyGuide. Each entry gives a MyGuide label for a user attribute and has two properties: `field` and `fieldType`. The field will be the path within the CAS data structure to find the matching CAS field. `fieldType` will be one of three expected data types: `string`, `array`, or `arrayOfOne` -- `arrayOfOne` indicates data that is given as an array but expects an array of length=1.

Example:

```
"userType": {
        "field": "attributes.muohioeduPrimaryAffiliation",
        "fieldType": "arrayOfOne"
    },
```

## Initial Setup

- run `npm install` to install Node package dependencies

### Abbreviated test setup

There are a lot of configurations to set up to run MyGuide. You can do a more abbreviated test just to make sure that Apache is correctly configured to serve content from the app. To do this:

- copy `config/default.json` to a safe place if you've been setting it up.
- copy `config/default_barebones_sample.json` to `config/default.json`
- set the port, servername, and the path to the SSL certificate and key files in `config/default.json`
- run `npm run installTest`
- that will start a very simple web server; go to `{yourserver}:{PORT}/install`; if Apache is configured to serve content from the app, you should see a message reading: "If you can read this, the app is serving the install page."

### CAS setup test

If you have a CAS server set up, you can test the CAS authentication by running `npm run cas`. This will start a simple web app that lets you test the CAS authentication setup in `config/default.json`. If you authenticate successfully, you will see a page that shows the user data that was passed to the app. If you see that data, you can be confident that the app is correctly configured to receive data from your CAS server.

### Full setup

Once you've configured the LibGuides portion of the `config/default.json` file, you can run `./getData` to fetch subject, librarian, guide, and database data from the LibGuides API. (You can check on those files in the `./cache` folder. Additional subject subject mapping will be required before you can create the cached subject files, however.)

#### Circ/ILS setup

Optionally, MyGuide can display library circulation information for each user. Currently, the only supported ILSes are Sierra and Alma.

##### Sierra Config

You will need a SierraAPI `key` and `clientSecret`, which you can set up in the To set this up in the Sierra Administration Application using a web browser. The API Key should have the "Patrons Read" role; no other permissions/roles will be needed for the user. By default, the URL is:
https://your.sierra.server/sierra/admin/

Once you have the needed credentials in `config/default.json`:

- set `app.useCirc` to `true`
- set `circSystem` to `"Sierra"`
- configure the `sierra` object with your Sierra API credentials following the example shown in the `config/default_sample.json` file.

##### Alma Config

You will need an Alma API key, which you can set up in the [ExLibris Developer Network](https://developers.exlibrisgroup.com/manage/) using a web browser. Go to Build My APIs > API Keys. You will need a key with read permissions for the Users API.

Once you have the needed credentials in `config/default.json`:

- set `app.useCirc` to `true`
- set `circSystem` to `"Alma"`
- configure the `alma` object with your Alma API credentials following the example shown in the `config/default_sample.json` file.

##### Testing Circulation Configuration

You can test the circulation configuration by running `npm run circTest`. This will initiate a
command-line application to the ILS and display the circulation information a user.

#### Running the app

The recommended way to run the app in production is to use a process manager like `pm2`. To start the app with `pm2`, run `pm2 start app.js`. To stop the app, run `pm2 stop app.js`. To restart the app, run `pm2 restart app.js`. If you are running more than one instance of the app, you can use the `--name` flag to give each instance a unique name, e.g. `pm2 start app.js --name myguide-production`.

The cached data needs to be updated periodically. To do this, run `./getData` to fetch the latest data from the LibGuides API. You can set up a cron job to run this command at regular intervals. You will need to restart the pm2 process after updating the data. Restarting the process will also require users to re-authenticate at their next visit, so it is best to do this during off-peak hours and not more frequently than necessary. Once a week may be sufficient; you may want to do so more or less frequently depending on how often your LibGuides content changes. You can set pm2 to run the `./getData` script and restart the app at the same time by creating a script that runs both commands and setting that script to run in pm2. See the `ecosystem.config-sample.js` file for an example of how to set up a pm2 process to run the `./getData` script and restart the app.

### Custom views/look-and-feel

#### Custom images

In `config/default.json` in the `viewConfigs` object, you can set one or more custom logos by filename. All custom logos should be kept in the `/public/img` folder and the filenames should begin with "custom-" to distinguish them from files native to the repo:

- `myguideCustomLogo` - App icon. If this is set, it will replace the MyGuide logo with the compass rose that is the native logo for the app.
- `organizationLogo` - the logo for your organization. If set, it will appear at the bottom of the page.
- `organizationMobileLogo` - the logo for your organization on mobile devices. If set, it will appear at the top of the "hamburger" navigation menu on mobile devices.

#### Featured content

In `config/default.json` in the `featuredContent` object, you can set a file that will show a "Featured Content" block in the app at the bottom (mobile) or lower right (large screen) of the main page. You can use this for announcements or other content that is not tied to the app itself. This block will display if `display` is set to `true` and the indicated file is found in the `/views/partials/` folder. The filename should begin with "custom-" to distinguish it from other files in the folder.

#### Custom links

In `config/default.json` in the `viewConfigs` section there are settings for `techHelpLink` and `refHelpLink`. Use these to set the URL and text for links to technical help and reference help. If these are set, they will appear in the footer of the app.

#### Custom alert message

In the `/views/partials/` folder, you can create a file called `custom-alert.ejs` to display a dismissible custom alert at the top of the page. You can create this file by copying the `custom-alert-sample.ejs` file in that directory to `custom-alert.ejs` and modify the text to suit.

#### Custom subjects

When mapping subjects to LibGuides content, you may have a subject area for which no LibGuide exists but for which you want some content in the app. For example, there may not be a LibGuide for library employees, but you may want to show some content specifically for library employees. To do this, create a file in the `/cache/custom` folder with the subject as the filename, e.g. `Library.json`. You can model the content of this file on other cached subject files.

Then in the subject map (identified in `default/config` in app.subjectConfigFilename) include that subject in the subject map. For example, an employee in the art and architectures library might want to see both sources for both art and library research, so the entry in the subject map might look like this:

```
{
        "name": "Art/Arch Library",
        "libguides": [
            "Art and Architecture",
            "Library"
        ],
        "deptCodes": [
            {
                "deptCode": "ula",
                "deptName": "Art/Arch Library"
            }
        ]
    },
```

The `Library` entry in the `libGuides` array will add a "Library" tab to the app for users in the Art/Arch Library department.

#### Internationalization: Currency

MyGuide supports internationalization of the currency symbol used in the app (used in displaying fines if a circulation system is configured). To set the currency symbol, in `config/default.json` in the `viewConfigs` object, set the `internationalization.defaultLanguage` (e.g. "en-US") and `internationalization.currency` (e.g. "USD") options. The currency will be formatted according to the locale using javascript's [Intl.NumberFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat) object.

## Content Security Policy

A Content Security Policy (CSP) is a computer security standard introduced to prevent cross-site scripting (XSS) attacks. MyGuide includes some basic CSP settings, but additional local permissions will likely be needed. In `config/default.json`, add to the server.csp settings to permit calls to specific servers for externally sourced scripts, stylesheets, images, etc. If a content is being blocked from loading, add a config to allow the content to load from the specific server needed. Here is an example of what those settings might look like:

```
        "csp": {
            "scriptSrcAdditions": "api3.libcal.com v2.libanswers.com",
            "imgSrcAdditions": "libapps.s3.amazonaws.com *.cloudfront.net",
            "frameSrcAdditions": "api3.libcal.com libanswers.lib.miamioh.edu"
        }
```

The `scriptSrcAdditions` allow the LibCal and LibAnswers servers to permit certain SpringShare widgets to operate.

The `imgSrcAdditions` allow LibApps widgets to load images called for in their scripts.

The `frameSrcAdditions` allow for LibCal to supply popup widgets for our librarian scheduling buttons.

These same settings may work for you, or your institutions content may be stored on different servers. To find out which calls are being blocked by the content security policy, use the "Inspect > Console" feature in your web browser to find a message similar to this one:

```
Refused to frame 'https://api3.libcal.com/' because it violates the following Content Security Policy directive: "frame-src 'self' libanswers.lib.miamioh.edu".
```

To resolve this issue, add `api3.libcal.com` to the `frameSrcAdditions` setting. Be sure to leave a space between each server indicated in these settings.

## Starting/Stopping the Process

`./restart` will kill an existing MyGuide instance (if any) and start a fresh process.

`./killapp` will kill the process with restarting it. Note: this will only work if you started the process by using the `./restart` script.

## Statistics

There are a few "hidden" urls with statistical information with MyGuide usages statistics -- they are not linked from the main public interface, but they are accessible by all users.

### Visualizations

- `/stats/usage` - daily/monthly/yearly usage stats with limits by population (student/faculty/staff), date range. Visualizes `/stats/usageData`.

- `/stats/repeatUsers` - shows: of all the MyGuide users over a set time period, how many used the service once, or twice, or more times. A toggle switch allows the user to condense 10, 11, 12... uses into how many users used the service 10+ times.

### Raw JSON data

- `/stats/usageData` - Raw JSON data for daily/monthly/yearly usage stats with limits by population (student/faculty/staff), date range. Parameters:

  - increment - allowed: `day`,`month`,`year`; default: `year`
  - population - allowed: `all`,`student`,`faculty`,`staff`; default: `all`
  - startDate - format as yyyy-mm-dd; default: first known usage
  - endDate - format as yyyy-mm-dd: default: today

- `/stats/repeatData` - Raw JSON counting: of all the MyGuide users over a set time period, how many used the service once, or twice, or more times. Parameters:
  - population - allowed: `all`,`student`,`faculty`,`staff`; default: `all`
  - startDate - format as yyyy-mm-dd; default: first known usage
  - endDate - format as yyyy-mm-dd: default: today
  - breakpoint - set the point above which N-or-more uses will be grouped together, e.g. "10+ uses"; default: `10`

When the `/usage` and /`repeatUsers` stats views load, they include a "Raw Data" link configured to retreive the same JSON data that created the graphs. You can use that as a short-cut to configuring stats queries.

## Server Migration Guide

When migrating the MyGuide app to a new server, you will need to copy or update the following files/configurations:

- obtain new SSL certificate and key files
- get permission from CAS server to use new server's URL
- copy config files
- Update `config/default.json`:
  - `allowedUsersCommaSeparated`
  - `app.port`
  - `server.key` and `server.cert` paths
  - `viewConfigs.googleAnalyticsTrackingId` (if applicable)
- copy over custom images in `/public/img` folder
- copy over custom files in `/views/partials` folder
- copy over custom subjects in `/cache/custom` folder

## Credits

Developed by Ken Irwin at Miami University, 2020-present. Visual design of the main dashboard layout by Meng Qu.
