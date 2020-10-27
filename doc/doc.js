var markdox = require('markdox');

const OUT_DIR = 'doc/'

const files = [
  // input, output file
  { path : 'src/grapholscape-controller.js', out : 'api.md'},
  { path : 'src/model/diagram.js', out : 'diagram.md'},
  { path : 'src/model/ontology.js', out : 'ontology.md'},
  { path : 'src/model/namespace.js', out : 'namespace.md'},
]

files.forEach( file => {
  const options = {
    output: OUT_DIR + file.out,
    dox : { skipSingleStar: true }
  }
  markdox.process(file.path, options, () => console.log(`Generated ${options.output}`))
})