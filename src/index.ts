import cytoscape from 'cytoscape'
import cola from 'cytoscape-cola'
import popper from 'cytoscape-popper'
import { GrapholscapeConfig } from './config/config'
import { loadConfig } from './config/config-manager'
import Grapholscape from './core/grapholscape'
import Ontology from './model'
import GrapholParser from './parsing/parser'
import * as UI from './ui'

cytoscape.use(popper)
cytoscape.use(cola)

// export { default as Grapholscape} from './grapholscape'
// export { fullGrapholscape } from './index.full'
// export { UI } from './index.full'
// export * from './model/node-enums'
// export { default as grapholEnums } from './model/node-enums'
// export { themes }
// export * from './config/config-manager'
// export * from './util/model-obj-transformations'
//export { GrapholscapeRenderer } from './rendering/renderers'

/**
 * Create a bare instance of Grapholscape, only diagrams, no UI
 * @param {string | object} file the ontology, can be an object of the 
 * [Web API interface File](https://developer.mozilla.org/en-US/docs/Web/API/File) 
 * or a String representing the .graphol file to be displayed
 * @param {object} container a DOM element in which the ontology will be rendered in
 * @param {object} config a config object, please read more about [settings](https://github.com/obdasystems/grapholscape/wiki/Settings)
 * @returns a promise that will be fulfilled with a Grapholscape object
 * @tutorial Settings
 * @tutorial Themes
 */
export async function fullGrapholscape(file: string | File, container: HTMLElement, config?: GrapholscapeConfig) {
  const grapholscape = await getGrapholscape(file, container, config)
  if (grapholscape)
    UI.initUI(grapholscape)
  return grapholscape
}

export function grapholscape(file: string | File, container: HTMLElement, config?: GrapholscapeConfig) {
  return getGrapholscape(file, container, config)
}

async function getGrapholscape(file: string | File, container: HTMLElement, config?: GrapholscapeConfig) {
  if (!file || !container) {
    console.error('Please specify an ontology and a container for Grapholscape')
    return undefined
  }

  const savedConfig = loadConfig()
  // copy savedConfig over config
  config = Object.assign(config, savedConfig)
  return new Promise<Grapholscape>((resolve, reject) => {
    let ontology: Ontology

    if (typeof (file) === 'object') {
      let reader = new FileReader()

      reader.onloadend = () => {
        try {
          ontology = getResult(reader.result)
          init()
        } catch (error) { reject(error) }
      }

      reader.readAsText(file)

      setTimeout(() => {
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
        const gscape = new Grapholscape(ontology, container, config)
        resolve(gscape)
      } catch (e) { console.error(e) }
    }
  })

  function getResult(file) {
    return new GrapholParser(file).parseGraphol()
  }
}