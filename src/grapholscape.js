import "core-js/stable"
import "regenerator-runtime/runtime"
import "@webcomponents/webcomponentsjs"
import GrapholParser from './parsing/parser'
import GrapholscapeView from './view/view'
import GrapholscapeController from './grapholscape-controller'

export default class GrapholScape {
  constructor (file, container = false) {
    this.ontology = file

    if (container) {
      return this.init(container)
    }
  }

  init(container, config = null) {
    return new Promise( (resolve,reject) => {
      this.readFilePromise.then( () => {
        this.view = new GrapholscapeView(container)
        this.controller = new GrapholscapeController(this.ontology, this.view, config)
        this.controller.init()
        resolve(this)
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
      let graphol_parser = new GrapholParser()
      return graphol_parser.parseGraphol(file)
    }
  }

  showDiagram(id) {
    this.controller.onDiagramChange(id)
  }

  set ontology(file) {
    this.readGraphol(file)
    .then( result => { this._ontology = result })
    .catch( error => {
      console.error(error)
      window.alert(error)
    })
  }

  get ontology() {
    return this._ontology
  }
}
