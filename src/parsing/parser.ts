import Ontology from '../model'
import Namespace from '../model/namespace'
import Diagram from '../model/diagram'
import * as ParserUtil from './parser_util'
import * as Graphol2 from './parser-v2'
import * as Graphol3 from './parser-v3'
import { grapholNodes, nodeTypes, nodeShapes } from '../model'
import { constructorLabels, Type } from '../model/node-enums'
import GrapholEntity, { Functionalities } from '../model/graphol-elems/entity'
import GrapholNode, { LABEL_HEIGHT } from '../model/graphol-elems/node'
import Iri from '../model/iri'
import Annotation from '../model/graphol-elems/annotation'
import { FakeBottomRhomboid, FakeTopRhomboid } from '../model/graphol-elems/fakes/fake-rhomboid'
import { FakeTriangleLeft, FakeTriangleRight } from '../model/graphol-elems/fakes/fake-triangle'
import FakeRectangle from '../model/graphol-elems/fakes/fake-rectangle'
import FakeCircle from '../model/graphol-elems/fakes/fake-circle'
import GrapholEdge from '../model/graphol-elems/edge'
import Breakpoint from '../model/graphol-elems/breakpoint'

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
        const node = this.getBasicGrapholNodeFromXML(nodeXmlElement, i)
        let grapholEntity: GrapholEntity

        if (node.isEntity()) {
          const iri = this.graphol.getIri(nodeXmlElement, this.ontology)
          grapholEntity = this.ontology.entities.get(iri.fullIri)
          if (!grapholEntity) {
            grapholEntity = new GrapholEntity(iri, grapholNodeType.TYPE)
            this.ontology.addEntity(grapholEntity)
          }

          grapholEntity.addOccurrence(node.id, diagram.id)
          grapholEntity.functionalities = this.graphol.getFunctionalities(nodeXmlElement, this.xmlDocument)
          grapholEntity.annotations = this.graphol.getEntityAnnotations(nodeXmlElement, this.xmlDocument)

          // APPLY DISPLAYED NAME FROM LABELS
          if (grapholEntity.getLabels().length > 0) {
            // try to apply default language label as displayed name
            const labelInDefaultLanguage = grapholEntity.getLabels(this.ontology.languages.default)[0]
            if (labelInDefaultLanguage) {
              node.displayedName = labelInDefaultLanguage.lexicalForm
            } else {
              // otherwise pick the first language available
              for (let lang of this.ontology.languages.list) {
                const labels = grapholEntity.getLabels(lang)
                if (labels?.length > 0) {
                  node.displayedName = labels[0].lexicalForm
                  break
                }
              }
            }

            // if still failing, pick the first label you find
            if (!node.displayedName) {
              node.displayedName = grapholEntity.getLabels()[0].lexicalForm
            }

          } else {
            // if no labels defined, apply remainingChars from iri as displayed name
            node.displayedName = grapholEntity.iri.remainder
          }

          // Add fake nodes
          if (node.is(Type.OBJECT_PROPERTY) &&
            grapholEntity.hasFunctionality(Functionalities.functional) &&
            grapholEntity.hasFunctionality(Functionalities.inverseFunctional)) {
            node.addFakeNode(new FakeTriangleRight(node))
            node.addFakeNode(new FakeTriangleLeft(node))
            node.height -= 8
            node.width -= 10
          }
        } else {
          // not an entity, take label from <label> tag or use those for constructor nodes          
          switch (node.type) {
            case Type.FACET:
              node.displayedName = this.graphol.getFacetDisplayedName(nodeXmlElement, this.ontology)
              break

            case Type.VALUE_DOMAIN:
              const iri = this.graphol.getIri(nodeXmlElement, this.ontology)
              node.displayedName = iri.prefixed
              break

            default:
              const constructorLabel = constructorLabels[Object.keys(Type).find(k => Type[k] === node.type)]
              if (constructorLabel) {
                node.displayedName = constructorLabel
              }
              break
          }

          // for domain/range restrictions, cardinalities
          if (Graphol3.getTagText(nodes[k], 'label')) {
            node.displayedName = Graphol3.getTagText(nodes[k], 'label')
          }
        }

        diagram.addElement(node, grapholEntity)
      }

      for (k = 0; k < edges.length; k++) {
        const edgeXmlElement = edges[k]
        diagram.addElement(this.getGrapholEdgeFromXML(edgeXmlElement, diagram.id))
      }
    }

    if (i == 0) {
      throw new Error("The selected .graphol file has no defined diagram")
    }

    this.getIdentityForNeutralNodes()
    return this.ontology
  }

  getBasicGrapholNodeFromXML(element: Element, diagramId: number) {
    let enumTypeKey = Object.keys(grapholNodes).find(k => grapholNodes[k].TYPE === element.getAttribute('type'))
    let grapholNode = new GrapholNode(element.getAttribute('id'))

    grapholNode.type = grapholNodes[enumTypeKey].TYPE
    grapholNode.shape = grapholNodes[enumTypeKey].SHAPE
    grapholNode.identity = grapholNodes[enumTypeKey].IDENTITY
    grapholNode.fillColor = element.getAttribute('color')

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

    let label = element.getElementsByTagName('label')[0]
    // apply label position and font size
    if (label != null) {
      grapholNode.labelHeight = parseInt(label.getAttribute('height'))
      grapholNode.labelXpos = parseInt(label.getAttribute('x'))
      grapholNode.labelYpos = parseInt(label.getAttribute('y'))
      grapholNode.fontSize = parseInt(label.getAttribute('size')) || 12
    }

    if (grapholNode.is(Type.FACET)) {
      grapholNode.shapePoints = grapholNodes.FACET.SHAPE_POINTS
      grapholNode.fillColor = '#ffffff'

      // Add fake nodes
      grapholNode.displayedName = grapholNode.displayedName.replace('^^', '\n\n')
      grapholNode.labelYpos = grapholNode.height

      grapholNode.addFakeNode(new FakeTopRhomboid(grapholNode))
      grapholNode.addFakeNode(new FakeBottomRhomboid(grapholNode))
    }

    if (grapholNode.is(Type.PROPERTY_ASSERTION)) {
      // Add fake nodes
      grapholNode.height -= 1
      grapholNode.width = grapholNode.width - grapholNode.height

      grapholNode.addFakeNode(new FakeRectangle(grapholNode))

      const fakeCircle1 = new FakeCircle(grapholNode)
      // fakeCircle1.x = grapholNode.x - ((grapholNode.width - grapholNode.height) / 2)
      grapholNode.addFakeNode(fakeCircle1)

      const fakeCircle2 = new FakeCircle(grapholNode)
      // fakeCircle2.x = grapholNode.x + ((grapholNode.width - grapholNode.height) / 2)
      grapholNode.addFakeNode(fakeCircle2)
    }

    // if (ParserUtil.isPredicate(element))
    //   nodo.classes += ' predicate'
    return grapholNode
  }

  getGrapholEdgeFromXML(edgeXmlElement: Element, diagramId: number) {
    const grapholEdge = new GrapholEdge(edgeXmlElement.getAttribute('id'))

    grapholEdge.sourceId = edgeXmlElement.getAttribute('source')
    grapholEdge.targetId = edgeXmlElement.getAttribute('target')
    grapholEdge.type = Type[Object.keys(Type).find(k => Type[k] === edgeXmlElement.getAttribute('type'))]
    if (!grapholEdge.type)
      console.log(edgeXmlElement.getAttribute('type'))
    // var k

    // var edgeXmlElement = {
    //   data: {
    //     target: edgeXmlElement.getAttribute('target') + '_' + diagramId,
    //     source: edgeXmlElement.getAttribute('source') + '_' + diagramId,
    //     id: edgeXmlElement.getAttribute('id') + '_' + diagramId,
    //     id_xml: edgeXmlElement.getAttribute('id'),
    //     diagram_id: diagramId,
    //     type: edgeXmlElement.getAttribute('type'),
    //     breakpoints: [],
    //   }
    // }

    // Prendiamo i nodi source e target
    var sourceGrapholNode = this.ontology.getGrapholNode(grapholEdge.sourceId, diagramId)
    var targetGrapholNode = this.ontology.getGrapholNode(grapholEdge.targetId, diagramId)
    // Impostiamo le label numeriche per gli archi che entrano nei role-chain
    // I role-chain hanno un campo <input> con una lista di id di archi all'interno
    // che sono gli archi che entrano, l'ordine nella sequenza stabilisce la label
    // numerica che deve avere l'arco
    // Quindi se l'arco che stiamo aggiungendo ha come target un nodo role-chain,
    // Cerchiamo l'id dell'arco negli inputs del role-chain e se lo troviamo impostiamo
    // la target_label in base alla posizione nella sequenza
    if (targetGrapholNode.is(Type.ROLE_CHAIN) || targetGrapholNode.is(Type.PROPERTY_ASSERTION)) {
      for (let k = 0; k < targetGrapholNode.inputs.length; k++) {
        if (targetGrapholNode.inputs[k] === grapholEdge.id) {
          grapholEdge.targetLabel = (k + 1).toString()
          break
        }
      }
    }

    // info = <POINT>
    // Processiamo i breakpoints dell'arco
    // NOTA: ogni arco ha sempre almeno 2 breakpoints, cioè gli endpoints
    let point = ParserUtil.getFirstChild(edgeXmlElement)
    // let breakpoints = []
    // let segment_weights = []
    // let segment_distances = []
    let count = 0
    for (let j = 0; j < edgeXmlElement.childNodes.length; j++) {
      // Ignoriamo spazi vuoti, e altri figli di tipo diverso da 1
      if (edgeXmlElement.childNodes[j].nodeType != 1) { continue }

      const breakpoint = new Breakpoint(parseInt(point.getAttribute('x')), parseInt(point.getAttribute('y')))
      //breakpoints[count].push(parseInt(point.getAttribute('x')))
      //breakpoints[count].push(parseInt(point.getAttribute('y')))
      if (ParserUtil.getNextSibling(point) != null) {
        point = ParserUtil.getNextSibling(point)
        // Se il breakpoint in questione non è il primo
        // e non è l'ultimo, visto che ha un fratello,
        // allora calcoliamo peso e distanza per questo breakpoint
        // [Il primo e l'ultimo breakpoint sono gli endpoint e non hanno peso e distanza]
        if (count > 0) {
          breakpoint.setSourceTarget(sourceGrapholNode.position, targetGrapholNode.position)
          // var aux = ParserUtil.getDistanceWeight(targetGrapholNode.position, sourceGrapholNode.position, breakpoints[count])
          // segment_distances.push(aux[0])
          // segment_weights.push(aux[1])

        }
        count++
      }

      grapholEdge.addBreakPoint(breakpoint)
    }
    // Se ci sono almeno 3 breakpoints, allora impostiamo gli array delle distanze e dei pesi
    // if (count > 1) {
    //   edgeXmlElement.data.breakpoints = breakpoints.slice(1, count)
    //   edgeXmlElement.data.segment_distances = segment_distances
    //   edgeXmlElement.data.segment_weights = segment_weights
    // }
    // Calcoliamo gli endpoints sul source e sul target
    // Se non sono centrati sul nodo vanno spostati sul bordo del nodo
    grapholEdge.sourceEndpoint = ParserUtil.getNewEndpoint(
      grapholEdge.controlpoints[0], // first breakpoint is the one on source
      sourceGrapholNode,
      grapholEdge.controlpoints[1]
    )

    // Impostiamo l'endpoint solo se è diverso da zero
    // perchè di default l'endpoint è impostato a (0,0) relativamente al nodo di riferimento
    // if (source_endpoint.x != 0 || source_endpoint.y != 0) {
    //   // edgeXmlElement.data.source_endpoint = []
    //   // edgeXmlElement.data.source_endpoint.push(source_endpoint.x)
    //   // edgeXmlElement.data.source_endpoint.push(source_endpoint.y)
    // }
    // Facciamo la stessa cosa per il target
    grapholEdge.targetEndpoint = ParserUtil.getNewEndpoint(
      grapholEdge.controlpoints[grapholEdge.controlpoints.length - 1], // last endpoint is the one on target
      targetGrapholNode,
      grapholEdge.controlpoints[grapholEdge.controlpoints.length - 2]
    )

    // if (target_endpoint.x != 0 || target_endpoint.y != 0) {
    //   // edgeXmlElement.data.target_endpoint = []
    //   // edgeXmlElement.data.target_endpoint.push(target_endpoint.x)
    //   // edgeXmlElement.data.target_endpoint.push(target_endpoint.y)
    //   grapholEdge.targetEndpoint = new Breakpoint(target_endpoint.x, target_endpoint.y)
    // }

    // If we have no control-points and only one endpoint, we need an intermediate breakpoint
    // why? see: https://github.com/obdasystems/grapholscape/issues/47#issuecomment-987175639
    let breakpoint: Breakpoint
    if (grapholEdge.controlpoints.length === 2) { // 2 breakpoints means only endpoints
      if ((grapholEdge.sourceEndpoint && !grapholEdge.targetEndpoint)) {
        /**
         * we have custom endpoint only on source, get a middle breakpoint 
         * between the custom endpoint on source (breakpoints[0]) and target position
         * (we don't have endpoint on target)
         * 
         * NOTE: don't use source_endpoint because it contains relative coordinate 
         * with respect source node position. We need absolute coordinates which are
         * the ones parsed from .graphol file
         */
        breakpoint = ParserUtil.getPointOnEdge(grapholEdge.controlpoints[0], targetGrapholNode.position)
      }

      if (!grapholEdge.sourceEndpoint && grapholEdge.targetEndpoint) {
        // same as above but with endpoint on target, which is the last breakpoints (1 since they are just 2)
        breakpoint = ParserUtil.getPointOnEdge(sourceGrapholNode.position, grapholEdge.controlpoints[1])
      }

      if (breakpoint) {
        // now if we have the breakpoint we need, let's get distance and weight for cytoscape
        // just like any other breakpoint
        breakpoint.setSourceTarget(sourceGrapholNode.position, targetGrapholNode.position)
        // insert new breakpoint between the the other two we already have
        grapholEdge.controlpoints.splice(1, 0, breakpoint)
        // const distanceWeight = ParserUtil.getDistanceWeight(targetGrapholNode.position(), sourceGrapholNode.position(), breakpoint)
        // edgeXmlElement.data.breakpoints = [breakpoint]
        // edgeXmlElement.data.segment_distances = [distanceWeight[0]]
        // edgeXmlElement.data.segment_weights = [distanceWeight[1]]
      }
    }
    return grapholEdge
  }

  // addFakeNodes(array_json_nodes) {
  //   var nodo = array_json_nodes[array_json_nodes.length - 1]
  //   if (nodo.data.type === 'facet') {
  //     // Se il nodo è di tipo facet inseriamo i ritorni a capo nella label
  //     // e la trasliamo verso il basso di una quantità pari all'altezza del nodo
  //     nodo.data.displayed_name = nodo.data.displayed_name.replace('^^', '\n\n')
  //     nodo.data.labelYpos = nodo.data.height
  //     // Creating the top rhomboid for the grey background
  //     var top_rhomboid = {
  //       selectable: false,
  //       data: {
  //         height: nodo.data.height,
  //         width: nodo.data.width,
  //         shape: nodeShapes.POLYGON,
  //         shape_points: '-0.9 -1 1 -1 0.95 0 -0.95 0',
  //         diagram_id: nodo.data.diagram_id,
  //         parent_node_id: nodo.data.id,
  //         type: nodo.data.type
  //       },
  //       position: {
  //         x: nodo.position.x,
  //         y: nodo.position.y
  //       },
  //       classes: 'fake-top-rhomboid'
  //     }

  //     var bottom_rhomboid = {
  //       selectable: false,
  //       data: {
  //         height: nodo.data.height,
  //         width: nodo.data.width,
  //         shape: 'polygon',
  //         shape_points: '-0.95 0 0.95 0 0.9 1 -1 1',
  //         diagram_id: nodo.data.diagram_id,
  //         parent_node_id: nodo.data.id,
  //         type: nodo.data.type
  //       },
  //       position: {
  //         x: nodo.position.x,
  //         y: nodo.position.y
  //       }
  //     }
  //     array_json_nodes[array_json_nodes.length - 1] = top_rhomboid
  //     array_json_nodes.push(bottom_rhomboid)
  //     array_json_nodes.push(nodo)
  //     return
  //   }

  //   if (nodo.data.functional === 1 && nodo.data.inverseFunctional === 1) {
  //     // Creating "fake" nodes for the double style border effect
  //     var triangle_right = {
  //       selectable: false,
  //       data: {
  //         height: nodo.data.height,
  //         width: nodo.data.width,
  //         fillColor: "#000",
  //         shape: 'polygon',
  //         shape_points: '0 -1 1 0 0 1',
  //         diagram_id: nodo.data.diagram_id,
  //         type: nodo.data.type,
  //       },
  //       position: {
  //         x: nodo.position.x,
  //         y: nodo.position.y,
  //       },
  //       classes: 'fake-triangle fake-triangle-right'
  //     }
  //     var triangle_left = {
  //       selectable: false,
  //       data: {
  //         height: nodo.data.height,
  //         width: nodo.data.width + 2,
  //         fillColor: '#fcfcfc',
  //         shape: 'polygon',
  //         shape_points: '0 -1 -1 0 0 1',
  //         diagram_id: nodo.data.diagram_id,
  //         type: nodo.data.type,
  //       },
  //       position: {
  //         x: nodo.position.x,
  //         y: nodo.position.y
  //       },
  //       classes: 'fake-triangle'
  //     }
  //     //var old_labelXpos = nodo.data.labelXpos
  //     //var old_labelYpos = nodo.data.labelYpos
  //     nodo.data.height -= 8
  //     nodo.data.width -= 10
  //     // If the node is both functional and inverse functional,
  //     // we added the double style border and changed the node height and width.
  //     // The label position is function of node's height and width so we adjust it
  //     // now after those changes.
  //     if (nodo.data.displayed_name != null) {
  //       nodo.data.labelYpos -= 4
  //     }
  //     array_json_nodes[array_json_nodes.length - 1] = triangle_left
  //     array_json_nodes.push(triangle_right)
  //     array_json_nodes.push(nodo)
  //   }

  //   if (nodo.data.type === nodeTypes.PROPERTY_ASSERTION) {
  //     var circle1 = {
  //       selectable: false,
  //       classes: 'no_overlay',
  //       data: {
  //         height: nodo.data.height,
  //         width: nodo.data.height,
  //         shape: nodeShapes.ELLIPSE,
  //         diagram_id: nodo.data.diagram_id,
  //         fillColor: '#fff',
  //         parent_node_id: nodo.data.id,
  //         type: nodo.data.type
  //       },
  //       position: {
  //         x: nodo.position.x - ((nodo.data.width - nodo.data.height) / 2),
  //         y: nodo.position.y
  //       }
  //     }
  //     var circle2 = {
  //       selectable: false,
  //       classes: 'no_overlay',
  //       data: {
  //         height: nodo.data.height,
  //         width: nodo.data.height,
  //         shape: nodeShapes.ELLIPSE,
  //         diagram_id: nodo.data.diagram_id,
  //         fillColor: '#fff',
  //         parent_node_id: nodo.data.id,
  //         type: nodo.data.type
  //       },
  //       position: {
  //         x: nodo.position.x + ((nodo.data.width - nodo.data.height) / 2),
  //         y: nodo.position.y
  //       }
  //     }
  //     var back_rectangle = {
  //       data: {
  //         selectable: false,
  //         height: nodo.data.height,
  //         width: nodo.data.width - nodo.data.height,
  //         shape: nodeShapes.RECTANGLE,
  //         diagram_id: nodo.data.diagram_id,
  //         fillColor: '#fff',
  //         parent_node_id: nodo.data.id,
  //         type: nodo.data.type
  //       },
  //       position: nodo.position
  //     }

  //     node.data.height -= 1
  //     node.data.width = node.data.width - node.data.height
  //     node.data.shape = nodeShapes.RECTANGLE
  //     node.classes = `${nodeTypes.PROPERTY_ASSERTION} no_border`

  //     // array_json_nodes[array_json_nodes.length - 1] = back_rectangle
  //     // array_json_nodes.push(circle1)
  //     // array_json_nodes.push(circle2)
  //     // array_json_nodes.push(node)
  //   }
  // }

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

  getCorrectLabelYpos(labelYpos: number, positionY: number, height: number) {
    return (labelYpos - positionY) + (height + 2) / 2 + LABEL_HEIGHT / 4
  }
}
