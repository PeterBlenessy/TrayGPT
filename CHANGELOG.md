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
- Add electron-build artifactName med common for all platforms and set to '${productName}-${version}-${os}-${arch}.${ext}'
- Add separate mac build targets for Intel based (x64) and M1 Apple silicon (arm64) macs
- Add build targets: linux (deb and tar.gz) and windows (portable).
- Add support for application signing and notarization on Mac (electron-builder-notarize).

- Add automatic inclusion of package version when creating draft release on GitHub.
- Add package.json script - git:push - to do add, commit and push changes.
- Add package.json script - cicd - push changes, build and publish artefacts, and create release in private repo.
- Add scripts - release:private and release:public - to extract relevant release notes from CHANGELOG.md and pass it to gh create release release-notes to the private and to teh public repo respectively.
- Add chained scripts in package.json - release:mac and release:all - to create draft release, build and upload artefacts, and publish release to stoqster-releases.

- Add support for automatic application updates.
- Add support for electron-updater events and logging of update steps to console.
- Add Notify plugin. App now notifies if something goes wrong during refresh in all components.
- Add electron-log to provide for propper logging in main.

### [MINOR]
- Add support for displaying release notes in application.
- Add support for catching and handling fetch() errors, e.g., Failed to load resource: the server responded with a status of 500.
- Change webPreferences.webSecurity: false, so fetch() can be used from the renderer process.
- Change coding style to using ';' at the end of lines.
- Remove Vetur related VSCode extension related configs. 
- Add lint rules: vue3-strongly-recommended.

### [PATCH]

### [FUTURE]

## [IN-PROGRESS]
- Add support for Notify plugin to be able to display error messages to the user.
- Add error handling of lack of apiKey.
- Add better error handling of fetch() response. Timeout and error codes.

## v0.1.0 - [UNRELEASED]

## Done
- Added support for Mermaid diagrams and flowcharts in the markdown. Changed to show window after contents have been loaded and rendered.
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

