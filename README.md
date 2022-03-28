# MyGuide

A personalized, open-source library user dashboard. Integrates with campus authentication, LibGuides, and local settings to show users librarians, subject guides, and databases pertinent to their interests.

Note: this project integrates closely with campus resources and will require some development to work your environment. Please contact Ken Irwin at [irwinkr@miamioh.edu](mailto:irwinkr@miamioh.edu) to help get this set up.

## Requirements

- server running Node.js
- access to SpringShare's LibGuides + LibGuides API
- an authentication system (currently only supports CAS, but modules could be written for other systems)

## Configuration

- copy `config/default_sample.json` to `config/default.json`
- customize configs for your environment

  - if running on a server, note the path to an OpenSSL key/cert pair on your server
  - enter the LibGuides API credentials and set the "groups" equal to whichever LibGuides group IDs contain your libraries' content. (If you share a LibGuides installation with other campuses or units, there may be several group ids. By default, group 0 may be the only one you need.)
  - configuring to work with campus authentication is beyond the scope of this document so far. Please [contact Ken](mailto:irwinkr@miamioh.edu)

  - the `allowedUsersCommaSeparated` defines which users can start/stop the service on the command line using the './killapp' and './restart' scripts. This setting is a comma separated list, not a true JSON array, e.g.: `"root,fred,wilma"`

## Initial Setup

- run `npm install` to install Node package dependencies
- Once you've configured the LibGuides portion of the `config/default.json` file, you can run `./getData` to fetch subject, librarian, guide, and database data from the LibGuides API. (Youc can check on those files in the `./cache` folder. Additional subject subject mapping will be required before you can create the cached subject files, however.

## Starting/Stopping the Process

`./restart` will kill an existing MyGuide instance (if any) and start a fresh process.

`./killapp` will kill the process with restarting it. Note: this will only work if you started the process by using the `./restart` script.

## Credits

Developed by Ken Irwin at Miami University, 2020-present. Visual design of the main dashboard layout by Meng Qu.
