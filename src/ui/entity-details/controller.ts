import Grapholscape from '../../core'
import { GrapholElement, GrapholEntity, Iri, LifecycleEvent, RendererStatesEnum, TypesEnum } from '../../model'
import { SHACLShape, SHACLShapeTypeEnum } from '../../model/rdf-graph/swagger'
import getEntityViewOccurrences from '../util/get-entity-view-occurrences'
import { SHACLShapeViewData } from '../view-model'
import GscapeEntityDetails from './entity-details'

export default function (entityDetailsComponent: GscapeEntityDetails, grapholscape: Grapholscape) {
  // entityDetailsComponent.onWikiClick = (iri) => grapholscape.wikiRedirectTo(iri)
  entityDetailsComponent.onNodeNavigation = (elementId, diagramId) => {
    grapholscape.centerOnElement(elementId, diagramId, 1.2)
    grapholscape.selectElement(elementId)
  }

  entityDetailsComponent.onEntityNavigation = (iri) => {
    grapholscape.centerOnEntity(iri, undefined, 1.2)
  }
  entityDetailsComponent.language = grapholscape.language
  entityDetailsComponent.entityNameType = grapholscape.entityNameType

  entityDetailsComponent.setGrapholEntity = setGrapholEntity

  grapholscape.on(LifecycleEvent.EntitySelection, setGrapholEntity)

  grapholscape.on(LifecycleEvent.NodeSelection, node => {
    if (node.is(TypesEnum.IRI) && node.iri) {
      const tempEntity = new GrapholEntity(new Iri(node.iri, grapholscape.ontology.namespaces))
      setGrapholEntity(tempEntity, node)
    } else if (!node.isEntity())
      entityDetailsComponent.hide()
  })

  grapholscape.on(LifecycleEvent.EdgeSelection, edge => {
    if (!edge.isEntity())
      entityDetailsComponent.hide()
  })

  grapholscape.on(LifecycleEvent.LanguageChange, language => {
    entityDetailsComponent.language = language
  })

  grapholscape.on(LifecycleEvent.EntityNameTypeChange, entityNameType => {
    entityDetailsComponent.entityNameType = entityNameType
  })

  grapholscape.on(LifecycleEvent.RendererChange, _ => {
    if (entityDetailsComponent.grapholEntity && grapholscape.renderState !== RendererStatesEnum.INCREMENTAL)
      entityDetailsComponent.occurrences = getEntityViewOccurrences(entityDetailsComponent.grapholEntity, grapholscape)

    entityDetailsComponent.showOccurrences = grapholscape.renderState !== RendererStatesEnum.INCREMENTAL
  })


  function setGrapholEntity(entity: GrapholEntity, instance?: GrapholElement) {
    entityDetailsComponent.grapholEntity = entity
    entityDetailsComponent.currentOccurrence = instance
    entityDetailsComponent.occurrences = getEntityViewOccurrences(entity, grapholscape)
    entityDetailsComponent.language = grapholscape.language
    entityDetailsComponent.inverseObjectPropertyEntities = entity.getInverseObjectProperties()
      ?.map(inverseOPIri => grapholscape.ontology.getEntity(inverseOPIri)!)

    const constraints: Map<SHACLShapeTypeEnum, SHACLShapeViewData[]> = new Map()
    const domainConstraints: SHACLShapeViewData[] = []
    const rangeConstraints: SHACLShapeViewData[] = []
    if (instance) {
      if (instance.is(TypesEnum.DATA_PROPERTY)) {
        Array.from(grapholscape.ontology.shaclConstraints).forEach(([classIri, SHACLConstraints]) => {
          SHACLConstraints.filter(c => c.path && c.path === entity.iri.fullIri).forEach(c => {
            const shaclViewData = {
              type: c.type,
              path: c.path,
              property: c.property ? grapholscape.ontology.getEntity(c.property) : undefined,
              constraintValue: c.constraintValue,
              targetClass: grapholscape.ontology.getEntity(c.targetClass),
            }
            constraints.set(c.type, [...(constraints.get(c.type) || []), shaclViewData ])
          })
        })
      } else if (instance.is(TypesEnum.OBJECT_PROPERTY) && instance.isEdge()) {
        const sourceClassNode = grapholscape.renderer.cy?.$id(instance.sourceId)
        const targetClassNode = grapholscape.renderer.cy?.$id(instance.targetId)

        if (sourceClassNode) {
          domainConstraints.push(...(grapholscape.ontology.shaclConstraints.get(sourceClassNode.data().iri) || [])?.filter(c => c.path === entity.iri.fullIri).map(c => ({
            type: c.type,
            path: c.path,
            property: c.property ? grapholscape.ontology.getEntity(c.property) : undefined,
            constraintValue: c.constraintValue,
            targetClass: grapholscape.ontology.getEntity(c.targetClass)
          })))
        }

        if (targetClassNode) {
          rangeConstraints.push(...(grapholscape.ontology.shaclConstraints.get(targetClassNode.data().iri) || [])?.filter(c => c.path === entity.iri.fullIri).map(c => ({
            type: c.type,
            path: c.path,
            property: c.property ? grapholscape.ontology.getEntity(c.property) : undefined,
            constraintValue: c.constraintValue,
            targetClass: grapholscape.ontology.getEntity(c.targetClass)
          })))
        }
      }
    }
    entityDetailsComponent.constraints = constraints
    entityDetailsComponent.domainConstraints = domainConstraints
    entityDetailsComponent.rangeConstraints = rangeConstraints
    entityDetailsComponent.show()

    if (grapholscape.lifecycle.entityWikiLinkClick.length > 0 && !entityDetailsComponent.onWikiLinkClick) {
      entityDetailsComponent.onWikiLinkClick = (iri: string) => {
        grapholscape.lifecycle.trigger(LifecycleEvent.EntityWikiLinkClick, iri)
      }
    }
  }

}