import GrapholParser from './parsing/parser'
import cytoscape from 'cytoscape'
import popper from 'cytoscape-popper'
import cola from 'cytoscape-cola'

import initGUI from './gui'


import Grapholscape from './grapholscape'

cytoscape.use(popper)
cytoscape.use(cola)

//export { GrapholscapeRenderer } from './rendering/renderers'

/**
 * Create an instance of Grapholscape with complete GUI
 * @param {string | object} file the ontology, can be an object of the 
 * [Web API interface File](https://developer.mozilla.org/en-US/docs/Web/API/File) 
 * or a String representing the .graphol file to be displayed
 * @param {object} container a DOM element in which the ontology will be rendered in
 * @param {object} config a config object, please read more about [settings](https://github.com/obdasystems/grapholscape/wiki/Settings)
 * @returns {Promise<Grapholscape>} a promise that will be fulfilled with a Grapholscape object
 */
export async function fullGrapholscape(file, container, config = null) {
  if (!file || !container) {
    console.error('Please specify an ontology and a container for Grapholscape')
    return undefined
  }

  const grapholscape = await getPromise(file, container, config)
  initGUI(grapholscape)
  return grapholscape
}

/**
 * Create an instance of Grapholscape with complete GUI
 * @param {string | object} file the ontology, can be an object of the 
 * [Web API interface File](https://developer.mozilla.org/en-US/docs/Web/API/File) 
 * or a String representing the .graphol file to be displayed
 * @param {object} container a DOM element in which the ontology will be rendered in
 * @param {object} config a config object, please read more about [settings](https://github.com/obdasystems/grapholscape/wiki/Settings)
 * @returns {Promise<Grapholscape>} a promise that will be fulfilled with a Grapholscape object
 */
export function bareGrapholscape(file, container, config = null) {
  if (!file || !container) {
    console.error('Please specify an ontology and a container for Grapholscape')
    return undefined
  }

  const promise = getPromise(file, container, config)
  return promise
}

/**
 * 
 * @param {string | object} file 
 * @param {object} container 
 * @param {oject} config 
 * @returns {Promise<Grapholscape>}
 */
function getPromise(file, container, config) {
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
        resolve(new Grapholscape(ontology, container, config))
      } catch (e) { console.log(e)}
    }
  }).catch(error => console.log(error) )

  function getResult(file) {
    return new GrapholParser(file).parseGraphol()
  }
}