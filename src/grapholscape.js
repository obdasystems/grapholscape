import "core-js/stable"
import "regenerator-runtime/runtime"
import "@webcomponents/webcomponentsjs"
import GrapholParser from './parsing/parser'
import GrapholscapeView from './view/view'
import GrapholscapeController from './grapholscape-controller'

export default class GrapholScape {
  constructor (file, container = false, config = null) {
    this.readGraphol(file)
    .then( result => { this._ontology = result })
    .catch( error => {
      console.error(error)
    })

    if (container) {
      return this.init(container, config)
    }
  }

  init(container, config = null) {
    return new Promise( (resolve,reject) => {
      this.readFilePromise.then( () => {
        this.view = new GrapholscapeView(container)
        this.controller = new GrapholscapeController(this._ontology, this.view, config)
        this.controller.setOnWikiClickCallback(this._onWikiClick)
        this.controller.init()
        resolve(this.controller)
      })
      .catch( (reason) => reject(reason))
    })
  }

  readGraphol(file) {
    this.readFilePromise = new Promise ((resolve, reject) => {
      let result = null

      if (typeof (file) === 'object') {
        let reader = new FileReader()
        reader.onloadend = () => {
          result = getResult(reader.result)
          resolve(result)
        }

        reader.readAsText(file)

        setTimeout( () => {
          reject('Error: timeout expired')
        }, 10000)

      } else if (typeof (file) === 'string') {
        result = getResult(file)
        resolve(result)
      } else {
        reject('Err: Grapholscape needs a Graphol File or the corresponding string to be initialized')
      }
    })

    return this.readFilePromise

    function getResult(file) {
      let graphol_parser = new GrapholParser(file)
      return graphol_parser.parseGraphol()
    }
  }
}
