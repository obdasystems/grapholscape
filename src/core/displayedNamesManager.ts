import { Language, storeConfigEntry } from "../config";
import { Diagram, EntityNameType, GrapholElement, GrapholEntity } from "../model";
import { LifecycleEvent } from "../model/lifecycle";
import { RendererStatesEnum } from "../model/renderers/i-render-state";
import { redo } from "../ui/assets";
import Grapholscape from "./grapholscape";
/**
 * @internal
 */
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
    for (let entity of this._grapholscape.ontology.entities.values()) {
      this.setDisplayedNames(entity)
    }
    console.log(this._grapholscape.ontology.diagrams)
    this._grapholscape.lifecycle.trigger(LifecycleEvent.EntityNameTypeChange, newEntityNameType)
    storeConfigEntry('entityNameType', newEntityNameType)
  }

  setLanguage(language: string | Language) {
    const languageValue = language as Language

    if (!this._grapholscape.ontology.languages.includes(language)) {
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
    storeConfigEntry('language', language)
  }

  private setDisplayedNames(entity: GrapholEntity) {
    let diagram: Diagram | undefined, newDisplayedName: string
    entity.occurrences.forEach((entityOccurrencesInRenderState, renderState) => {
      entityOccurrencesInRenderState.forEach(entityOccurrence => {

        newDisplayedName = entity.getDisplayedName(this.entityNameType, this.language)
        if (newDisplayedName !== entityOccurrence.displayedName) {
          entityOccurrence.displayedName = newDisplayedName

          if (renderState === RendererStatesEnum.INCREMENTAL) {
            // incremental diagram is not in the ontology, must take it from inremental controller
            diagram = this._grapholscape.incremental?.diagram
          } else {
            diagram = this._grapholscape.ontology.getDiagram(entityOccurrence.diagramId)
          }
        }
        diagram?.representations.get(renderState)?.updateElement(entityOccurrence, entity, false)
      })
    })
  }
}