const {app, BrowserWindow} = require('electron')

app.on('ready', function() {
    let win = new BrowserWindow({
        width: 1024,
        height: 480,
        webPreferences: {
            plugins: true
        }
    })
    
    win.loadURL('file://' + __dirname + '/index.html')
    
    //for debugging
    win.openDevTools()
})

//Application IPC callbacks
const {ipcMain} = require('electron')

//choose a folder on the system
ipcMain.on('choose-folder', ( event, arg ) => {
    let dialog = require('electron')
    dialog.showOpenDialog({properties: ['openDirectory']})
})