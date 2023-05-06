# Changelog
All notable changes to this project will be documented in this file.

## Changelog format guideline
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

### vMAJOR.MINOR.PATCH - YYYY-MM-DD

- Added new features.
- Changed existing functionality.
- Deprecated soon-to-be removed features.
- Removed features.
- Fixed bugs.
- Security in case of vulnerabilities.

## [BACKLOG]

### [MAJOR]

### [MINOR]
- Add support for displaying release notes in application.
- Change coding style to using ';' at the end of lines.
- Remove Vetur related VSCode extension related configs. 
- Add lint rules: vue3-strongly-recommended.

### [PATCH]

### [FUTURE]

### [KNOWN-BUGS]
- Sometimes, when darkMode is 'auto', and OS system wide dark mode setting is changed to 'auto', the header/input field turns black.
- Fix the white flickering at app launch which still remains.

## [IN-PROGRESS]
- Add option to send only the latest question or entire conversation when calling OpenAI API.

## v0.1.4 - [UNRELEASED]

## v0.1.3 - 2023-05-06
- Fixed typo in package.json script yarn relesae -> release.
- Added more information in README.md.

## v0.1.2 - 2023-05-06
- Added package.json script release:publish to publish a draft release on GitHub and marks it as latest.
- Renamed package.json scripts to align with the intended CI/CD steps.

## v0.1.1 - 2023-05-05
- Changed parameter setting in release:public, removed =false from --draft.

## v0.1.0 - 2023-05-04
- Added support for electron-updater events and logging of update steps to console.
- Added electron-log to provide for propper logging in main.
- Added support for automatic application updates using electron-uodater.

- Add support for application signing and notarization on Mac (electron-builder-notarize).
- Add electron-build artifactName med common for all platforms and set to '${productName}-${version}-${os}-${arch}.${ext}'
- Add separate mac build targets for Intel based (x64) and M1 Apple silicon (arm64) macs
- Add build targets: linux (deb and tar.gz) and windows (portable).

- Add automatic inclusion of package version when creating draft release on GitHub.
- Add package.json script - git:push - to do add, commit and push changes.
- Add package.json script - cicd - to push changes, build and publish artefacts, and create release in private repo.
- Add package.json script - release:public - to extract changes related to this version from CHANGELOG.md and pass it to gh create release and add release-notes to this release.
- Add chained scripts in package.json - release:mac and release:all - to create draft release, build and upload artefacts, and publish release to stoqster-releases.

## Done
- Changed visualization of loading from q-spinner to q-skeleton.
- Fixed Mermaid diagrams lower in the list disappearing when a new diagram is displayed.
- Added 'auto' to dark mode setting so controlled by the OS darkmode setting.
- Added theme-source=system to electron-main, so OS darkmode setting can be used.
- Fixed loading icon active for all ai responses when waiting for new response.
- Changed error handling to be able to include more information from response when possible.
- Fixed window size growing outside of screen when new content is added.
- Fixed window size not being possible to change using Magnet when content fills screen.
- Changed window minimum size and size to bouble when devtools is opened. Reset when devtools is closed.
- Added support for Notify plugin to be able to display error messages to the user.
- Added error handling of lack of apiKey.
- Added better error handling of fetch() response. Timeout and error codes.
- Changed input field focus indication color to deep-orange.
- Fixed positioning of copy to clipboard icon.
- Added support for Mermaid diagrams and flowcharts in the markdown.
- Changed to show window after contents have been loaded and rendered.
- Added the ability to copy code to the clipboard from the OpenAI response text.
- Removed VueShowdown in favour of Quasar plugin/component QMarkdown based on markdown-it.
- Added automatic growing and shrinking of app window based on content. Plan was to show only input field, but app window became too small to display settings, so must set larger window height.
- Fixed dark/light mode not being applied at application start. Removed unused getters from settings store.
- Add CHANGELOG.md file to keep documented track of changes and a backlog.
- Added yarn.lock to source control to ensure that Yarn installs the same exact dependency tree across all machines.
- Added support for storing settings in IndexedDB by using LocalForage
- Added import of environment variables from .env file.
- Changed the positioning of the question input field to be fixed to the bottom of the page.
- Added coloring to the icons used. 
- Added QPageScroller when there is new content on page and to allow to scroll to bottom.