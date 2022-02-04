const { ipcRenderer, contextBridge } = require('electron')

let _filePath
contextBridge.exposeInMainWorld('graphol', {
  onStart: (callback) => ipcRenderer.on('start', (_, fileString, filePath) => {
      callback(fileString)
      _filePath = filePath
      ipcRenderer.send('gscape-ready')
    }),
  onError: (error) => ipcRenderer.send('gscape-error', _filePath, error)
})