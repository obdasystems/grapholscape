// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain , dialog, nativeImage} = require('electron')
const fs = require('fs')
const path = require('path')
const recentsManager = require('./recent-files-manager')

recentsManager.readRecentFiles()

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let introWindow
let gscapeWindow
const appIcon = nativeImage.createFromPath(path.resolve(__dirname, 'assets', 'icon-128.png'))

function createIntroWindow () {
  // Create the browser window.
  introWindow = new BrowserWindow({
    width: 750,
    height: 600,
    show: false,
    autoHideMenuBar: true,
    resizable: false,
    icon: appIcon,
    webPreferences: {
      preload: path.join(__dirname, 'intro', 'preload.js')
    },
    title: 'Grapholscape Desktop'
  })

  // and load the index.html of the app.
  introWindow.loadFile(path.resolve(__dirname, 'intro', 'index.html'))
  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  introWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    introWindow = null
  })

  introWindow.once('ready-to-show', () => {
    introWindow.show()
  })

  introWindow.webContents.send('version', app.getVersion())
  introWindow.webContents.send('recents-update', recentsManager.recents)
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createIntroWindow)

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
  if (introWindow === null) {
    createIntroWindow()
  }
})

function useGrapholscape(file) {
  gscapeWindow = new BrowserWindow({
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'graphol', 'preload.js')
    },
    autoHideMenuBar: true,
    icon: appIcon
  })

  gscapeWindow.maximize()
  gscapeWindow.loadFile(path.resolve(__dirname, 'graphol','grapholscape-window.html'))
  gscapeWindow.webContents.on('did-finish-load', () => {
    gscapeWindow.webContents.send('start', file.string, file.grapholPath)
  })

  gscapeWindow.on('closed', () => {
    gscapeWindow = null
    introWindow.show()
  })

}

/**
 * invoked by intro renderer process when user select a file to be used
 * either from the recently used files list or dropping a file in the 
 * drag-drop box
 */
ipcMain.handle('use-graphol-path', (e, grapholPath) => {
  recentsManager.logRecentFile(grapholPath)
  getFileString(grapholPath, useGrapholscape)
  return recentsManager.recents
})

/**
 * invoked by intro renderer process when user click on drag-drop box
 * for selecting a file from a dialog
 */
ipcMain.handle('select-file', async e => {
  await dialog.showOpenDialog({
    title: 'Seleziona un File .graphol',
    properties : ['openFile'],
    filters: [
      { name: 'Graphol', extensions: ['graphol'] },
      { name: 'All Files', extensions: ['*'] }
    ],
  }).then( result => {
    if (!result.canceled) {
      recentsManager.logRecentFile(result.filePaths[0])
      getFileString(result.filePaths[0], useGrapholscape)
    }
  }).catch( reason => console.error(reason))

  return recentsManager.recents
})

/**
 * invoked by intro renderer process when user delete a recently used file
 */
ipcMain.handle('delete-recent', (e, grapholPath) => {
  recentsManager.deleteRecentFile(grapholPath)
  return recentsManager.recents
})

/**
 * invoked by grapholscape renderer process when initialisation has finished
 * and grapholscape is ready to be used
 */
ipcMain.on('gscape-ready', () => {
  gscapeWindow.show()
  introWindow.hide()
})

ipcMain.on('gscape-error', (e, filePath, error) => {
  dialog.showMessageBox({
    type: 'error',
    title: 'Unable to use selected file',
    message: 'Selected file cannot be used, please check it\'s of the right format and of an admitted Graphol version (ie. > 2)\n\
    Error: '+error,
    buttons: ['OK'],
  }).then( () => {
    recentsManager.deleteRecentFile(filePath)
    introWindow.webContents.send('recents-update', recentsManager.recents)
    gscapeWindow.close()
  })
})

function getFileString(grapholPath, callback) {
  fs.readFile(grapholPath, 'utf-8', (err, string) => {
    if (err) {
      if(err.code === 'ENOENT') {
        dialog.showMessageBox({
          type: 'warning',
          title: 'Warning',
          message: 'Selected file does not exist anymore, it will be removed from the list.',
          buttons: ['OK'],
        }).then( () => {
          recentsManager.deleteRecentFile(grapholPath)
          introWindow.webContents.send('recents-update', recentsManager.recents)
        })
      }
      console.error("An error ocurred reading the file :" + err.message);
        return;
    }

    let file = { string, grapholPath}
    callback(file)
  })
}