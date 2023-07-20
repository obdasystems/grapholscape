const fs = require('fs')
const readline = require('readline')

fs.truncate('./src/model/rdf-graph/swagger/models/index.ts', 0, async () => {
  console.log('index.ts cleared')

  const readStream = fs.createReadStream('./src/model/rdf-graph/swagger/.openapi-generator/FILES')
  const writeStream = fs.createWriteStream('./src/model/rdf-graph/swagger/models/index.ts', { flags: 'a' })

  const rl = readline.createInterface({ input: readStream, crlfDelay: Infinity })
  let fileName
  for await (const line of  rl) {
    if (line.startsWith('models')) {
      fileName = line.replace('models/', '')
      fileName.trim()
      if (fileName.endsWith('.ts')) {
        fileName = fileName.replace('.ts', '')
      }
      writeStream.write(`export * from './${fileName}'\n`)
      console.log(`wrote export for: "${fileName}"`)
    }
  }

  writeStream.close()
  readStream.close()
})