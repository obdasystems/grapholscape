import GrapholParser from './parsing/parser'
import GrapholscapeView from './view/view';
import GrapholscapeController from './grapholscape-controller';

export class GrapholScape {
  constructor (file, container = false) {
    this.ready = false
    this.ontology = file

    if (container) {
      this.init(container)
    }
  }

  init(container) {
    return new Promise( (resolve,reject) => {
      this.readFilePromise
      .then( () => {
        this.view = new GrapholscapeView(container)
        this.controller = new GrapholscapeController(this.ontology, this.view)
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

  getOccurrencesOfPredicate (predicate) {
    var list = document.getElementById('predicates_list')
    var rows = list.getElementsByClassName('predicate')
    var matches = {}
    for (var i = 0; i < rows.length; i++) {
      var info = rows[i].getElementsByClassName('info')[0]
      if (info.innerHTML === predicate) {
        var occurrences = rows[i].getElementsByClassName('sub_row')
        for (var j = 0; j < occurrences.length; j++) {
          var occurrence = occurrences[j]
          var diagram = occurrence.getAttribute('diagram')
          var node = occurrence.getAttribute('node_id')
          if (diagram in matches) {
            matches[diagram].push(node)
          } else {
            matches[diagram] = [node]
          }
        }
        break
      }
    }
    return matches
  }

}
