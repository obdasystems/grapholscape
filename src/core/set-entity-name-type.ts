import Lifecycle, { LifecycleEvent } from "../lifecycle"
import Ontology, { GrapholEntity, GrapholscapeState } from "../model"
import { EntityNameType, Language } from "../model/state"

function _setEntityNameType(newEntityNameType: EntityNameType) {
  const actualState: GrapholscapeState = this.actualState

  if (newEntityNameType === actualState.entityNameType) return

  if (!Object.values(EntityNameType).includes(newEntityNameType)) {
    console.warn(`"${newEntityNameType}" is not a valid entity name type`)
    return
  }

  actualState.entityNameType = newEntityNameType
  for(let entity of actualState.ontology.entities.values()) {
    setDisplayedNames.call(this, entity)
  }

  const lifecycle: Lifecycle = this.lifecycle
  lifecycle.trigger(LifecycleEvent.EntityNameTypeChange, newEntityNameType)
}

export function setDisplayedNames(entity: GrapholEntity) {
  const actualState: GrapholscapeState = this.actualState

  entity.occurrences.forEach(entityOccurrence => {
    const diagram = actualState.ontology.getDiagram(entityOccurrence.diagramId)
    const grapholElement = diagram.grapholElements.get(entityOccurrence.elementId)
    
    let newDisplayedName: string
    switch(actualState.entityNameType) {
      case EntityNameType.LABEL:
        newDisplayedName =
          entity.getLabels(actualState.language)[0]?.lexicalForm ||
          entity.getLabels(actualState.ontology.languages.default)[0]?.lexicalForm ||
          entity.getLabels()[0]?.lexicalForm ||
          entity.iri.remainder
        break
      
      case EntityNameType.PREFIXED_IRI:
        newDisplayedName = entity.iri.prefixed
        break

      case EntityNameType.FULL_IRI: 
        newDisplayedName = entity.iri.fullIri
        break
    }
    

    if (newDisplayedName !== grapholElement.displayedName) {
      grapholElement.displayedName = newDisplayedName
      diagram.updateElement(grapholElement.id)
    }
  })
}

export const setEntityNameType = _setEntityNameType