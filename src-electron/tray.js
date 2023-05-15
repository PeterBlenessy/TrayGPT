import { app, Menu, Tray, nativeImage, BrowserWindow } from 'electron'
import path from 'path'

const createTray = () => {
    const trayIcon = nativeImage.createFromPath(path.resolve(__dirname, 'icons/icon.png')).resize({ width: 16, height: 16 })
    const tray = new Tray(trayIcon)

    function updateContextMenu() {
        const isVisible = BrowserWindow.getAllWindows().some(win => win.isVisible())
        const showHideLabel = isVisible ? 'Hide' : 'Show'
        const contextMenu = Menu.buildFromTemplate([
            {
                label: showHideLabel,
                accelerator: 'CommandOrControl+H',
                click: () => {
                    if (isVisible) {
                        app.hide()
                    } else {
                        app.focus({ steal: true })
                        app.show()
                    }
                }
            },
            { type: 'separator' },
            {
                label: 'Quit',
                accelerator: 'CommandOrCtrl+Q',
                click: function () {
                    app.isQuitting = true
                    app.quit()
                }
            }
        ])
        tray.setToolTip('This is my application.')
        tray.setContextMenu(contextMenu)
    }

    updateContextMenu()

    return {
        updateContextMenu
    }
}

export default createTray
