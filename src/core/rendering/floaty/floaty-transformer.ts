import { Collection, NodeSingular } from "cytoscape";
import { floatyOptions } from "../../../config/cytoscape-default-config";
import { DefaultNamespaces, Diagram, DiagramRepresentation, EntityNameType, GrapholEdge, GrapholElement, GrapholEntity, GrapholNode, Ontology, RendererStatesEnum, TypesEnum } from "../../../model";
import BaseGrapholTransformer from "../base-transformer";
import LiteTransformer from "../lite/lite-transformer";
import Grapholscape from "../../grapholscape";

export default class FloatyTransformer extends BaseGrapholTransformer {

  get newCy() { return this.result.cy }

  transform(diagram: Diagram): DiagramRepresentation {
    this.result = new DiagramRepresentation(floatyOptions)

    this.diagramId = diagram.id
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

    this.addPropertyAssertionsEdge()

    this.filterByCriterion(node => {
      return this.getGrapholElement(node.id()) === undefined
    })

    this.makeEdgesStraight()
    this.simplifyRolesFloat()

    // Remove fake nodes and restriction nodes left on diagram
    this.result.cy.nodes().filter(node => {
      return node.data().fake === true || node.data().type.endsWith('restriction')
    }).remove()

    const grapholRepresentation = diagram.representations.get(RendererStatesEnum.GRAPHOL)
    if (grapholRepresentation) {
      this.attachLostPropertiesToOWLThing(grapholRepresentation)
    }

    this.newCy.elements().unlock()
    return this.result
  }

  static addAnnotationPropertyEdges(grapholscape: Grapholscape) {
    const ontology = grapholscape.ontology

    let diagram = ontology.annotationsDiagram
    if (!diagram)
      return

    let annotationPropertyEntity: GrapholEntity | undefined
    let annotationPropertyEdge: GrapholEdge | undefined
    let targetEntity: GrapholEntity | undefined
    let targetNode: NodeSingular | undefined
    let node: GrapholNode | undefined

    for (let [sourceEntityIri, sourceEntity] of ontology.entities) {
      sourceEntity.getAnnotations().filter(ann => ann.hasIriValue).forEach(annotation => {
        if (!annotation.rangeIri) return
        // diagramsUsed.clear()
        annotationPropertyEntity = ontology.getEntity(annotation.propertyIri)
        targetEntity = ontology.getEntity(annotation.rangeIri)
        if (!annotationPropertyEntity) return

        diagram?.addIRIValueAnnotation(
          sourceEntity,
          annotationPropertyEntity,
          annotation.rangeIri,
          grapholscape.entityNameType,
          grapholscape.language,
          targetEntity
        )
      })
    }
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

  private connectDomainsRanges(domains: Collection, ranges: Collection, objectProperty: NodeSingular) {
    let grapholDomainNode: GrapholNode, grapholRangeNode: GrapholNode, owlThingCyNode: NodeSingular, newId: string

    if (domains.empty() && ranges.empty()) {
      return
    }

    if (domains.empty() || ranges.empty()) {
      owlThingCyNode = this.newCy.$id(this.addOWlThing().id)

      if (domains.empty()) {
        domains = domains.union(owlThingCyNode)
      }

      if (ranges.empty()) {
        ranges = ranges.union(owlThingCyNode)
      }
    }

    domains.forEach((domain) => {
      grapholDomainNode = domain === owlThingCyNode
        ? this.getGrapholElement(domain.id()) as GrapholNode
        : this.getGrapholElement(domain.source().id()) as GrapholNode
      ranges.forEach((range, i) => {
        grapholRangeNode = range === owlThingCyNode
          ? this.getGrapholElement(range.id()) as GrapholNode
          : this.getGrapholElement(range.source().id()) as GrapholNode

        let newGrapholEdge = new GrapholEdge(this.result.getNewId('edge'), TypesEnum.OBJECT_PROPERTY)
        newGrapholEdge.sourceId = grapholDomainNode.id
        newGrapholEdge.targetId = grapholRangeNode.id
        if (this.diagramId !== undefined)
          newGrapholEdge.diagramId = this.diagramId

        // if it's an object property on owl thing then leave domain/range info as default (only typed)
        if (domain !== owlThingCyNode) {
          newGrapholEdge.domainMandatory = domain.data().domainMandatory
          newGrapholEdge.domainTyped = domain.data().domainTyped
        }

        if (range !== owlThingCyNode) {
          newGrapholEdge.rangeMandatory = range.data().rangeMandatory
          newGrapholEdge.rangeTyped = range.data().rangeTyped
        }

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

        // newGrapholEdge.originalId = objectProperty.id().toString()

        this.result.addElement(newGrapholEdge)
        const newAddedCyElement = this.newCy.$id(newGrapholEdge.id)
        newAddedCyElement.data('iri', objectProperty.data().iri)
      })
    })
  }

  private attachLostPropertiesToOWLThing(grapholRepresentation: DiagramRepresentation) {
    const originalObjectProperties = grapholRepresentation.cy.$(`[type = "${TypesEnum.OBJECT_PROPERTY}"]`)
    const originalDataProperties = grapholRepresentation.cy.$(`[type = "${TypesEnum.DATA_PROPERTY}"]`)

    let originalElem: GrapholElement | undefined, attributeEdge: GrapholEdge, owlThingClass: GrapholElement | undefined

    originalDataProperties.forEach(dp => {
      if (this.result.cy.$(`[type = "${TypesEnum.DATA_PROPERTY}"][iri = "${dp.data().iri}"]`).empty()) {
        originalElem = grapholRepresentation.grapholElements.get(dp.id())
        if (originalElem) {
          this.result.cy.add(dp.clone())
          this.result.grapholElements.set(dp.id(), originalElem)
          if (!owlThingClass) {
            owlThingClass = this.addOWlThing()
          }
          attributeEdge = new GrapholEdge(this.result.getNewId('edge'), TypesEnum.DATA_PROPERTY)
          attributeEdge.sourceId = owlThingClass.id
          attributeEdge.targetId = originalElem.id
          this.result.addElement(attributeEdge)
        }
      }
    })

    let objectPropertyEdge: GrapholEdge
    originalObjectProperties.forEach(op => {
      if (this.result.cy.$(`[type = "${TypesEnum.OBJECT_PROPERTY}"][iri = "${op.data().iri}"]`).empty()) {
        originalElem = grapholRepresentation.grapholElements.get(op.id())
        if (originalElem) {
          if (!owlThingClass) {
            owlThingClass = this.addOWlThing()
          }
          objectPropertyEdge = new GrapholEdge(this.result.getNewId('edge'), TypesEnum.OBJECT_PROPERTY)
          objectPropertyEdge.iri = originalElem!.iri
          objectPropertyEdge.displayedName = originalElem!.displayedName
          if (this.diagramId !== undefined)
            objectPropertyEdge.diagramId = this.diagramId
          objectPropertyEdge.sourceId = owlThingClass.id
          objectPropertyEdge.targetId = owlThingClass.id
          this.result.addElement(objectPropertyEdge)
        }
      }
    })

  }


  private getDomainsOfObjectProperty(objectProperty: NodeSingular) {
    if (!objectProperty || objectProperty.empty()) return null

    let domainRestrictions = objectProperty.incomers(`edge`).filter(edge =>
      this.getGrapholElement(edge.id()).is(TypesEnum.DOMAIN_RESTRICTION)
    )

    const fathers = this.getFathers(objectProperty)

    let fathersDomainRestrictions = this.newCy.collection()

    fathers.forEach(father => {
      const newDomains = this.getDomainsOfObjectProperty(father)
      if (newDomains)
        fathersDomainRestrictions = fathersDomainRestrictions.union(newDomains)
    })

    return domainRestrictions.union(fathersDomainRestrictions)
  }

  private getRangesOfObjectProperty(objectProperty: NodeSingular) {
    if (!objectProperty || objectProperty.empty()) return
    let rangeRestrictions = objectProperty.incomers(`edge`).filter(edge =>
      this.getGrapholElement(edge.id()).is(TypesEnum.RANGE_RESTRICTION)
    )

    const fathers = this.getFathers(objectProperty)

    let fatherRangeRestrictions = this.newCy.collection()

    fathers.forEach(father => {
      const newRanges = this.getRangesOfObjectProperty(father)
      if (newRanges)
        fatherRangeRestrictions = fatherRangeRestrictions.union(newRanges)
    })

    return rangeRestrictions.union(fatherRangeRestrictions)
  }

  private addPropertyAssertionsEdge() {
    let sourceId: string | undefined
    let targetId: string | undefined
    let objectPropertyNode: GrapholElement | undefined

    const propertyAsserstions = this.result.cy.$(`[!fake][type = "${TypesEnum.PROPERTY_ASSERTION}"]`)
    propertyAsserstions.forEach(propertyAssertionNode => {
      const inputs = propertyAssertionNode.connectedEdges(`[type = "${TypesEnum.INPUT}"]`)

      sourceId = inputs.filter(edge => edge.data('targetLabel') === '1').source().id()
      targetId = inputs.filter(edge => edge.data('targetLabel') === '2').source().id()

      if (sourceId && targetId) {
        propertyAssertionNode.connectedEdges(`[type = "${TypesEnum.MEMBERSHIP}"]`).forEach(membershipEdge => {
          objectPropertyNode = this.getGrapholElement(membershipEdge.target().id())

          if (objectPropertyNode) {
            const newObjectPropertyEdge = new GrapholEdge(this.result.getNewId('edge'), TypesEnum.OBJECT_PROPERTY)
            newObjectPropertyEdge.iri = objectPropertyNode.iri
            newObjectPropertyEdge.displayedName = objectPropertyNode.displayedName
            if (this.diagramId !== undefined)
              newObjectPropertyEdge.diagramId = this.diagramId
            // newObjectPropertyEdge.originalId = objectPropertyNode.id
            newObjectPropertyEdge.sourceId = sourceId!
            newObjectPropertyEdge.targetId = targetId!
            newObjectPropertyEdge.domainMandatory = true
            newObjectPropertyEdge.rangeMandatory = true
            newObjectPropertyEdge.domainTyped = false
            newObjectPropertyEdge.rangeTyped = false

            const newAddedCyElement = this.result.addElement(newObjectPropertyEdge)
            newAddedCyElement.data('iri', objectPropertyNode.iri)
          }
        })
      }
    })

    this.deleteElements(propertyAsserstions)
  }

  private getFathers(node: NodeSingular) {
    return node.outgoers('edge').filter(edge =>
      this.getGrapholElement(edge.id()).is(TypesEnum.INCLUSION)
    ).targets()
  }

  private addOWlThing() {
    const thingIri = DefaultNamespaces.OWL.toString() + 'Thing'
    const owlThingCyElem = this.newCy.$(`[ iri = "${thingIri}"]`).first()

    if (owlThingCyElem.empty()) {
      const owlThingClass = new GrapholNode(this.result.getNewId('node'), TypesEnum.CLASS)
      owlThingClass.iri = thingIri
      owlThingClass.displayedName = 'Thing'
      if (this.diagramId !== undefined)
        owlThingClass.diagramId = this.diagramId
      this.result.addElement(owlThingClass)
      return owlThingClass
    } else {
      return this.getGrapholElement(owlThingCyElem.id())
    }
  }
}