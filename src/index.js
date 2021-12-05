import cytoscape from 'cytoscape'
import cola from 'cytoscape-cola'
import popper from 'cytoscape-popper'
import initGrapholscape from './init'
import * as themes from './style/themes'

cytoscape.use(popper)
cytoscape.use(cola)

export { fullGrapholscape } from './index.full'
export { UI } from './index.full'
export * from './model/node-enums'
export { default as grapholEnums } from './model/node-enums'
export { themes }
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
export function bareGrapholscape(file, container, config = null) {
  if (!file || !container) {
    console.error('Please specify an ontology and a container for Grapholscape')
    return undefined
  }

  return initGrapholscape(file, container, config)
}