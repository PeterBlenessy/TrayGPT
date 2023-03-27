import { app, Menu, Tray, nativeImage, BrowserWindow } from 'electron'
import path from 'path'

let tray = null

function createTray() {
    const trayIcon = nativeImage.createFromPath(path.resolve(__dirname, 'icons/icon.png')).resize({ width: 16, height: 16 })
    tray = new Tray(trayIcon)
    updateContextMenu()
}

function updateContextMenu() {
    const isVisible = BrowserWindow.getAllWindows().some(win => win.isVisible())
    const showHideLabel = isVisible ? 'Hide App' : 'Show App'
    const contextMenu = Menu.buildFromTemplate([
        {
            label: showHideLabel,
            click: toggleVisibility
        },
        { type: 'separator' },
        {
            label: 'Quit',
            click: function () {
                app.isQuitting = true
                app.quit()
            }
        }
    ])
    tray.setToolTip('This is my application.')
    tray.setContextMenu(contextMenu)
}

function toggleVisibility() {
    const isVisible = BrowserWindow.getAllWindows().some(win => win.isVisible())
    BrowserWindow.getAllWindows().forEach(win => {
        if (isVisible) {
            win.hide()
        } else {
            win.show()
        }
    })
    updateContextMenu()
}

export default createTray