# TrayGPT (traygpt)

TrayGPT is a platform-independent application that lives in the tray bar of your favorite OS, and is compatible with Windows, macOS, and Linux. It is powered by [Electron](https://electron.org), [Vue.js](https://vuejs.org) and [Quasar](https://quasar.dev), and provides a simple and intuitive user experience. It allows users to communicate with [GPT-based AI](https://openai.com) in a natural and conversational way, making it easy to access and generate information. It has build in chat session management, which enables users to easily dust off and return to those long forgotten topics.

## Install the dependencies

```bash
yarn
# or
npm install
```

### Start the app in development mode (hot-code reloading, error reporting, etc.)

```bash
quasar dev -m electron
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
quasar build
```

### Customize the configuration

See [Configuring quasar.config.js](https://v2.quasar.dev/quasar-cli-vite/quasar-config-js).
