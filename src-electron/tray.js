import { app, Menu, Tray, nativeImage, BrowserWindow } from 'electron'
import path from 'path'

const createTray = (createWindow) => {
    const trayIcon = nativeImage.createFromPath(path.resolve(__dirname, 'icons/icon.png')).resize({ width: 16, height: 16 })
    const tray = new Tray(trayIcon)

    function updateContextMenu() {
        const isVisible = BrowserWindow.getAllWindows().some(win => win.isVisible())
        const showHideLabel = isVisible ? 'Hide' : 'Show'
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
        const windows = BrowserWindow.getAllWindows()
        const isVisible = windows.some(win => win.isVisible())

        if (isVisible) {
            for (const window of windows) {
                window.hide()
            }
        } else {
            createWindow()
        }
        updateContextMenu()
    }

    updateContextMenu()

    return {
        updateContextMenu
    }
}

export default createTray
