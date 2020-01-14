// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain , dialog} = require('electron')
const fs = require('fs')
const path = require('path')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow
let gscapeWindow

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 750,
    height: 600,
    show: false,
    webPreferences: {nodeIntegration: true},
    autoHideMenuBar: true,
    resizable: false,
  })

  // and load the index.html of the app.
  mainWindow.loadFile(path.resolve(__dirname, 'intro', 'index.html'))
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
  gscapeWindow.loadFile(path.resolve(__dirname, 'graphol','grapholscape-window.html'))
  gscapeWindow.webContents.on('did-finish-load', () => {
    gscapeWindow.webContents.send('start', file.string)
  })

  gscapeWindow.on('closed', () => {
    gscapeWindow = null
    mainWindow.show()
  })

}

ipcMain.handle('use-graphol-path', (e, grapholPath) => {
  getFileString(grapholPath, useGrapholscape)
})

ipcMain.handle('select-file', async e => {
  const result = await dialog.showOpenDialog({
    title: 'Seleziona un File .graphol',
    properties : ['openFile'],
    filters: [
      { name: 'Graphol', extensions: ['graphol'] },
      { name: 'All Files', extensions: ['*'] }
    ],
  }).then( result => {
    if (!result.canceled) {
      getFileString(result.filePaths[0], useGrapholscape)
      return result.filePaths[0]
    }
    else return null
  })

  return result
})

ipcMain.on('gscape-ready', () => {
  gscapeWindow.show()
  mainWindow.hide()
})

function getFileString(grapholPath, callback) {
  fs.readFile(grapholPath, 'utf-8', (err, string) => {
    if (err) {
      if(err.code === 'ENOENT') {
        dialog.showMessageBox({
          type: 'warning',
          title: 'Warning',
          message: 'Selected file does not exist, it will be removed from the list.'
        }).then( () => {
          mainWindow.webContents.send('remove-recent', grapholPath)
        })
      }
      console.log("An error ocurred reading the file :" + err.message);
        return;
    }

    let file = { string, grapholPath}
    callback(file)
  })
}