import { NodeCollection, NodeSingular } from "cytoscape";
import { floatyOptions } from "../../../config/cytoscape-default-config";
import { Diagram, DiagramRepresentation, GrapholEdge, GrapholNode, RendererStatesEnum, TypesEnum } from "../../../model";
import BaseGrapholTransformer from "../base-transformer";
import LiteTransformer from "../lite/lite-transformer";

export default class FloatyTransformer extends BaseGrapholTransformer {

  get newCy() { return this.result.cy }

  transform(diagram: Diagram): DiagramRepresentation {
    this.result = new DiagramRepresentation(floatyOptions)

    let liteRepresentation = diagram.representations.get(RendererStatesEnum.GRAPHOL_LITE)

    if (!liteRepresentation || liteRepresentation.grapholElements.size === 0) {
      liteRepresentation = new LiteTransformer().transform(diagram)
      diagram.representations.set(RendererStatesEnum.GRAPHOL_LITE, liteRepresentation)
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

    this.newCy.elements().unlock()
    return this.result
  }

  private makeEdgesStraight() {
    this.result.cy.$('edge').forEach(edge => {
      const grapholEdge = this.getGrapholElement(edge.id()) as GrapholEdge
      grapholEdge.controlpoints = []
      grapholEdge.targetEndpoint = undefined
      grapholEdge.sourceEndpoint = undefined
      this.result.updateElement(grapholEdge)
    })
  }

  private simplifyRolesFloat() {
    let objectProperties = this.newCy.nodes().filter(node => {
      const grapholNode = this.getGrapholElement(node.id())
      return grapholNode && grapholNode.is(TypesEnum.OBJECT_PROPERTY)
    })

    objectProperties.forEach(objectProperty => {
      let domains = this.getDomainsOfObjectProperty(objectProperty)
      let ranges = this.getRangesOfObjectProperty(objectProperty)
      if (domains && ranges)
        this.connectDomainsRanges(domains, ranges, objectProperty)
    })

    //cy.remove(objectProperties)
    this.deleteElements(objectProperties)
  }

  private connectDomainsRanges(domains: NodeCollection, ranges: NodeCollection, objectProperty: NodeSingular) {
    let grapholDomainNode: GrapholNode, grapholRangeNode: GrapholNode, newId: string

    domains.forEach((domain) => {
      grapholDomainNode = this.getGrapholElement(domain.id()) as GrapholNode
      ranges.forEach((range, i) => {
        grapholRangeNode = this.getGrapholElement(range.id()) as GrapholNode

        newId = `e-${objectProperty.id()}-${grapholDomainNode.id}-${grapholRangeNode.id}-${i}`
        let newGrapholEdge = new GrapholEdge(newId, TypesEnum.OBJECT_PROPERTY)
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

        newGrapholEdge.originalId = objectProperty.id().toString()

        this.result.addElement(newGrapholEdge)
        const newAddedCyElement = this.newCy.$id(newGrapholEdge.id)
        newAddedCyElement.data().iri = objectProperty.data().iri
      })
    })
  }


  private getDomainsOfObjectProperty(objectProperty: NodeSingular) {
    if (!objectProperty || objectProperty.empty()) return null

    let domains = objectProperty.incomers(`edge`).filter(edge =>
      this.getGrapholElement(edge.id()).is(TypesEnum.DOMAIN_RESTRICTION)
    ).sources()

    const fathers = this.getFathers(objectProperty)

    let fathersDomains = this.newCy.collection()

    fathers.forEach(father => {
      const newDomains = this.getDomainsOfObjectProperty(father)
      if (newDomains)
        fathersDomains = fathersDomains.union(newDomains)
    })

    return domains.union(fathersDomains)
  }

  private getRangesOfObjectProperty(objectProperty: NodeSingular) {
    if (!objectProperty || objectProperty.empty()) return
    let ranges = objectProperty.incomers(`edge`).filter(edge =>
      this.getGrapholElement(edge.id()).is(TypesEnum.RANGE_RESTRICTION)
    ).sources()

    const fathers = this.getFathers(objectProperty)

    let fatherRanges = this.newCy.collection()

    fathers.forEach(father => {
      const newRanges = this.getRangesOfObjectProperty(father)
      if (newRanges)
        fatherRanges = fatherRanges.union(newRanges)
    })

    return ranges.union(fatherRanges)
  }

  private getFathers(node: NodeSingular) {
    return node.outgoers('edge').filter(edge =>
      this.getGrapholElement(edge.id()).is(TypesEnum.INCLUSION)
    ).targets()
  }

}