import "core-js/stable"
import "regenerator-runtime/runtime"
import "@webcomponents/webcomponentsjs"
import '@material/mwc-icon'
import '@material/mwc-icon-button'
import GrapholParser from './parsing/parser'
import GrapholscapeView from './view/view'
import GrapholscapeController from './grapholscape-controller'
import cytoscape from 'cytoscape'
import popper from 'cytoscape-popper'
import cola from 'cytoscape-cola'
import cy_svg from 'cytoscape-svg'

cytoscape.use(popper)
cytoscape.use(cola)
cytoscape.use(cy_svg)

export default function GrapholScape(file, container = false, config = null) {
  if (!container) return undefined

  let view = new GrapholscapeView(container)

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
      let controller = new GrapholscapeController(ontology,view,config)
      controller.init()
      resolve(controller)
    }
  })
  .catch(error => view.showDialog(error.name, error.message) )
  .finally( () => view.spinner.hide() )

  function getResult(file) {
    let graphol_parser = new GrapholParser(file)
    return graphol_parser.parseGraphol()
  }
}
