import Ontology from '../model'
import Namespace from '../model/namespace'
import Diagram from '../model/diagram'
import * as ParserUtil from './parser_util'
import * as Graphol2 from './parser-v2'
import * as Graphol3 from './parser-v3'
import { grapholNodes, nodeTypes, nodeShapes } from '../model'
import { constructorLabels, Type } from '../model/node-enums'
import GrapholEntity, { Functionalities } from '../model/graphol-elems/entity'
import GrapholNode from '../model/graphol-elems/node'
import Iri from '../model/iri'
import Annotation from '../model/graphol-elems/annotation'

interface Graphol {
  getOntologyInfo: (xmlDocument: XMLDocument) => Ontology
  getNamespaces: (xmlDocument: XMLDocument) => Namespace[]
  getIri: (element: HTMLElement, ontology: Ontology) => Iri
  getFacetDisplayedName: (element: Element, ontology: Ontology) => string
  getFunctionalities: (element: Element, xmlDocument: XMLDocument) => Functionalities[]
  getEntityAnnotations: (element: Element, xmlDocument: XMLDocument) => Annotation[]

}

export default class GrapholParser {
  xmlDocument: XMLDocument
  graphol_ver: any
  graphol: Graphol
  ontology: Ontology
  warnings: any[]

  constructor(xmlString) {
    this.xmlDocument = (xmlString instanceof XMLDocument) ? xmlString : new DOMParser().parseFromString(xmlString, 'text/xml')

    this.graphol_ver = this.xmlDocument.getElementsByTagName('graphol')[0].getAttribute('version') || -1

    if (this.graphol_ver == 2 || this.graphol_ver == -1)
      this.graphol = Graphol2
    else if (this.graphol_ver == 3)
      this.graphol = Graphol3
    else
      throw new Error(`Graphol version [${this.graphol_ver}] not supported`)
  }

  parseGraphol() {
    this.ontology = this.graphol.getOntologyInfo(this.xmlDocument)
    this.ontology.namespaces = this.graphol.getNamespaces(this.xmlDocument)

    let i, k, nodes, edges, cnt, array_json_elems
    let diagrams = this.xmlDocument.getElementsByTagName('diagram')
    for (i = 0; i < diagrams.length; i++) {
      const diagram = new Diagram(diagrams[i].getAttribute('name'), i)
      this.ontology.addDiagram(diagram)

      array_json_elems = []
      nodes = diagrams[i].getElementsByTagName('node')
      edges = diagrams[i].getElementsByTagName('edge')
      cnt = 0
      // Create JSON for each node to be added to the collection
      for (k = 0; k < nodes.length; k++) {
        const nodeXmlElement = nodes[k]
        const grapholNodeType = this.getGrapholNodeType(nodeXmlElement)
        const node = this.getBasicGrapholNode(nodeXmlElement, i)
        //node.data.iri = this.graphol.getIri(nodeXmlElement, this.ontology)

        if (node.isEntity()) {
          const iri = this.graphol.getIri(nodeXmlElement, this.ontology)
          let entity = this.ontology.getEntity(iri.fullIri)
          if (!entity) {
            entity = new GrapholEntity(iri, grapholNodeType.TYPE)
            this.ontology.addEntity(entity)
          }

          entity.addOccurrence(node.id, diagram.id)
          entity.functionalities = this.graphol.getFunctionalities(nodeXmlElement, this.xmlDocument)
          entity.annotations = this.graphol.getEntityAnnotations(nodeXmlElement, this.xmlDocument)

          // APPLY DISPLAYED NAME FROM LABELS
          if (entity.getLabels().length > 0) {
            // try to apply default language label as displayed name
            const labelInDefaultLanguage = entity.getLabels(this.ontology.languages.default)[0]
            if (labelInDefaultLanguage) {
              node.displayedName = labelInDefaultLanguage.lexicalForm
            } else {
              // otherwise pick the first language available
              for (let lang of this.ontology.languages.list) {
                const labels = entity.getLabels(lang)
                if (labels?.length > 0) {
                  node.displayedName = labels[0].lexicalForm
                  break
                }
              }
            }

            // if still failing, pick the first label you find
            if (!node.displayedName) {
              node.displayedName = entity.getLabels()[0].lexicalForm
            }

          } else {
            // if no labels defined, apply remainingChars from iri as displayed name
            node.displayedName = entity.iri.remainder
          }
        } else { // not an entity, take label from <label> tag or use those for constructor nodes
          
          switch (node.type) {
            case Type.FACET:
              node.displayedName = this.graphol.getFacetDisplayedName(nodeXmlElement, this.ontology)
              break
            
            case Type.VALUE_DOMAIN:
              node.displayedName = this.graphol.getFacetDisplayedName(nodeXmlElement, this.ontology)
              break
          } // CONTINUE HERE 
          
          if (node.is(Type.FACET)) {
            node.displayedName = this.graphol.getFacetDisplayedName(nodeXmlElement, this.ontology)
          } else if (node.data.type === Type.VALUE_DOMAIN) {
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
          array_json_elems[cnt].data.type === nodeTypes.FACET ||
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

    if (i == 0) {
      throw new Error("The selected .graphol file has no defined diagram")
    }

    this.getIdentityForNeutralNodes()
    this.warnings = [...this.graphol.warnings];
    if (this.warnings.length > 10) {
      let length = this.warnings.length
      this.warnings = this.warnings.slice(0, 9)
      this.warnings.push(`...${length - 10} warnings not shown`)
    }
    this.warnings.forEach(w => console.warn(w))
    return this.ontology
  }

  getBasicGrapholNode(element: Element, diagram_id: number) {
    let enumTypeKey = Object.keys(grapholNodes).find(k => grapholNodes[k].TYPE === element.getAttribute('type'))
    let grapholNode = new GrapholNode(element.getAttribute('id'), diagram_id)

    grapholNode.type = grapholNodes[enumTypeKey].TYPE
    grapholNode.shape = grapholNodes[enumTypeKey].SHAPE
    grapholNode.identity = grapholNodes[enumTypeKey].IDENTITY

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
      classes: grapholNodes[enumTypeKey].TYPE
    }

    // Parsing the <geometry> child node of node
    var geometry = element.getElementsByTagName('geometry')[0]
    grapholNode.width = parseInt(geometry.getAttribute('width'))
    grapholNode.height = parseInt(geometry.getAttribute('height'))
    grapholNode.x = parseInt(geometry.getAttribute('x'))
    grapholNode.y = parseInt(geometry.getAttribute('y'))

    if (grapholNode.is(Type.ROLE_CHAIN) || grapholNode.is(Type.PROPERTY_ASSERTION)) {
      if (element.getAttribute('inputs') !== '')
        grapholNode.inputs = element.getAttribute('inputs').split(',')
    }

    if (grapholNode.is(Type.FACET)) {
      grapholNode.shapePoints = grapholNodes.FACET.SHAPE_POINTS
      grapholNode.fillColor = '#ffffff'
    }

    let label = element.getElementsByTagName('label')[0]
    // apply label position and font size
    if (label != null) {
      grapholNode.labelXpos = parseInt(label.getAttribute('x'))
      grapholNode.labelYpos = parseInt(label.getAttribute('y'))
      grapholNode.fontSize = parseInt(label.getAttribute('size')) || 12
    }

    if (ParserUtil.isPredicate(element))
      nodo.classes += ' predicate'
    return grapholNode
  }

  EdgeXmlToJson(arco, diagram_id) {
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
        if (target.data('inputs')[k] === edge.data.id_xml) {
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
        'x': parseInt(point.getAttribute('x')),
        'y': parseInt(point.getAttribute('y')),
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
    let source_endpoint = ParserUtil.getNewEndpoint(
      breakpoints[0], // first breakpoint is the one on source
      source,
      breakpoints[1]
    )

    // Impostiamo l'endpoint solo se è diverso da zero
    // perchè di default l'endpoint è impostato a (0,0) relativamente al nodo di riferimento
    if (source_endpoint.x != 0 || source_endpoint.y != 0) {
      edge.data.source_endpoint = []
      edge.data.source_endpoint.push(source_endpoint.x)
      edge.data.source_endpoint.push(source_endpoint.y)
    }
    // Facciamo la stessa cosa per il target
    let target_endpoint = ParserUtil.getNewEndpoint(
      breakpoints[breakpoints.length - 1], // last endpoint is the one on target
      target,
      breakpoints[breakpoints.length - 2]
    )

    if (target_endpoint.x != 0 || target_endpoint.y != 0) {
      edge.data.target_endpoint = []
      edge.data.target_endpoint.push(target_endpoint.x)
      edge.data.target_endpoint.push(target_endpoint.y)
    }

    // If we have no control-points and only one endpoint, we need an intermediate breakpoint
    // why? see: https://github.com/obdasystems/grapholscape/issues/47#issuecomment-987175639
    let breakpoint
    if (breakpoints.length === 2) { // 2 breakpoints means no control-points
      if ((edge.data.source_endpoint && !edge.data.target_endpoint)) {
        /**
         * we have custom endpoint only on source, get a middle breakpoint 
         * between the custom endpoint on source (breakpoints[0]) and target position
         * (we don't have endpoint on target)
         * 
         * NOTE: don't use source_endpoint because it contains relative coordinate 
         * with respect source node position. We need absolute coordinates which are
         * the ones parsed from .graphol file
         */
        breakpoint = ParserUtil.getPointOnEdge(breakpoints[0], target.position())
      }

      if (!edge.data.source_endpoint && edge.data.target_endpoint) {
        // same as above but with endpoint on target, which is the last breakpoints (1 since they are just 2)
        breakpoint = ParserUtil.getPointOnEdge(source.position(), breakpoints[1])
      }

      if (breakpoint) {
        // now if we have the breakpoint we need, let's get distance and weight for cytoscape
        // just like any other breakpoint
        const distanceWeight = ParserUtil.getDistanceWeight(target.position(), source.position(), breakpoint)
        edge.data.breakpoints = [breakpoint]
        edge.data.segment_distances = [distanceWeight[0]]
        edge.data.segment_weights = [distanceWeight[1]]
      }
    }
    return edge
  }

  addFakeNodes(array_json_nodes) {
    var nodo = array_json_nodes[array_json_nodes.length - 1]
    if (nodo.data.type === 'facet') {
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

    if (nodo.data.functional === 1 && nodo.data.inverseFunctional === 1) {
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
    function findIdentity(node) {
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


  getGrapholNodeType(element) {
    const nodeTypeKey = Object.keys(grapholNodes).find(k => grapholNodes[k].TYPE === element.getAttribute('type'))

    return grapholNodes[nodeTypeKey]
  }
}
