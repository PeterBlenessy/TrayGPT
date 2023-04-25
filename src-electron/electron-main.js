import { app, BrowserWindow, nativeTheme, globalShortcut } from 'electron'
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
        minWidth: 800,
        maxWidth: 800,
        minHeight: 60,
        height: 400,
        maxHeight: 800,
        frame: false,
        transparent: true,
        webPreferences: {
            enablePreferredSizeMode: true,
            contextIsolation: true,
            // More info: https://v2.quasar.dev/quasar-cli-vite/developing-electron-apps/electron-preload-script
            preload: path.resolve(__dirname, process.env.QUASAR_ELECTRON_PRELOAD)
        }
    })

    mainWindow.loadURL(process.env.APP_URL)

    if (process.env.DEBUGGING) {
        // if on DEV or Production with debug enabled
        //mainWindow.webContents.openDevTools()
    } else {
        // we're on production; no access to devtools pls
        mainWindow.webContents.on('devtools-opened', () => {
            mainWindow.webContents.closeDevTools()
        })
    }

    mainWindow.webContents.on('did-finish-load', () => {
        const size = mainWindow.getContentSize()
        mainWindow.setMinimumSize(size[0], size[1])
        console.log(size)
    })

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

    mainWindow.webContents.on('preferred-size-changed', (event, size) => {

        if (size.width != 0 && size.height != 0) {
            mainWindow.setSize(size.width, size.height)
        }
        console.log(size)
    })
}


app.on('ready', () => {
    createWindow()
    tray = createTray(createWindow)
    let ret = globalShortcut.register('CommandOrControl+Shift+Space', () => {
        createWindow()
    })

    if (!ret) { console.log('Registration of CommandOrControl+Shift+Space failed.') }

    ret = globalShortcut.register('Escape', () => {
        app.hide()
    })
    if (!ret) { console.log('Registration of Escape failed.') }
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

app.on('will-quit', () => {
    globalShortcut.unregisterAll()
})
