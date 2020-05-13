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
    this.view = new GrapholscapeView(container)
    return new Promise( (resolve,reject) => {
      this.readFilePromise.then( () => {
        if (this.warnings.length > 0) {
          this.view.showDialog('Warning', this.warnings)
        }
        this.controller = new GrapholscapeController(this._ontology, this.view, config)
        this.controller.setOnWikiClickCallback(this._onWikiClick)
        this.controller.init()
        resolve(this.controller)
        this.view.spinner.style.display = 'none'
      })
      .catch( (reason) => {
        this.view.showDialog(reason.name, reason.message)
        reject(reason)
      })
    })
  }

  readGraphol(file) {
    let warnings = null
    this.readFilePromise = new Promise ((resolve, reject) => {
      let result = null

      if (typeof (file) === 'object') {
        let reader = new FileReader()
        reader.onloadend = () => {
          try {
            result = getResult(reader.result)
          } catch (error) { reject(error) }
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
    }).finally( () => this.warnings = warnings)
    return this.readFilePromise

    function getResult(file) {
      let graphol_parser = new GrapholParser(file)
      let result = graphol_parser.parseGraphol()
      warnings = graphol_parser.warnings
      return result
    }
  }
}
