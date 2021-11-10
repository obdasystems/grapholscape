import GrapholParser from './parsing/parser'
import cytoscape from 'cytoscape'
import popper from 'cytoscape-popper'
import cola from 'cytoscape-cola'

import initGUI from './gui'


import Grapholscape from './grapholscape'

cytoscape.use(popper)
cytoscape.use(cola)

export default function (file, container, config = null) {
  if (!container) return undefined

  return new Promise ((resolve, reject) => {
    let ontology = null

    if (typeof (file) === 'object') {
      let reader = new FileReader()

      reader.onloadend = () => {
        try {
          ontology = getResult(reader.result)
          init()
        } catch (error) { reject(error) }
      }

      reader.readAsText(file)

      setTimeout( () => {
        reject('Error: timeout expired')
      }, 10000)

    } else if (typeof (file) === 'string') {
      ontology = getResult(file)
      init()
    } else {
      reject('Err: Grapholscape needs a Graphol File or the corresponding string to be initialized')
    }

    function init() {
      try {
        let grapholscape = new Grapholscape(ontology, container, config)
        initGUI(grapholscape)
        resolve(grapholscape)
      } catch (e) { console.log(e)}
    }
  })
  .catch(error => console.log(error) )

  function getResult(file) {
    return new GrapholParser(file).parseGraphol()
  }
}
