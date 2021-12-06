import Grapholscape from "./grapholscape"
import GrapholParser from "./parsing/parser"

/**
 * Initialize a Grapholscape instance given a file, container and optional config
 * @param {string | object} file 
 * @param {object} container 
 * @param {oject} config 
 * @returns {Promise<Grapholscape>}
 */
export default function (file, container, config) {
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
      } catch (e) { console.error(e)}
    }
  }).catch(error => console.error(error) )

  function getResult(file) {
    return new GrapholParser(file).parseGraphol()
  }
}