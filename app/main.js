// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain } = require('electron')
const fs = require('fs')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow
let gscapeWindow

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({ 
    width: 750, 
    height: 550,
    show: false,
    webPreferences: {nodeIntegration: true},
    autoHideMenuBar: true,
    resizable: false,
  })

  // and load the index.html of the app.
  mainWindow.loadFile('app/intro/index.html')
  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })

  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

function useGrapholscape(file) {
  gscapeWindow = new BrowserWindow({
    show: false,
    webPreferences: {nodeIntegration: true},
    autoHideMenuBar: true,
  })
  
  gscapeWindow.maximize()
  gscapeWindow.loadFile('app/graphol/grapholscape-window.html')
  gscapeWindow.webContents.on('did-finish-load', () => {
    gscapeWindow.webContents.send('start', file.string)
  })

  gscapeWindow.on('closed', () => {
    gscapeWindow = null
    mainWindow.show()
  })

  app.addRecentDocument(file.path)
}

ipcMain.handle('use-graphol-path', (e, path) => {
  getFileString(path, useGrapholscape)
})

ipcMain.handle('select-file', e => {
  const { dialog } = require('electron')

  dialog.showOpenDialog({
    title: 'Seleziona un File .graphol',
    properties : ['openFile'],
    filters: [
      { name: 'Graphol', extensions: ['graphol'] },
      { name: 'All Files', extensions: ['*'] }
    ],
  }).then( result => !result.canceled ? getFileString(result.filePaths[0], useGrapholscape) : null )
})

ipcMain.on('gscape-ready', () => {
  gscapeWindow.show()
  mainWindow.hide()
}) 

function getFileString(path, callback) {
  fs.readFile(path, 'utf-8', (err, string) => {
    if (err) {
      alert("An error ocurred reading the file :" + err.message);
        return;
    }
    
    let file = { string, path }
    callback(file)
  })
}