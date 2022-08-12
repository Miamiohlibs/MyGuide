# MyGuide

A personalized, open-source library user dashboard. Integrates with campus authentication, LibGuides, and local settings to show users librarians, subject guides, and databases pertinent to their interests.

Note: this project integrates closely with campus resources and will require some development to work your environment. Please contact Ken Irwin at [irwinkr@miamioh.edu](mailto:irwinkr@miamioh.edu) to help get this set up.

## Requirements

- server running Node.js
- access to SpringShare's LibGuides + LibGuides API
- an authentication system (currently only supports CAS, but modules could be written for other systems)

## Configuration

- copy `config/default_sample.json` to `config/default.json`
- copy `config/fakeUserConf_sample.json` to `config/fakeUserConf.json`

- customize configs for your environment

  - if running on a server, note the path to an OpenSSL key/cert pair on your server
  - enter the LibGuides API credentials and set the "groups" equal to whichever LibGuides group IDs contain your libraries' content. (If you share a LibGuides installation with other campuses or units, there may be several group ids. By default, group 0 may be the only one you need.)
  - configuring to work with campus authentication is beyond the scope of this document so far. Please [contact Ken](mailto:irwinkr@miamioh.edu)

  - the `allowedUsersCommaSeparated` defines which users can start/stop the service on the command line using the './killapp' and './restart' scripts. This setting is a comma separated list, not a true JSON array, e.g.: `"root,fred,wilma"`

  - CAS.exposeStatsOutsideCas -- default `false`. If set to `true`, the `/stats/` routes (for data and visualizations) will be available to non-logged in users.

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

### abbreviated test setup

There are a lot of configurations to set up to run MyGuide. You can do a more abbreviated test just to make sure that Apache is correctly configured to serve content from the app. To do this:

- copy `config/default.json` to a safe place if you've been setting it up.
- copy `config/default_barebones_sample.json` to `config/default.json`
- set the port, servername, and the path to the SSL certificate and key files in `config/default.json`
- run `node install-test`
- that will start a very simple web server; go to `{yourserver}:{PORT}/install`; if Apache is configured to serve content from the app, you should see a message reading: "If you can read this, the app is serving the install page."

### full setup

- Once you've configured the LibGuides portion of the `config/default.json` file, you can run `./getData` to fetch subject, librarian, guide, and database data from the LibGuides API. (You can check on those files in the `./cache` folder. Additional subject subject mapping will be required before you can create the cached subject files, however.

## Content Security Policy

A Content Security Policy (CSP) is a computer security standard introduced to prevent cross-site scripting (XSS) attacks. MyGuide includes some basic CSP settings, but additional local permissions will likely be needed. In `config/default.json`, add to the server.csp settings to permit calls to specific servers for externally sourced scripts, stylesheets, images, etc. Here is an example of what those settings might look like:

```
        "csp": {
            "scriptSrcAdditions": "api3.libcal.com v2.libanswers.com",
            "imgSrcAdditions": "libapps.s3.amazonaws.com lcimages.s3.amazonaws.com",
            "frameSrcAdditions": "api3.libcal.com libanswers.lib.miamioh.edu"
        }
```

The `scriptSrcAdditions` allow the LibCal and LibAnswers servers to permit certain SpringShare widgets to operate.

The `imgSrcAdditions` allow librarian photos to load from the Libapps server on Amazon AWS.

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

## Credits

Developed by Ken Irwin at Miami University, 2020-present. Visual design of the main dashboard layout by Meng Qu.
