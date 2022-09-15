import cytoscape from 'cytoscape'
import cola from 'cytoscape-cola'
import popper from 'cytoscape-popper'
import { Ontology } from './model'
import GrapholParser from './parsing/parser'
import * as UI from './ui'
import Grapholscape from './core'
import { GrapholscapeConfig, loadConfig } from './config'

cytoscape.use(popper)
cytoscape.use(cola)

export * from './model'
export * from './config'
export * as ui from './ui'
export * from './core'

/**
 * Create a full instance of Grapholscape with diagrams and widgets
 * 
 * @remarks
 * Once the promise is fulfilled, you get a {@link !core.Grapholscape}.
 * Hence the API you will most likely want to use will be the one of the {@link !core.Grapholscape} class.
 * You can change diagram, zoom, focus elements, select them, filter them and so on with that class.
 * 
 * @param file the ontology, can be an object of the 
 * [Web API interface File](https://developer.mozilla.org/en-US/docs/Web/API/File) 
 * or a String representing the .graphol file to be displayed
 * @param container a DOM element in which the ontology will be rendered in
 * @param config a config object, please read more about [settings](https://github.com/obdasystems/grapholscape/wiki/Settings)
 * @returns a promise that will be fulfilled with a {@link !core.Grapholscape} object
 * @see [Getting started](https://obdasystems.github.io/grapholscape/pages/getting-started.html)
 * @see [Configuration](https://obdasystems.github.io/grapholscape/pages/configuration.html)
 */
export async function fullGrapholscape(file: string | File, container: HTMLElement, config?: GrapholscapeConfig) {
  const grapholscape = await getGrapholscape(file, container, config)
  if (grapholscape)
    UI.initUI(grapholscape)
  return grapholscape
}

/**
 * Create a bare instance of Grapholscape, only diagrams, no widgets
 * 
 * @remarks
 * Once the promise is fulfilled, you get a {@link !core.Grapholscape}.
 * Hence the API you will most likely want to use will be the one of the {@link !core.Grapholscape} class.
 * You can change diagram, zoom, focus elements, select them, filter them and so on with that class.
 * 
 * @param file the ontology, can be an object of the 
 * [Web API interface File](https://developer.mozilla.org/en-US/docs/Web/API/File) 
 * or a String representing the .graphol file to be displayed
 * @param container a DOM element in which the ontology will be rendered in
 * @param config a config object, please read more about [settings](https://github.com/obdasystems/grapholscape/wiki/Settings)
 * @returns a promise that will be fulfilled with a {@link !core.Grapholscape} object
 * @see [Getting started](https://obdasystems.github.io/grapholscape/pages/getting-started.html)
 * @see [Configuration](https://obdasystems.github.io/grapholscape/pages/configuration.html)
 */
export function bareGrapholscape(file: string | File, container: HTMLElement, config?: GrapholscapeConfig) {
  return getGrapholscape(file, container, config)
}

async function getGrapholscape(file: string | File, container: HTMLElement, config?: GrapholscapeConfig) {
  if (!file || !container) {
    console.error('Please specify an ontology and a container for Grapholscape')
    return undefined
  }

  const savedConfig = loadConfig()
  // copy savedConfig over config
  config = Object.assign(config || { }, savedConfig)
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