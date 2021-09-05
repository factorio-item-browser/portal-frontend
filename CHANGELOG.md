# Changelog

## 1.4.1 - 2021-09-05

### Added

- Deleting local cache when a combination changed on the server.

## 1.4.0 - 2021-05-11

### Added

- Validation of uploaded mod list against the Portal API, showing reasons why the combination is invalid before it
  actually gets triggered for an export.
- More links to the Discord server to help users which may experience problems.
- Support for the full combination id in the URL.

### Changed

- Refactored some parts of the project, like the stores.
- Use entity name if translated label is empty.
- Settings related requests to match new Portal API version 1.5.0.

## 1.3.1 - 2021-02-01

### Fixed

- Failing to process savegames from Factorio 1.1.14 and newer due to a new optimized savegame structure. 

## 1.3.0 - 2020-10-06

### Added

- New item list page showing a grid of icons of all items.

## 1.2.0 - 2020-09-27

### Added

- Combination id to the URL of all pages.
- Temporary settings when a new combination id is encountered in the URL.

### Changes

- Adapted to the changes made to the API to enable temporary setttings.

## 1.1.2 - 2020-08-14

### Changed

- Image of broken machine for fatal error messages.
- Some wordings when adding a setting to match the now released Factorio 1.0 version.

## 1.1.1 - 2020-06-17

### Added

- Check for currently loaded script version, including a forced reload if it is not up-to-date.

## 1.1.0 - 2020-06-12

### Added

- Link to the Discord server to the footer.

### Changed

- Adding a setting now requires a savegame to be selected, not the mod-list.json file anymore.
- Arrangement of boxes and explanations on settings/new page.

## 1.0.0 - 2020-05-22

- Initial release of the portal frontend project.
