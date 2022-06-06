import { NodeCollection, NodeSingular } from "cytoscape";
import { floatyOptions } from "../../../config/cytoscape-default-config";
import { Diagram, DiagramRepresentation, GrapholEdge, GrapholNode, GrapholTypesEnum, RenderStatesEnum } from "../../../model";
import BaseGrapholTransformer from "../base-transformer";
import LiteTransformer from "../lite/lite-transformer";

export default class FloatyTransformer extends BaseGrapholTransformer {

  get newCy() { return this.result.cy }

  transform(diagram: Diagram): DiagramRepresentation {
    this.result = new DiagramRepresentation(floatyOptions)

    let liteRepresentation = diagram.representations.get(RenderStatesEnum.GRAPHOL_LITE)

    if (!liteRepresentation || liteRepresentation.grapholElements.size === 0) {
      liteRepresentation = new LiteTransformer().transform(diagram)
      diagram.representations.set(RenderStatesEnum.GRAPHOL_LITE, liteRepresentation)
    }

    this.result.grapholElements = new Map(liteRepresentation.grapholElements)

    this.newCy.add(liteRepresentation.cy.elements().clone())
    this.newCy.elements().removeClass('filtered') // make all filtered elements not filtered anymore

    // remember original positions
    // this.newCy.$('node').forEach( node => {
    //   node.data('original-position', JSON.stringify(node.position()))
    // })

    this.filterByCriterion(node => {
      return this.getGrapholElement(node.id()) === undefined
    })

    this.makeEdgesStraight()
    this.simplifyRolesFloat()
    // this.simplifyHierarchiesFloat(cy)
    // this.simplifyAttributesFloat(cy)
    // cy.edges().removeData('segment_distances')
    // cy.edges().removeData('segment_weights')
    // cy.edges().removeData('target_endpoint')
    // cy.edges().removeData('source_endpoint')
    //cy.$(`[type = "${GrapholTypesEnum.CONCEPT}"]`).addClass('bubble')

    this.newCy.elements().unlock()
    return this.result
  }

  private makeEdgesStraight() {
    this.result.cy.$('edge').forEach(edge => {
      const grapholEdge = this.getGrapholElement(edge.id()) as GrapholEdge
      grapholEdge.controlpoints = []
      grapholEdge.targetEndpoint = null
      grapholEdge.sourceEndpoint = null
      this.result.updateElement(grapholEdge)
    })
  }

  private simplifyRolesFloat() {
    let objectProperties = this.newCy.nodes().filter(node => {
      const grapholNode = this.getGrapholElement(node.id())
      return grapholNode && grapholNode.is(GrapholTypesEnum.OBJECT_PROPERTY)
    })

    objectProperties.forEach(objectProperty => {
      let domains = this.getDomainsOfObjectProperty(objectProperty)
      let ranges = this.getRangesOfObjectProperty(objectProperty)
      this.connectDomainsRanges(domains, ranges, objectProperty)
    })

    //cy.remove(objectProperties)
    this.deleteElements(objectProperties)
  }

  private connectDomainsRanges(domains: NodeCollection, ranges: NodeCollection, objectProperty: NodeSingular) {
    let grapholDomainNode: GrapholNode, grapholRangeNode: GrapholNode
    let newId = `e-${objectProperty.id()}`
    domains.forEach(domain => {
      grapholDomainNode = this.getGrapholElement(domain.id()) as GrapholNode
      ranges.forEach((range, i) => {
        grapholRangeNode = this.getGrapholElement(range.id()) as GrapholNode

        if (i > 0) newId = `e-${objectProperty.id()}-${grapholDomainNode.id}-${grapholRangeNode.id}-${i}`
        let newGrapholEdge = new GrapholEdge(newId)
        newGrapholEdge.sourceId = grapholDomainNode.id
        newGrapholEdge.targetId = grapholRangeNode.id

        Object.entries(objectProperty.data()).forEach(([key, value]) => {
          switch (key) {
            case 'id':
            case 'labelXpos':
            case 'labelYpos':
            case 'labelXcentered':
            case 'labelYcentered':
            case 'shape':
              break

            default:
              newGrapholEdge[key] = value
          }
        })

        console.log(newGrapholEdge)
        this.result.addElement(newGrapholEdge)

        if (newGrapholEdge.sourceId === newGrapholEdge.targetId) {
          let loop_edge = this.newCy.$id(newGrapholEdge.id)
          loop_edge.data('control_point_step_size', grapholDomainNode.width)
        }

        //cy.add(new_edge)

      })
    })
  }


  private getDomainsOfObjectProperty(objectProperty: NodeSingular) {
    if (!objectProperty || objectProperty.empty()) return null

    let domains = objectProperty.incomers(`edge`).filter(edge =>
      this.getGrapholElement(edge.id()).is(GrapholTypesEnum.DOMAIN_RESTRICTION)
    ).sources()

    const fathers = this.getFathers(objectProperty)

    let fathersDomains = this.newCy.collection()

    fathers.forEach(father => {
      fathersDomains = fathersDomains.union(this.getDomainsOfObjectProperty(father))
    })

    return domains.union(fathersDomains)
  }

  private getRangesOfObjectProperty(objectProperty: NodeSingular) {
    if (!objectProperty || objectProperty.empty()) return null
    let ranges = objectProperty.incomers(`edge`).filter(edge =>
      this.getGrapholElement(edge.id()).is(GrapholTypesEnum.RANGE_RESTRICTION)
    ).sources()

    const fathers = this.getFathers(objectProperty)

    let fatherRanges = this.newCy.collection()

    fathers.forEach(father => {
      fatherRanges = fatherRanges.union(this.getRangesOfObjectProperty(father))
    })

    return ranges.union(fatherRanges)
  }

  private getFathers(node: NodeSingular) {
    return node.outgoers('edge').filter(edge =>
      this.getGrapholElement(edge.id()).is(GrapholTypesEnum.INCLUSION)
    ).targets()
  }

}