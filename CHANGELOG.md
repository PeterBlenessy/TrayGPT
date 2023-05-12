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
- Add support for storing conversations individually. Andobviously a conversations list.
- Add support for OpenAI model configuration on a per conversation basis. Persist settings with conversation.
- Add application description.
- Add option to use model priming message.
- Move OpenAI API calls to separate module so it can be used from other components.
- Add support for generating images using dall-e as AI model.
- Populate the list of supported modules by fetching them from OpenAI API.
- Add support for displaying release notes in application.
- Change coding style to using ';' at the end of lines.
- Remove Vetur related VSCode extension related configs. 
- Add lint rules: vue3-strongly-recommended.

### [PATCH]
- Fix. Sometimes, when darkMode is 'auto', and OS system wide dark mode setting is changed to 'auto', the header/input field turns black.
- Fix the white flickering at app launch which still remains.
- Fix the Esc shortcut which minimizes the app steels Esc from other apps. Try to make it only work when app is in focus, or pass the event through to other apps.
- Change relevant Notofy messages to be sticky until closed so the user has time to read and understand what went wrong.
- Change copy-to-clipboard text color from yellow to dark-orange.
- Fix responses with API errors being animated when next response is awaited.
- Fix settings and conversations are stored as keys, when it should be tables (storeName).
- Sending wrong formated messages to OpenAI API, returns error code 400. Not documented.

## [IN-PROGRESS]
- Add option to send only the latest question or entire conversation when calling OpenAI API.

## v0.1.11 - [UNRELEASED]

## v0.1.10 - 2023-05-11
- Fixed dates in releases.

## v0.1.9 - 2023-05-11
- Fixed i18n typos.
- Add option to send only the latest question or entire conversation when calling OpenAI API. Plus settings.

## v0.1.8 - 2023-05-10
- Add support for storing conversation in IndexeDB.
- Add support to restore last conversation. 
- Add option to clear conversations, both in ui and in dB.
- Removed storeName: settings from storage configuration IN pinia-localforage-plugin.js as that is not the only storeName (table) we are using.

## v0.1.7 - 2023-05-10
- Changed copy-to-clipboard icon color from yellow -> dark-orange
- Added padding arround the markdown container to increase the copy-to-clipboard button visibility by not overlaping with the text.
- Added copy-to-clipboard to user text to simplify the use case of re-formulating a previous question.

## v0.1.6 - 2023-05-10
- Removed dependency github-markdown-css.
- Added package.json script build:linux to build for linux.
- Added support for using i18n for localization. Only supporting en-US for now.

## v0.1.5 - 2023-05-07
- Changed application icons to be based on image generated using Bing Image Creator (DALL-E) with blue eyes.
- Changed settings icon from settings -> tune, to be more in line with the slides used in settings component.

## v0.1.4 - 2023-05-07
- Changed application icons to be based on image generated using Bing Image Creator (DALL-E).

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