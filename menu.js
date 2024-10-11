const { ipcMain } = require("electron")
const { Menu, MenuItem } = require("electron/main")

let mainMenu = new Menu()
mainMenu.append(new MenuItem({
    label: "Main",
    submenu: [
        {
            role: 'preference',
            accelerator: process.platform === 'darwin' ? 'Cmd+.' : 'Ctrl+.',
            click: () => { ipcMain.emit("menu-preferences") }
        },
        {
            role: 'reload',
            accelerator: process.platform === 'darwin' ? 'Cmd+R' : 'Ctrl+R',
            click: () => { ipcMain.emit("menu-reload") }
        },
        {
            role: 'debug',
            accelerator: process.platform === 'darwin' ? 'Cmd+D' : 'Ctrl+D',
            click: (e,f,g) => { ipcMain.emit("menu-debug", e,f,g) }
        },
        {
            role: 'restore-or-quit',
            accelerator: 'Esc',
            click: () => { ipcMain.emit("menu-restore-or-quit") }
        }
    ]
}))

Menu.setApplicationMenu(mainMenu)

module.exports = { mainMenu }