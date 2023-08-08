const fs = require('fs')
const path = require('path')

const basePath = './src/incremental/api/swagger'

const apisToKeep = [
  'VKGApi.ts',
  'OntologyGraphApi.ts',
  'index.ts',
]

const modelsToKeep = [
  'OntologyPath.ts',
  'Highlights.ts',
  'Branch.ts',
  'Entity.ts',
  'index.ts',
]

deleteFilesFromDir(path.join(basePath, 'apis'), apisToKeep)
deleteFilesFromDir(path.join(basePath, 'models'), modelsToKeep)

function deleteFilesFromDir(dirPath, ignoreList) {
  fs.readdirSync(dirPath).forEach((value) => {
    if (!ignoreList.includes(value)) {
      fs.unlink(path.join(dirPath, value), (err) => err ? console.error(err) : null)
      console.log(`Removed: ${value}`)
    }
  })

  writeIndex(path.join(dirPath, 'index.ts'), ignoreList)
}

function writeIndex(indexPath, fileList) {
  fs.truncate(indexPath, 0, async () => {
    console.log('index.ts cleared')
    const writeStream = fs.createWriteStream(indexPath, { flags: 'a' })
  
    fileList.forEach(file =>  {
      if (file !== 'index.ts')
        writeStream.write(`export * from './${file.replace('.ts', '')}'\n`)
    })
  
    writeStream.close()
  })
}