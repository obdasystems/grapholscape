import Ontology from '../model'
import Namespace from '../model/namespace'
import Diagram from '../model/diagram'
import * as ParserUtil from './parser_util'
import * as Graphol2 from './parser-v2'
import * as Graphol3 from './parser-v3'
import { grapholNodes, nodeTypes, nodeShapes } from '../model'
import { constructorLabels, Type } from '../model/node-enums'

export default class GrapholParser {
  constructor(xmlString) {
    this.xmlDocument = (xmlString instanceof XMLDocument) ? xmlString : new DOMParser().parseFromString(xmlString, 'text/xml')

    this.graphol_ver = this.xmlDocument.getElementsByTagName('graphol')[0].getAttribute('version') || -1

    if(this.graphol_ver == 2 || this.graphol_ver == -1)
      this.graphol = Graphol2
    else if(this.graphol_ver == 3)
      this.graphol = Graphol3
    else
      throw new Error(`Graphol version [${this.graphol_ver}] not supported`)
  }

  parseGraphol() {
    let ontology_info = this.graphol.getOntologyInfo(this.xmlDocument)
    this.ontology = new Ontology(ontology_info.name, ontology_info.version)
    this.ontology.languages.list = ontology_info.languages || []
    this.ontology.languages.default = ontology_info.default_language || ontology_info.languages[0]
    if (ontology_info.other_infos) {
      this.ontology.annotations = ontology_info.other_infos.annotations
      this.ontology.description = ontology_info.other_infos.description
    }
    // Create iri and add them to ontology.namespaces
    //let iri_list = this.xmlDocument.getElementsByTagName('iri')
    let dictionary = this.graphol.getIriPrefixesDictionary(this.xmlDocument)

    dictionary.forEach(iri => {
      this.ontology.addNamespace(new Namespace(iri.prefixes, iri.value, iri.standard))
    })

    let i, k, nodes, edges, cnt, array_json_elems, diagram, node
    let diagrams = this.xmlDocument.getElementsByTagName('diagram')
    for (i = 0; i < diagrams.length; i++) {
      diagram = new Diagram(diagrams[i].getAttribute('name'), i)
      this.ontology.addDiagram(diagram)

      array_json_elems = []
      nodes = diagrams[i].getElementsByTagName('node')
      edges = diagrams[i].getElementsByTagName('edge')
      cnt = 0
      // Create JSON for each node to be added to the collection
      for (k = 0; k < nodes.length; k++) {
        node = this.getBasicNodeInfos(nodes[k], i)
        node.data.iri = this.graphol.getIri(nodes[k], this.ontology)

        if (ParserUtil.isPredicate(nodes[k])) {
          let predicate_infos = this.graphol.getPredicateInfo(nodes[k], this.xmlDocument, this.ontology)
          if (predicate_infos) {
            Object.keys(predicate_infos).forEach(info => {
              node.data[info] = predicate_infos[info]
            })
            
            // APPLY DISPLAYED NAME FROM LABELS
            let labels = node.data.annotations.label
            let displayedName
            // if no labels defined, apply remainingChars from iri as displayed name
            if (!labels) { 
              displayedName = node.data.iri.remainingChars
            }

            // else try to apply default language label as displayed name
            else if (labels[this.ontology.languages.default]?.length > 0) {
              displayedName = labels[this.ontology.languages.default][0]
            }
            // otherwise pick the first language available
            else {
              for (let lang of this.ontology.languages.list) {
                if (labels[lang]?.length > 0) {
                  displayedName = labels[lang][0]
                  break
                }
              }
            }

            // if still failing, pick the first label you find
            if (!displayedName) {
              displayedName = labels[Object.keys(labels)[0]][0]
            }

            node.data.displayed_name = displayedName
          }
        } else { // not an entity, take label from <label> tag or use those for constructor nodes
          if (node.data.type === Type.FACET) {
            node.data.displayed_name = this.graphol.getFacetDisplayedName(nodes[k], this.xmlDocument, this.ontology)
          } 

          else if (node.data.type === Type.VALUE_DOMAIN) {
            node.data.displayed_name = node.data.iri.prefixed
          }
          
          // for domain/range restrictions, cardinalities
          else if (Graphol3.getTagText(nodes[k], 'label')) {
            node.data.displayed_name = Graphol3.getTagText(nodes[k], 'label')
          }

          else { // a constructor node
            let typeKey = Object.keys(Type).find(k => Type[k] === node.data.type)
            if (constructorLabels[typeKey])
              node.data.displayed_name = constructorLabels[typeKey]
          }
        }        
        
        array_json_elems.push(node)

        // add fake nodes when necessary
        // for property assertion, facets or for
        // both functional and inverseFunctional ObjectProperties
        if (array_json_elems[cnt].data.type === nodeTypes.PROPERTY_ASSERTION ||
          array_json_elems[cnt].data.type ===  nodeTypes.FACET ||
          (array_json_elems[cnt].data.functional && array_json_elems[cnt].data.inverseFunctional)) {
          this.addFakeNodes(array_json_elems)
          cnt += array_json_elems.length - cnt
        } else { cnt++ }
      }
      diagram.addElems(array_json_elems)
      array_json_elems = []
      for (k = 0; k < edges.length; k++) {
        array_json_elems.push(this.EdgeXmlToJson(edges[k], i))
      }
      diagram.addElems(array_json_elems)


    }

    if(i==0) {
      throw new Error("The selected .graphol file has no defined diagram")
    }

    this.getIdentityForNeutralNodes()
    this.warnings = [...this.graphol.warnings];
    if (this.warnings.length > 10) {
      let length = this.warnings.length
      this.warnings = this.warnings.slice(0, 9)
      this.warnings.push(`...${length - 10} warnings not shown`)
    }
    this.warnings.forEach( w => console.warn(w) )
    return this.ontology
  }

  getBasicNodeInfos(element, diagram_id) {
    let enumTypeKey = Object.keys(grapholNodes).find( k => grapholNodes[k].TYPE === element.getAttribute('type'))
    let nodo = {
      data: {
        id_xml: element.getAttribute('id'),
        diagram_id: diagram_id,
        id: element.getAttribute('id') + '_' + diagram_id,
        fillColor: element.getAttribute('color'),
        type: grapholNodes[enumTypeKey].TYPE,
        shape: grapholNodes[enumTypeKey].SHAPE,
        identity: grapholNodes[enumTypeKey].IDENTITY
      },
      position: {},
      classes:grapholNodes[enumTypeKey].TYPE
    }

    // Parsing the <geometry> child node of node
    var geometry = element.getElementsByTagName('geometry')[0]
    nodo.data.width = parseInt(geometry.getAttribute('width'))
    nodo.data.height = parseInt(geometry.getAttribute('height'))

    // Gli individual hanno dimensioni negative nel file graphol
    if (nodo.data.width < 0) { nodo.data.width = -nodo.data.width }
    // Gli individual hanno dimensioni negative nel file graphol
    if (nodo.data.height < 0) { nodo.data.height = -nodo.data.height }
    // L'altezza dei facet è nulla nel file graphol, la impostiamo a 40
    if (nodo.data.type === nodeTypes.FACET) {
      nodo.data.height = 40
    }

    nodo.position.x = parseInt(geometry.getAttribute('x'))
    nodo.position.y = parseInt(geometry.getAttribute('y'))

    if (nodo.data.type === grapholNodes.ROLE_CHAIN.TYPE) {
      if (element.getAttribute('inputs') !== '')
        nodo.data.inputs = element.getAttribute('inputs').split(',')
    }

    if (nodo.data.type === grapholNodes.PROPERTY_ASSERTION.TYPE)
      nodo.data.inputs = element.getAttribute('inputs').split(',')

    if (nodo.data.type === grapholNodes.FACET.TYPE) {
      nodo.data.shape_points = grapholNodes.FACET.SHAPE_POINTS
      nodo.data.fillColor = '#ffffff'
    }

    let label = element.getElementsByTagName('label')[0]
    // apply label position and font size
    if (label != null) {
      
      if (parseInt(label.getAttribute('x')) == nodo.position.x) {
        nodo.data.labelXcentered = true
        nodo.data.labelXpos = 0
      } else {
        nodo.data.labelXpos = parseInt(label.getAttribute('x')) - nodo.position.x + 1
      }

      if (parseInt(label.getAttribute('y')) == nodo.position.y) {
        nodo.data.labelYcentered = true
        nodo.data.labelYpos = 0
      } else {
        nodo.data.labelYpos = (parseInt(label.getAttribute('y')) - nodo.position.y) + (nodo.data.height + 2) / 2 + parseInt(label.getAttribute('height')) / 4
      }

      nodo.data.fontSize = parseInt(label.getAttribute('size')) || 12
    }

    if(ParserUtil.isPredicate(element))
      nodo.classes += ' predicate'
    return nodo
  }

  EdgeXmlToJson (arco, diagram_id) {
    var k
    var edge = {
      data: {
        target: arco.getAttribute('target') + '_' + diagram_id,
        source: arco.getAttribute('source') + '_' + diagram_id,
        id: arco.getAttribute('id') + '_' + diagram_id,
        id_xml: arco.getAttribute('id'),
        diagram_id: diagram_id,
        type: arco.getAttribute('type'),
        breakpoints: [],
      }
    }

    if (edge.data.type.toLowerCase() == 'same' || edge.data.type.toLowerCase() == 'different')
      edge.data.displayed_name = edge.data.type.toLowerCase()

    // Prendiamo i nodi source e target
    var source = this.ontology.getDiagram(diagram_id).cy.$id(edge.data.source)
    var target = this.ontology.getDiagram(diagram_id).cy.$id(edge.data.target)
    // Impostiamo le label numeriche per gli archi che entrano nei role-chain
    // I role-chain hanno un campo <input> con una lista di id di archi all'interno
    // che sono gli archi che entrano, l'ordine nella sequenza stabilisce la label
    // numerica che deve avere l'arco
    // Quindi se l'arco che stiamo aggiungendo ha come target un nodo role-chain,
    // Cerchiamo l'id dell'arco negli inputs del role-chain e se lo troviamo impostiamo
    // la target_label in base alla posizione nella sequenza
    if (target.data('type') === nodeTypes.ROLE_CHAIN || target.data('type') === nodeTypes.PROPERTY_ASSERTION) {
      for (k = 0; k < target.data('inputs').length; k++) {
        if (target.data('inputs')[k] ===edge.data.id_xml) {
          edge.data.target_label = k + 1
          break
        }
      }
    }

    // info = <POINT>
    // Processiamo i breakpoints dell'arco
    // NOTA: ogni arco ha sempre almeno 2 breakpoints, cioè gli endpoints
    var point = ParserUtil.getFirstChild(arco)
    var breakpoints = []
    var segment_weights = []
    var segment_distances = []
    var j
    var count = 0
    for (j = 0; j < arco.childNodes.length; j++) {
      // Ignoriamo spazi vuoti, e altri figli di tipo diverso da 1
      if (arco.childNodes[j].nodeType != 1) { continue }
      breakpoints[count] = {
        'x' : parseInt(point.getAttribute('x')),
        'y' : parseInt(point.getAttribute('y')),
      }
      //breakpoints[count].push(parseInt(point.getAttribute('x')))
      //breakpoints[count].push(parseInt(point.getAttribute('y')))
      if (ParserUtil.getNextSibling(point) != null) {
        point = ParserUtil.getNextSibling(point)
        // Se il breakpoint in questione non è il primo
        // e non è l'ultimo, visto che ha un fratello,
        // allora calcoliamo peso e distanza per questo breakpoint
        // [Il primo e l'ultimo breakpoint sono gli endpoint e non hanno peso e distanza]
        if (count > 0) {
          var aux = ParserUtil.getDistanceWeight(target.position(), source.position(), breakpoints[count])
          segment_distances.push(aux[0])
          segment_weights.push(aux[1])
        }
        count++
      } else { break }
    }
    // Se ci sono almeno 3 breakpoints, allora impostiamo gli array delle distanze e dei pesi
    if (count > 1) {
      edge.data.breakpoints = breakpoints.slice(1, count)
      edge.data.segment_distances = segment_distances
      edge.data.segment_weights = segment_weights
    }
    // Calcoliamo gli endpoints sul source e sul target
    // Se non sono centrati sul nodo vanno spostati sul bordo del nodo
    var source_endpoint = []
    source_endpoint['x'] = breakpoints[0]['x']
    source_endpoint['y'] = breakpoints[0]['y']
    source_endpoint = ParserUtil.getNewEndpoint(source_endpoint, source, breakpoints[1])
    // Impostiamo l'endpoint solo se è diverso da zero
    // perchè di default l'endpoint è impostato a (0,0) relativamente al nodo di riferimento
    if (source_endpoint['x'] != 0 || source_endpoint['y'] != 0) {
      edge.data.source_endpoint = []
      edge.data.source_endpoint.push(source_endpoint['x'])
      edge.data.source_endpoint.push(source_endpoint['y'])
    }
    // Facciamo la stessa cosa per il target
    var target_endpoint = []
    target_endpoint['x'] = breakpoints[breakpoints.length - 1]['x']
    target_endpoint['y'] = breakpoints[breakpoints.length - 1]['y']
    target_endpoint = ParserUtil.getNewEndpoint(target_endpoint, target, breakpoints[breakpoints.length - 2])
    if (target_endpoint['x'] != 0 || target_endpoint['y'] != 0) {
      edge.data.target_endpoint = []
      edge.data.target_endpoint.push(target_endpoint['x'])
      edge.data.target_endpoint.push(target_endpoint['y'])
    }
    return edge
  }

  addFakeNodes(array_json_nodes) {
    var nodo = array_json_nodes[array_json_nodes.length - 1]
    if (nodo.data.type ==='facet') {
      // Se il nodo è di tipo facet inseriamo i ritorni a capo nella label
      // e la trasliamo verso il basso di una quantità pari all'altezza del nodo
      nodo.data.displayed_name = nodo.data.displayed_name.replace('^^', '\n\n')
      nodo.data.labelYpos = nodo.data.height
      // Creating the top rhomboid for the grey background
      var top_rhomboid = {
        selectable: false,
        data: {
          height: nodo.data.height,
          width: nodo.data.width,
          shape: nodeShapes.POLYGON,
          shape_points: '-0.9 -1 1 -1 0.95 0 -0.95 0',
          diagram_id: nodo.data.diagram_id,
          parent_node_id: nodo.data.id,
          type: nodo.data.type
        },
        position: {
          x: nodo.position.x,
          y: nodo.position.y
        },
        classes: 'fake-top-rhomboid' 
      }

      var bottom_rhomboid = {
        selectable: false,
        data: {
          height: nodo.data.height,
          width: nodo.data.width,
          shape: 'polygon',
          shape_points: '-0.95 0 0.95 0 0.9 1 -1 1',
          diagram_id: nodo.data.diagram_id,
          parent_node_id: nodo.data.id,
          type: nodo.data.type
        },
        position: {
          x: nodo.position.x,
          y: nodo.position.y
        }
      }
      array_json_nodes[array_json_nodes.length - 1] = top_rhomboid
      array_json_nodes.push(bottom_rhomboid)
      array_json_nodes.push(nodo)
      return
    }

    if (nodo.data.functional ===1 && nodo.data.inverseFunctional ===1) {
      // Creating "fake" nodes for the double style border effect
      var triangle_right = {
        selectable: false,
        data: {
          height: nodo.data.height,
          width: nodo.data.width,
          fillColor: "#000",
          shape: 'polygon',
          shape_points: '0 -1 1 0 0 1',
          diagram_id: nodo.data.diagram_id,
          type: nodo.data.type,
        },
        position: {
          x: nodo.position.x,
          y: nodo.position.y,
        },
        classes: 'fake-triangle fake-triangle-right'
      }
      var triangle_left = {
        selectable: false,
        data: {
          height: nodo.data.height,
          width: nodo.data.width + 2,
          fillColor: '#fcfcfc',
          shape: 'polygon',
          shape_points: '0 -1 -1 0 0 1',
          diagram_id: nodo.data.diagram_id,
          type: nodo.data.type,
        },
        position: {
          x: nodo.position.x,
          y: nodo.position.y
        },
        classes: 'fake-triangle'
      }
      //var old_labelXpos = nodo.data.labelXpos
      //var old_labelYpos = nodo.data.labelYpos
      nodo.data.height -= 8
      nodo.data.width -= 10
      // If the node is both functional and inverse functional,
      // we added the double style border and changed the node height and width.
      // The label position is function of node's height and width so we adjust it
      // now after those changes.
      if (nodo.data.displayed_name != null) {
        nodo.data.labelYpos -= 4
      }
      array_json_nodes[array_json_nodes.length - 1] = triangle_left
      array_json_nodes.push(triangle_right)
      array_json_nodes.push(nodo)
    }

    if (nodo.data.type === nodeTypes.PROPERTY_ASSERTION) {
      var circle1 = {
        selectable: false,
        classes: 'no_overlay',
        data: {
          height: nodo.data.height,
          width: nodo.data.height,
          shape: nodeShapes.ELLIPSE,
          diagram_id: nodo.data.diagram_id,
          fillColor: '#fff',
          parent_node_id: nodo.data.id,
          type: nodo.data.type
        },
        position: {
          x: nodo.position.x - ((nodo.data.width - nodo.data.height) / 2),
          y: nodo.position.y
        }
      }
      var circle2 = {
        selectable: false,
        classes: 'no_overlay',
        data: {
          height: nodo.data.height,
          width: nodo.data.height,
          shape: nodeShapes.ELLIPSE,
          diagram_id: nodo.data.diagram_id,
          fillColor: '#fff',
          parent_node_id: nodo.data.id,
          type: nodo.data.type
        },
        position: {
          x: nodo.position.x + ((nodo.data.width - nodo.data.height) / 2),
          y: nodo.position.y
        }
      }
      var back_rectangle = {
        data: {
          selectable: false,
          height: nodo.data.height,
          width: nodo.data.width - nodo.data.height,
          shape: nodeShapes.RECTANGLE,
          diagram_id: nodo.data.diagram_id,
          fillColor: '#fff',
          parent_node_id: nodo.data.id,
          type: nodo.data.type
        },
        position: nodo.position
      }

      nodo.data.height -= 1
      nodo.data.width = nodo.data.width - nodo.data.height
      nodo.data.shape = nodeShapes.RECTANGLE
      nodo.classes = `${nodeTypes.PROPERTY_ASSERTION} no_border`
      
      array_json_nodes[array_json_nodes.length - 1] = back_rectangle
      array_json_nodes.push(circle1)
      array_json_nodes.push(circle2)
      array_json_nodes.push(nodo)
    }
  }

  getIdentityForNeutralNodes() {
    this.ontology.diagrams.forEach(diagram => {
      diagram.cy.nodes('[identity = "neutral"]').forEach(node => {
        node.data('identity', findIdentity(node))
      })
    })

    // Recursively traverse first input node and return his identity
    // if he is neutral => recursive step
    function findIdentity (node) {
      var first_input_node = node.incomers('[type = "input"]').sources()
      var identity = first_input_node.data('identity')
      if (identity === nodeTypes.NEUTRAL) { return findIdentity(first_input_node) } else {
        switch (node.data('type')) {
          case nodeTypes.RANGE_RESTRICTION:
            if (identity === nodeTypes.OBJECT_PROPERTY) { 
              return nodeTypes.CONCEPT
            } else if (identity === nodeTypes.DATA_PROPERTY) { 
              return nodeTypes.VALUE_DOMAIN
            } else {
              return identity
            }
          case nodeTypes.ENUMERATION:
            if (identity === nodeTypes.INDIVIDUAL) { return grapholNodes.CONCEPT.TYPE } else { return identity }
          default:
            return identity
        }
      }
    }
  }
}
