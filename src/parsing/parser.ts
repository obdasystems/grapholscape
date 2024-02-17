import { Annotation, Diagram, EntityNameType, FunctionalityEnum, GrapholEdge, GrapholEntity, GrapholNode, GrapholNodeInfo, GrapholNodesEnum, Iri, Namespace, Ontology, RendererStatesEnum, TypesEnum } from "../model"
import Breakpoint from "../model/graphol-elems/breakpoint"
import { FakeCircleLeft, FakeCircleRight } from '../model/graphol-elems/fakes/fake-circle'
import FakeRectangle, { FakeRectangleFront } from '../model/graphol-elems/fakes/fake-rectangle'
import { FakeBottomRhomboid, FakeTopRhomboid } from '../model/graphol-elems/fakes/fake-rhomboid'
import { FakeTriangleLeft, FakeTriangleRight } from '../model/graphol-elems/fakes/fake-triangle'
import { LABEL_HEIGHT } from "../model/graphol-elems/node"
import * as Graphol2 from './parser-v2'
import * as Graphol3 from './parser-v3'
import * as ParserUtil from './parser_util'

interface Graphol {
  getOntologyInfo: (xmlDocument: XMLDocument) => Ontology
  getNamespaces: (xmlDocument: XMLDocument) => Namespace[]
  getIri: (element: HTMLElement, ontology: Ontology) => Iri | undefined
  getFacetDisplayedName: (element: Element, ontology: Ontology) => string | undefined
  getFunctionalities: (element: Element, xmlDocument: XMLDocument) => FunctionalityEnum[]
  getEntityAnnotations: (element: Element, xmlDocument: XMLDocument, namespaces: Namespace[]) => Annotation[]

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
      const diagram = new Diagram(diagrams[i].getAttribute('name') || '', i)
      this.ontology.addDiagram(diagram)

      array_json_elems = []
      nodes = diagrams[i].getElementsByTagName('node')
      edges = diagrams[i].getElementsByTagName('edge')
      cnt = 0
      // Create JSON for each node to be added to the collection
      for (k = 0; k < nodes.length; k++) {
        const nodeXmlElement = nodes[k]
        const grapholNodeType = this.getGrapholNodeInfo(nodeXmlElement)?.TYPE
        const node = this.getBasicGrapholNodeFromXML(nodeXmlElement, i)

        if (!node) continue

        let grapholEntity: GrapholEntity | undefined

        if (node.isEntity() && grapholNodeType) {
          const iri = this.graphol.getIri(nodeXmlElement, this.ontology)
          if (iri) {
            grapholEntity = this.ontology.entities.get(iri.fullIri)
            node.iri = iri.fullIri

            if (!grapholEntity) {
              grapholEntity = new GrapholEntity(iri)
              this.ontology.addEntity(grapholEntity)
            }

            grapholEntity.addOccurrence(node)
            if (node.is(TypesEnum.DATA_PROPERTY) || node.is(TypesEnum.OBJECT_PROPERTY)) {
              const functionalities = this.graphol.getFunctionalities(nodeXmlElement, this.xmlDocument)
              if (node.is(TypesEnum.DATA_PROPERTY)) {
                grapholEntity.isDataPropertyFunctional = functionalities.includes(FunctionalityEnum.FUNCTIONAL)
              } else {
                grapholEntity.functionProperties = functionalities
              }
            }
            grapholEntity.annotations = this.graphol.getEntityAnnotations(nodeXmlElement, this.xmlDocument, this.ontology.namespaces)
            grapholEntity.getAnnotations().forEach(annotation => {
              if (annotation.hasIriRange() && annotation.rangeIri) {
                if (!this.ontology.getEntity(annotation.rangeIri)) {
                  this.ontology.addEntity(new GrapholEntity(annotation.rangeIri))
                }

                if (!this.ontology.getEntity(annotation.propertyIri)) {
                  this.ontology.addEntity(new GrapholEntity(annotation.propertyIri))
                }
              }
            })
            // APPLY DISPLAYED NAME FROM LABELS
            node.displayedName = grapholEntity.getDisplayedName(EntityNameType.LABEL, undefined)

            // Add fake nodes
            if (node.is(TypesEnum.OBJECT_PROPERTY) &&
              grapholEntity.hasFunctionProperty(FunctionalityEnum.FUNCTIONAL) &&
              grapholEntity.hasFunctionProperty(FunctionalityEnum.INVERSE_FUNCTIONAL)) {
              node.addFakeNode(new FakeTriangleRight(node))
              node.addFakeNode(new FakeTriangleLeft(node))
              node.height -= 8
              node.width -= 10
            }
          }
        } else {
          // not an entity, take label from <label> tag or use those for constructor nodes          
          switch (node?.type) {
            case TypesEnum.FACET:
              node.displayedName = this.graphol.getFacetDisplayedName(nodeXmlElement, this.ontology) || ''
              break

            case TypesEnum.VALUE_DOMAIN:
              const iri = this.graphol.getIri(nodeXmlElement, this.ontology)
              node.displayedName = iri?.prefixed || ''
              break

            default:
              node.displayedName = GrapholNodesEnum[node.type]?.LABEL
              break
          }

          // for domain/range restrictions, cardinalities
          if (node.type === TypesEnum.DOMAIN_RESTRICTION || node.type === TypesEnum.RANGE_RESTRICTION) {
            node.displayedName = Graphol3.getTagText(nodes[k], 'label') || ''
          }
        }

        diagram.addElement(node, grapholEntity)
      }

      for (k = 0; k < edges.length; k++) {
        const edgeXmlElement = edges[k]
        const grapholEdge = this.getGrapholEdgeFromXML(edgeXmlElement, diagram.id)
        if (grapholEdge) {
          diagram.addElement(grapholEdge)

          if (grapholEdge.is(TypesEnum.INCLUSION)) {
            const sourceNode = diagram.representations.get(RendererStatesEnum.GRAPHOL)?.grapholElements.get(grapholEdge.sourceId)
            const targetNode = diagram.representations.get(RendererStatesEnum.GRAPHOL)?.grapholElements.get(grapholEdge.targetId)

            if (sourceNode?.iri && targetNode?.iri) {
              this.ontology.addSubclassOf(sourceNode.iri, targetNode.iri)
            }
          }
        }
      }
    }

    if (i == 0) {
      throw new Error("The selected .graphol file has no defined diagram")
    }

    this.getIdentityForNeutralNodes()
    this.ontology.computeDatatypesOnDataProperties()
    return this.ontology
  }

  getBasicGrapholNodeFromXML(element: Element, diagramId: number) {
    const nodeInfoBasedOnType = this.getGrapholNodeInfo(element)
    if (!nodeInfoBasedOnType) {
      console.warn(`[GRAPHOL_PARSER]: ${element.getAttribute('type')} is not a Graphol node type`)
      return
    }
    let grapholNode = new GrapholNode(element.getAttribute('id') || '', nodeInfoBasedOnType.TYPE)
    grapholNode.diagramId = diagramId
    grapholNode.shape = nodeInfoBasedOnType.SHAPE
    grapholNode.identity = nodeInfoBasedOnType.IDENTITY
    grapholNode.fillColor = element.getAttribute('color') || ''

    // Parsing the <geometry> child node of node
    var geometry = element.getElementsByTagName('geometry')[0]
    grapholNode.width = parseInt(geometry.getAttribute('width') || '')
    grapholNode.height = parseInt(geometry.getAttribute('height') || '')
    grapholNode.x = parseInt(geometry.getAttribute('x') || '')
    grapholNode.y = parseInt(geometry.getAttribute('y') || '')

    if (grapholNode.is(TypesEnum.ROLE_CHAIN) || grapholNode.is(TypesEnum.PROPERTY_ASSERTION)) {
      if (element.getAttribute('inputs') !== '')
        grapholNode.inputs = element.getAttribute('inputs')?.split(',')
    }

    let label = element.getElementsByTagName('label')[0]
    // apply label position and font size
    if (label != null) {
      grapholNode.labelHeight = parseInt(label.getAttribute('height') || '12')
      grapholNode.setLabelXposFromXML(parseInt(label.getAttribute('x') || '12'))
      grapholNode.setLabelYposFromXML(parseInt(label.getAttribute('y') || '12'))
      grapholNode.fontSize = parseInt(label.getAttribute('size') || '12')
    }

    if (grapholNode.is(TypesEnum.FACET)) {
      grapholNode.shapePoints = GrapholNodesEnum.facet?.SHAPE_POINTS
      grapholNode.fillColor = '#ffffff'

      // Add fake nodes
      //grapholNode.displayedName = grapholNode.displayedName.replace('^^', '\n\n')
      grapholNode.labelYpos = 1

      grapholNode.addFakeNode(new FakeTopRhomboid(grapholNode))
      grapholNode.addFakeNode(new FakeBottomRhomboid(grapholNode))
    }

    if (grapholNode.is(TypesEnum.PROPERTY_ASSERTION)) {
      // Add fake nodes
      grapholNode.height -= 1

      grapholNode.addFakeNode(new FakeRectangle(grapholNode))

      const fakeCircle1 = new FakeCircleRight(grapholNode)
      // fakeCircle1.x = grapholNode.x - ((grapholNode.width - grapholNode.height) / 2)
      grapholNode.addFakeNode(fakeCircle1)

      const fakeCircle2 = new FakeCircleLeft(grapholNode)
      // fakeCircle2.x = grapholNode.x + ((grapholNode.width - grapholNode.height) / 2)
      grapholNode.addFakeNode(fakeCircle2)

      grapholNode.addFakeNode(new FakeRectangleFront(grapholNode))
    }

    // if (ParserUtil.isPredicate(element))
    //   nodo.classes += ' predicate'
    return grapholNode
  }

  getGrapholEdgeFromXML(edgeXmlElement: Element, diagramId: number) {
    const typeKey = Object.keys(TypesEnum).find(k => TypesEnum[k] === edgeXmlElement.getAttribute('type'))
    if (!typeKey)
      return

    const grapholEdge = new GrapholEdge(edgeXmlElement.getAttribute('id') || '', TypesEnum[typeKey])

    const sourceId = edgeXmlElement.getAttribute('source')
    if (sourceId)
      grapholEdge.sourceId = sourceId

    const targetId = edgeXmlElement.getAttribute('target')
    if (targetId)
      grapholEdge.targetId = targetId


    // Prendiamo i nodi source e target
    var sourceGrapholNode = this.ontology.getGrapholNode(grapholEdge.sourceId, diagramId)
    var targetGrapholNode = this.ontology.getGrapholNode(grapholEdge.targetId, diagramId)
    if (sourceGrapholNode && targetGrapholNode) {
      // Impostiamo le label numeriche per gli archi che entrano nei role-chain
      // I role-chain hanno un campo <input> con una lista di id di archi all'interno
      // che sono gli archi che entrano, l'ordine nella sequenza stabilisce la label
      // numerica che deve avere l'arco
      // Quindi se l'arco che stiamo aggiungendo ha come target un nodo role-chain,
      // Cerchiamo l'id dell'arco negli inputs del role-chain e se lo troviamo impostiamo
      // la target_label in base alla posizione nella sequenza
      if (targetGrapholNode.is(TypesEnum.ROLE_CHAIN) || targetGrapholNode.is(TypesEnum.PROPERTY_ASSERTION)) {

        if (targetGrapholNode?.inputs) {
          for (let k = 0; k < targetGrapholNode.inputs.length; k++) {
            if (targetGrapholNode.inputs[k] === grapholEdge.id) {
              grapholEdge.targetLabel = (k + 1).toString()
              break
            }
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

      // Calcoliamo gli endpoints sul source e sul target
      // Se non sono centrati sul nodo vanno spostati sul bordo del nodo
      grapholEdge.sourceEndpoint = ParserUtil.getNewEndpoint(
        grapholEdge.controlpoints[0], // first breakpoint is the one on source
        sourceGrapholNode,
        grapholEdge.controlpoints[1]
      )

      // Facciamo la stessa cosa per il target
      grapholEdge.targetEndpoint = ParserUtil.getNewEndpoint(
        grapholEdge.controlpoints[grapholEdge.controlpoints.length - 1], // last endpoint is the one on target
        targetGrapholNode,
        grapholEdge.controlpoints[grapholEdge.controlpoints.length - 2]
      )

      // If we have no control-points and only one endpoint, we need an intermediate breakpoint
      // why? see: https://github.com/obdasystems/grapholscape/issues/47#issuecomment-987175639
      let breakpoint: Breakpoint | undefined
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
        }
      }

    }
    return grapholEdge
  }

  getIdentityForNeutralNodes() {
    this.ontology.diagrams.forEach(diagram => {
      const cy = diagram.representations.get(RendererStatesEnum.GRAPHOL)?.cy
      cy?.nodes('[identity = "neutral"]').forEach(node => {
        const newIdentity = findIdentity(node)
        node.data('identity', newIdentity)
        const grapholNode = this.ontology.getGrapholNode(node.id(), diagram.id)
        if (grapholNode)
          grapholNode.identity = newIdentity
      })
    })

    // Recursively traverse first input node and return his identity
    // if he is neutral => recursive step
    function findIdentity(node) {
      var first_input_node = node.incomers('[type = "input"]').sources()
      var identity = first_input_node.data('identity')
      if (identity === TypesEnum.NEUTRAL) { return findIdentity(first_input_node) } else {
        switch (node.data('type')) {
          case TypesEnum.RANGE_RESTRICTION:
            if (identity === TypesEnum.OBJECT_PROPERTY) {
              return TypesEnum.CLASS
            } else if (identity === TypesEnum.DATA_PROPERTY) {
              return TypesEnum.VALUE_DOMAIN
            } else {
              return identity
            }
          case TypesEnum.ENUMERATION:
            if (identity === TypesEnum.INDIVIDUAL) { return GrapholNodesEnum.class?.TYPE } else { return identity }
          default:
            return identity
        }
      }
    }
  }


  getGrapholNodeInfo(element: Element): GrapholNodeInfo | undefined {
    let elementTypeFromXmL = element.getAttribute('type')
    if (!elementTypeFromXmL) return

    switch (elementTypeFromXmL) {
      case 'concept':
        elementTypeFromXmL = TypesEnum.CLASS
        break

      case 'role':
        elementTypeFromXmL = TypesEnum.OBJECT_PROPERTY
        break

      case 'attribute':
        elementTypeFromXmL = TypesEnum.DATA_PROPERTY
        break
    }


    let nodeTypeKey = Object.keys(GrapholNodesEnum).find(k => GrapholNodesEnum[k].TYPE === elementTypeFromXmL) as TypesEnum
    if (!nodeTypeKey) return

    return GrapholNodesEnum[nodeTypeKey]
  }

  getCorrectLabelYpos(labelYpos: number, positionY: number, height: number) {
    return (labelYpos - positionY) + (height + 2) / 2 + LABEL_HEIGHT / 4
  }
}
