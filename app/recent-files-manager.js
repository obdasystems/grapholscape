const { app } = require ('electron')
const fs = require('fs')
const path = require('path')

const recentsPath = path.join(app.getPath('userData'), 'recent-files')
const examplesPath = path.resolve(__dirname, 'examples')
const MAX_RECENTS = 10
exports.recents = []

exports.readRecentFiles = () => {

  try {
    const data = fs.readFileSync(recentsPath, 'utf-8')
    data.split(/\r?\n/g).forEach( filePath => {
      if (filePath.length > 1) {
        this.recents.unshift(filePath)
      }
    })
  } catch (e) { console.error(e) }

  // add examples in this.recents list only if it's empty
  if (this.recents.length === 0) {
    fs.readdirSync(examplesPath).forEach(example => {
      fs.readdirSync(path.join(examplesPath, example)).forEach(file => {
        let filePath = path.join(examplesPath, example, file)
        if (!this.recents.includes(filePath))
          this.recents.push(filePath)
      })
    })
    this.writeRecents()
  }
}

/**
 * Update the file with array of recent selected files
 * write the array in reverse so when we read the file the first row will be the oldest path
 * and last one will be the last path used in grapholscape. (easy to create the list in the ui)
**/
exports.writeRecents = () => {
  fs.writeFile(recentsPath, this.recents.reverse().join('\n'), (err) => {return})
  this.recents.reverse()
}

exports.logRecentFile = (filePath) => {
  let index = this.recents.indexOf(filePath)

  if (index != -1) {
    this.recents.splice(index, 1)
  }
  this.recents.unshift(filePath)
  /* 
  if we exceed the max number of recent files, then the file to log is not already in the 
  list so we need to delete the last element in the array.
  */
  if(this.recents.length > MAX_RECENTS)
    this.recents.pop()

  this.writeRecents()
}

exports.deleteRecentFile = (filePath) => {
  let index = this.recents.indexOf(filePath)

  if (index == -1)
    return

  this.recents.splice(index, 1)

  this.writeRecents()
}