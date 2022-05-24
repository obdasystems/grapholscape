import Lifecycle, { LifecycleEvent } from "../lifecycle";
import Ontology, { GrapholscapeState } from "../model";
import { EntityNameType, Language } from "../model/state";

function _setLanguage(language: Language): void
function _setLanguage(language: string): void
function _setLanguage(language: string) {
  const languageValue = language as Language

  if (!Object.values(Language).includes(languageValue)) {
    console.warn(`Language ${language} has not been defined for this ontology`)
    return
  }

  const actualState: GrapholscapeState = this.actualState
  actualState.language = languageValue

  if (actualState.entityNameType === EntityNameType.LABEL) {
    const ontology: Ontology = this.ontology
    for (let entity of ontology.entities.values()) {
      entity.occurrences.forEach(entityOccurrence => {
        const diagram = ontology.getDiagram(entityOccurrence.diagramId)
        const grapholElement = diagram.grapholElements.get(entityOccurrence.elementId)
        const newLabel = 
          entity.getLabels(language)[0]?.lexicalForm ||
          entity.getLabels(actualState.ontology.languages.default)[0]?.lexicalForm ||
          entity.getLabels()[0]?.lexicalForm ||
          entity.iri.remainder

        if (newLabel !== grapholElement.displayedName) {
          grapholElement.displayedName = newLabel
          diagram.updateElement(grapholElement.id)
        }
      })
    }
  }

  const lifecycle: Lifecycle = this.lifecycle
  lifecycle.trigger(LifecycleEvent.LanguageChange, languageValue)
}

export const setLanguage = _setLanguage