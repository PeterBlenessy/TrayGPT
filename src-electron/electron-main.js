import { app, BrowserWindow, nativeTheme } from 'electron'
import path from 'path'
import os from 'os'
import createTray from './tray.js'

// needed in case process is undefined under Linux
const platform = process.platform || os.platform()

try {
    if (platform === 'win32' && nativeTheme.shouldUseDarkColors === true) {
        require('fs').unlinkSync(path.join(app.getPath('userData'), 'DevTools Extensions'))
    }
} catch (_) { }

let mainWindow = null
let tray = null

function createWindow() {
    // Check if a window already exists
    if (mainWindow !== null) {
        mainWindow.show()
        return
    }

    // Create a new window
    mainWindow = new BrowserWindow({
        icon: path.resolve(__dirname, 'icons/icon.png'), // tray icon
        width: 1000,
        height: 600,
        useContentSize: true,
        webPreferences: {
            contextIsolation: true,
            // More info: https://v2.quasar.dev/quasar-cli-vite/developing-electron-apps/electron-preload-script
            preload: path.resolve(__dirname, process.env.QUASAR_ELECTRON_PRELOAD)
        }
    })

    mainWindow.loadURL(process.env.APP_URL)

    if (process.env.DEBUGGING) {
        // if on DEV or Production with debug enabled
        mainWindow.webContents.openDevTools()
    } else {
        // we're on production; no access to devtools pls
        mainWindow.webContents.on('devtools-opened', () => {
            mainWindow.webContents.closeDevTools()
        })
    }

    mainWindow.on('closed', () => {
        mainWindow = null
        tray.updateContextMenu()
    })

    mainWindow.on('show', () => {
        tray.updateContextMenu()
    })

    mainWindow.on('hide', () => {
        tray.updateContextMenu()
    })
}


app.on('ready', () => {
    createWindow()
    tray = createTray(createWindow)
})

app.on('window-all-closed', () => {
    if (platform !== 'darwin') {
        app.quit()
    }
})


app.on('activate', () => {
    if (mainWindow === null) {
        createWindow()
    } else {
        mainWindow.show()
    }
})
