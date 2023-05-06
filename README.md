# TrayGPT (traygpt)

TrayGPT is a platform-independent application that lives in the tray bar of your favorite OS, and is compatible with Windows, macOS, and Linux. It is powered by [Electron](https://electron.org), [Vue.js](https://vuejs.org) and [Quasar](https://quasar.dev), and provides a simple and intuitive user experience. It allows users to communicate with [GPT-based AI](https://openai.com) in a natural and conversational way, making it easy to access and generate information. It has build in chat session management, which enables users to easily dust off and return to those long forgotten topics.

## Use the built binaries
If you want to use the application, head to the [realeases](https://github.com/PeterBlenessy/TrayGPT/releases), select the binary for your OS, install it, and ask away.

### Settings
You will need an OpenAI API key to be able to use the application.

## Use the source code
If you want to build your own binaries or modify the code to fit your preferences, follow the below steps.

### Install the dependencies

```bash
yarn
# or
npm install
```

### Start the app in development mode (hot-code reloading, error reporting, etc.)

```bash
quasar dev -m electron
```

or, if you don't have the [Quasar Global CLI](https://quasar.dev/start/quick-start) installed,

```bash
yarn quasar dev -m electron
```

### Lint the files

```bash
yarn lint
# or
npm run lint
```

### Format the files

```bash
yarn format
# or
npm run format
```

### Build the app for production

```bash
yarn cicd
# This evaluates to 
# yarn git:push && yarn release:public && yarn publish:all
```
This commands starts a series of commands as can be seen in package.json:
* Push code to the Github repo, with commit comments extracted from CHANGELOG.md
* Create a draft release of this version
* Build the application for all configured architectures
* Sign the application binary
* Notarize the application with Apple notarization service
* Upload the resulting binaries to draft release
* Publish the release

### Customize the configuration

See [Configuring quasar.config.js](https://v2.quasar.dev/quasar-cli-vite/quasar-config-js).
