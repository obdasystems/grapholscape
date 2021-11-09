import "core-js/stable"
import "regenerator-runtime/runtime"
import "@webcomponents/webcomponentsjs"
import '@material/mwc-icon'
import '@material/mwc-icon-button'
import GrapholParser from './parsing/parser'
import cytoscape from 'cytoscape'
import popper from 'cytoscape-popper'
import cola from 'cytoscape-cola'

import initGUI from './ui-init'


import Grapholscape from './grapholscape'

cytoscape.use(popper)
cytoscape.use(cola)

export default function (file, container, config = null) {
  if (!container) return undefined

  //let view = new GrapholscapeView(container)
  /*
  renderersManager.addRenderer('Graphol', renderers.default)
  renderersManager.addRenderer('Lite', renderers.liteRenderer)
  renderersManager.setRenderer('Graphol')
  renderersManager.setContainer(container)
  */
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
      //let controller = new GrapholscapeController(ontology,view,config)
      //controller.init()
      //resolve(controller)
    }
  })
  .catch(error => console.log(error) )

  function getResult(file) {
    return new GrapholParser(file).parseGraphol()
  }
}
