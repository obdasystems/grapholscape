import GrapholscapeRenderer from './rendering/grapholscape_renderer'
import GrapholParser from './parsing/parser'
import EasyGscapeRenderer from './rendering/easy-gscape-renderer';

export class GrapholScape {
  constructor (file) {
    var this_graph = this
    this.ready = false
    let graphol_parser = new GrapholParser()

    if (typeof (file) === 'object') {
      var reader = new FileReader()
      var event = new Event('grapholscape_ready')

      reader.onloadend = function () {
        this_graph.ontology = graphol_parser.parseGraphol(reader.result)
        this.ready = true
        window.dispatchEvent(event)
      }

      reader.readAsText(file)
    } else if (typeof (file) === 'string') {
      this.ontology = graphol_parser.parseGraphol(file)
      this.ready = true
    } else {
      console.error('Err: Grapholscape needs a Graphol File or the corresponding string to be initialized')
    }
  } // End Constructor

  setRenderer (container) {
    return new Promise((resolve, reject) => {
      if (this.ready) { resolve(new EasyGscapeRenderer(container, this.ontology)) }

      window.addEventListener('grapholscape_ready', () => {
        resolve(new EasyGscapeRenderer(container, this.ontology))
      }, this)
    })
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
