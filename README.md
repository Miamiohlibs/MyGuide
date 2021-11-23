# MyGuide

version 2 of an personalized, open-source library user dashboard

## Outline

- setup
  - updateLibGuidesCache (subjects, guides, librarians, databases)
- app

  - Basic function
    - login/getUserInfo (name, userid, subjects)
      - login + return user data (config different drivers: e.g. CAS, Shibboleth, OpenAthens)
      - map data to libguides subjects
      - generate user object with name, userid, subjects
    - fetchUserCustomizations (extra subjects, favorite databases/guides, etc)
      - return updated version of user object
    - fetchSubjectInfo (from cache by subject)
    - fetchCirculationRecord
    - log the hit (hashed name, usertype, subject areas)
  - Accept user customizations
    - favorite/unfavorite a subject or guide
    - add/remove an additional subject
    - review/recover hidden subjects
  - Stats routes

    - data routes
    - visualizations

  - View features / customizations
    - views/partials/custom-alert.ejs: displays a bootstrap alert at top of page if file exists
    - views/partials/custom-header-info.ejs: adds a block to the page header such as for a Google Analytics tracker
