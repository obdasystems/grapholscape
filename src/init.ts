import { loadConfig } from "./config/config-manager"
import grapholscape from "./core"
import { GrapholscapeState } from "./model"
import GrapholscapeTheme from "./model/theme"
import GrapholParser from "./parsing/parser"

/**
 * Initialize a Grapholscape instance given a file, container and optional config
 * @param {string | object} file 
 * @param {object} container 
 * @param {oject} config 
 * @returns {Promise<Grapholscape>}
 */
export default function (file, container, config) {

  const savedConfig = loadConfig()
  let lastUsedTheme = savedConfig.theme
  delete savedConfig.theme // we don't need to override theme in config
  // copy savedConfig over config
  config = Object.assign(config, savedConfig)
  if (config.theme) {
    config.theme.selected = lastUsedTheme && lastUsedTheme === config.theme?.id
  }
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
        //const gscape = new Grapholscape(ontology, container, config)
        const grapholscapeState = new GrapholscapeState()
        grapholscapeState.ontology = ontology
        grapholscapeState.theme = GrapholscapeTheme.defaultTheme
        const gscape = grapholscape(grapholscapeState, container)
        //if (lastUsedTheme) gscape.applyTheme(lastUsedTheme)
        globalThis['gscape'] = gscape
        resolve(gscape)
      } catch (e) { console.error(e)}
    }
  }).catch(error => console.error(error) )

  function getResult(file) {
    return new GrapholParser(file).parseGraphol()
  }
}