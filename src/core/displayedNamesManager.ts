import { LifecycleEvent } from "../model/lifecycle";
import { GrapholEntity } from "../model";
import { EntityNameType, Language } from "../model/state";
import Grapholscape from "./grapholscape";

export default class DisplayedNamesManager {
  private _grapholscape: Grapholscape
  private _entityNameType = EntityNameType.LABEL
  private _language = Language.EN

  constructor(grapholscape: Grapholscape) {
    this._grapholscape = grapholscape
  }

  get entityNameType() { return this._entityNameType }
  get language() { return this._language }

  setEntityNameType(newEntityNameType: EntityNameType) {  
    if (newEntityNameType === this._entityNameType) return
  
    if (!Object.values(EntityNameType).includes(newEntityNameType)) {
      console.warn(`"${newEntityNameType}" is not a valid entity name type`)
      return
    }
  
    this._entityNameType = newEntityNameType
    for(let entity of this._grapholscape.ontology.entities.values()) {
      this.setDisplayedNames(entity)
    }

    this._grapholscape.lifecycle.trigger(LifecycleEvent.EntityNameTypeChange, newEntityNameType)
  }

  setLanguage(language: Language): void
  setLanguage(language: string): void
  setLanguage(language: string) {
  const languageValue = language as Language

  if (!this._grapholscape.ontology.languages.list.includes(language)) {
    console.warn(`Language ${language} is not supported by this ontology`)
    return
  }

  if (languageValue === this._language) {
    return
  }

  this._language = languageValue

  if (this._entityNameType === EntityNameType.LABEL) {
    for (let entity of this._grapholscape.ontology.entities.values()) {
      this.setDisplayedNames(entity)
    }
  }

  this._grapholscape.lifecycle.trigger(LifecycleEvent.LanguageChange, languageValue)
}

  private setDisplayedNames(entity: GrapholEntity) {  
    entity.occurrences.forEach((entityOccurrencesInRenderState, renderState) => {

      entityOccurrencesInRenderState.forEach(entityOccurrence => {
        const grapholElement = this._grapholscape.ontology.getGrapholElement(entityOccurrence.elementId, entityOccurrence.diagramId, renderState)

        let newDisplayedName: string
        switch(this._entityNameType) {
          case EntityNameType.LABEL:
            newDisplayedName =
              entity.getLabels(this._language)[0]?.lexicalForm ||
              entity.getLabels(this._grapholscape.ontology.languages.default)[0]?.lexicalForm ||
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
          this._grapholscape.renderer.updateElement(grapholElement)
        }
      })
    })
  }
}