import { app, BrowserWindow, nativeTheme, globalShortcut, screen } from 'electron'
import path from 'path'
import os from 'os'
import createTray from './tray.js'

// needed in case process is undefined under Linux
const platform = process.platform || os.platform()

nativeTheme.themeSource = 'system'

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
        width: 800,
        minHeight: 60,
        height: 400,
        titleBarStyle: 'customButtonsOnHover',
        center: true,
        show: false,
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

    // Don't show the window until it's ready. This should prevent any white flickering
    mainWindow.once('ready-to-show', () => {
        mainWindow.show()
    })

    mainWindow.on('show', () => {
        tray.updateContextMenu()
    })

    mainWindow.on('hide', () => {
        tray.updateContextMenu()
    })

    mainWindow.on('closed', () => {
        mainWindow = null
        tray.updateContextMenu()
    })

    // Preferred size changes when new content is added and rendered outside of the window bounds
    mainWindow.webContents.on('preferred-size-changed', (event, size) => {
        // Check if the size is not zero (happens for some reason when settings dialog is opened)
        if (size.width === 0 || size.height === 0) {
            return;
        }

        // Make sure that the window's new width and size are within the screen boundaries
        const currentScreen = screen.getDisplayMatching(mainWindow.getBounds())
        const screenSize = currentScreen.size
        const windowBounds = mainWindow.getBounds()

        const newWidth = (windowBounds.x + size.width) < screenSize.width ? size.width : (screenSize.width - windowBounds.x)
        const newHeight = (windowBounds.y + size.height) < screenSize.height ? size.height : (screenSize.height - windowBounds.y)

        // Set the new size for the window
        mainWindow.setSize(newWidth, newHeight)
    })

    // When devtools is opened, double the window width and center it
    mainWindow.webContents.on('devtools-opened', () => {
        const windowSize = mainWindow.getSize()
        mainWindow.setSize(windowSize[0] * 2, windowSize[1])
        mainWindow.setMinimumSize(windowSize[0] * 2, windowSize[1])
        mainWindow.center()
    })

    // When devtools is closed, reset the window width and center it
    mainWindow.webContents.on('devtools-closed', () => {
        const windowSize = mainWindow.getSize()
        mainWindow.setMinimumSize(800, 60)
        mainWindow.setSize(windowSize[0] / 2, windowSize[1])
        mainWindow.center()
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
