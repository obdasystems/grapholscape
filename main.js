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
    width: 800, 
    height: 600,
    show: false,
    webPreferences: {nodeIntegration: true}
  })

  // and load the index.html of the app.
  mainWindow.loadFile('app/index.html')
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

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
function useGrapholscape(fileString) {
  gscapeWindow = new BrowserWindow({
    show: false,
    webPreferences: {nodeIntegration: true}
  })
  
  gscapeWindow.maximize()
  gscapeWindow.loadFile('app/grapholscape-window.html')
  gscapeWindow.webContents.on('did-finish-load', () => {
    gscapeWindow.webContents.send('start', fileString)
  })

  gscapeWindow.on('close', () => {
    mainWindow.show()
  })
}

ipcMain.handle('use-dropped-graphol', (e, path) => {
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
  }).then( result => {
    if (!result.canceled)
      getFileString(result.filePaths[0], useGrapholscape)
  })
})

ipcMain.on('gscape-ready', () => {
  gscapeWindow.show()
  mainWindow.hide()
}) 

function getFileString(path, callback) {
  fs.readFile(path, 'utf-8', (err, str) => {
    if (err) {
      alert("An error ocurred reading the file :" + err.message);
        return;
    }
    
    callback(str)
  })
}