import initGrapholscape from './init'
import * as UI from './ui'

/**
 * Create an instance of Grapholscape with complete GUI
 * @param {string | object} file the ontology, can be an object of the 
 * [Web API interface File](https://developer.mozilla.org/en-US/docs/Web/API/File) 
 * or a String representing the .graphol file to be displayed
 * @param {object} container a DOM element in which the ontology will be rendered in
 * @param {object} config a config object, please read more about [settings](https://github.com/obdasystems/grapholscape/wiki/Settings)
 * @returns a promise that will be fulfilled with a Grapholscape object
 * @tutorial Settings
 * @tutorial Themes
 */
export async function fullGrapholscape(file, container, config = {}) {
  if (!file || !container) {
    console.error('Please specify an ontology and a container for Grapholscape')
    return undefined
  }

  const grapholscape = await initGrapholscape(file, container, config)
  await UI.initUI(grapholscape)
  return grapholscape
}

export { UI }