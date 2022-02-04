const path = require('path')
const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld(
  'recents',
  {
    deleteRecent: (filePath) => deleteRecentFile(filePath),
    selectFileFromDialog: () => selectFileFromDialog(),
    useGrapholPath: (filePath) => useGrapholPath(filePath)
  }
)

ipcRenderer.on('version', (e, version) => {
  document.getElementById('version').innerHTML = 'App Version: ' + version
})

ipcRenderer.on('recents-update', (e, recents) => {
  updateRecentList(recents)
})

function deleteRecentFile(filePath) {
  ipcRenderer.invoke('delete-recent', filePath).then( recents => {
    updateRecentList(recents)
  })
}

function selectFileFromDialog() {
  ipcRenderer.invoke('select-file').then(recents => {
    updateRecentList(recents)
  })
}

function useGrapholPath(filePath) {
  ipcRenderer.invoke('use-graphol-path', filePath).then( recents => {
    updateRecentList(recents)
  })
  //logRecentFile(filePath)
}

function addRecentFileEntry(filePath, fileName) {
  let name = 
    fileName || 
    filePath.slice(filePath.lastIndexOf(path.sep)+1, -8) // 8 is the length of ".graphol" 
  
  let recentList = document.getElementById('recent-files').getElementsByTagName('ul')[0]

  let li = document.createElement('li')
  li.setAttribute('name', name)
  li.setAttribute('path', filePath)
  li.setAttribute('title', filePath)

  let name_span = document.createElement('span')
  name_span.classList.add('name')
  name_span.innerHTML = name
  let path_span = document.createElement('span')
  path_span.classList.add('path')
  path_span.innerHTML = filePath
  let delete_icon = document.createElement('div')
  delete_icon.classList.add('delete-icon')
  delete_icon.onclick = (e) => {
    e.stopPropagation()
    deleteRecentFile(filePath)
  }
  delete_icon.setAttribute('title', 'Remove from list')

  li.appendChild(name_span)
  li.appendChild(path_span)
  li.appendChild(delete_icon)
  li.onclick = () => useGrapholPath(filePath)
  recentList.appendChild(li)
}

function updateRecentList(recents) {
  let recent_files = document.querySelector('#recent-files')
  recent_files.getElementsByTagName('ul')[0].remove()
  recent_files.appendChild(document.createElement('ul'))
  recents.forEach( filePath => addRecentFileEntry(filePath) )
}