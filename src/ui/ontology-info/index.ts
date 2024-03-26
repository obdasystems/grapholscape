import { Grapholscape } from "../../core"
import { GrapholEntity, LifecycleEvent, RendererStatesEnum, TypesEnum } from "../../model"
import { WidgetEnum } from "../util/widget-enum"
import GscapeOntologyInfo from "./ontology-info"

export { GscapeOntologyInfo }

export default function initOntologyInfo(grapholscape: Grapholscape) {
  const ontologyInfoComponent = new GscapeOntologyInfo()

  ontologyInfoComponent.language = grapholscape.language

  grapholscape.on(LifecycleEvent.LanguageChange, language => {
    ontologyInfoComponent.language = language
  })

  ontologyInfoComponent.onTogglePanel = () => {
    ontologyInfoComponent.ontology = grapholscape.ontology
    ontologyInfoComponent.entityCounters = countEntities(grapholscape, ontologyInfoComponent.diagramIdFilter)
  }

  ontologyInfoComponent.addEventListener('counters-filter', (event: CustomEvent) => {
    ontologyInfoComponent.entityCounters = countEntities(grapholscape, event.detail.diagramId)
  })

  ontologyInfoComponent.addEventListener('counters-update', () => {
    ontologyInfoComponent.entityCounters = countEntities(grapholscape, ontologyInfoComponent.diagramIdFilter)
  })

  grapholscape.widgets.set(WidgetEnum.ONTOLOGY_INFO, ontologyInfoComponent)
}

function countEntities(grapholscape: Grapholscape, filterByDiagram?: number) {
  const count = (entities: GrapholEntity[]) => {
    if (filterByDiagram !== undefined) {
      return entities.filter(entity => entity.hasOccurrenceInDiagram(filterByDiagram, grapholscape.renderState || RendererStatesEnum.GRAPHOL)).length
    } else {
      return entities.length
    }
  }

  return {
    [TypesEnum.CLASS]: count(grapholscape.ontology.getEntitiesByType(TypesEnum.CLASS)),
    [TypesEnum.DATA_PROPERTY]: count(grapholscape.ontology.getEntitiesByType(TypesEnum.DATA_PROPERTY)),
    [TypesEnum.OBJECT_PROPERTY]: count(grapholscape.ontology.getEntitiesByType(TypesEnum.OBJECT_PROPERTY)),
    [TypesEnum.INDIVIDUAL]: count(grapholscape.ontology.getEntitiesByType(TypesEnum.INDIVIDUAL)),
  }
}