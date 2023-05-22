import { EntityNameType, Language, storeConfigEntry } from "../config";
import { GrapholElement, GrapholEntity } from "../model";
import { LifecycleEvent } from "../model/lifecycle";
import { RendererStatesEnum } from "../model/renderers/i-render-state";
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

    this._grapholscape.lifecycle.trigger(LifecycleEvent.EntityNameTypeChange, newEntityNameType)
    storeConfigEntry('entityNameType', newEntityNameType)
  }

  setLanguage(language: string | Language) {
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
    storeConfigEntry('language', language)
  }

  private setDisplayedNames(entity: GrapholEntity) {
    entity.occurrences.forEach((entityOccurrencesInRenderState, renderState) => {
      entityOccurrencesInRenderState.forEach(entityOccurrence => {
        let grapholElement: GrapholElement | undefined

        if (renderState === RendererStatesEnum.INCREMENTAL) {
          // incremental diagram is not in the ontology, must take it from rendererStateData in renderer
          grapholElement = this._grapholscape.incremental?.diagram?.representation
            ?.grapholElements.get(entityOccurrence.elementId)
        } else {
          grapholElement = this._grapholscape.ontology.getGrapholElement(entityOccurrence.elementId, entityOccurrence.diagramId, renderState)
        }

        if (!grapholElement) return

        let newDisplayedName = entity.getDisplayedName(this.entityNameType, this.language)

        if (newDisplayedName !== grapholElement.displayedName) {
          grapholElement.displayedName = newDisplayedName
          const diagram = this._grapholscape.ontology.getDiagram(entityOccurrence.diagramId) || this._grapholscape.incremental?.diagram

          if (diagram) {
            /**
             * Entity Occurrences are not replicated, in entity.occurrences.get('lite') there will
             * be only replicated/transformed entities. So the occurrences in graphol will be
             * present also in other representations unless filtered.
             * So for each occurrence in graphol, we search it in other representations and update them as well
             */
            if (renderState === RendererStatesEnum.GRAPHOL) {
              diagram.representations.forEach(representation => {
                if (grapholElement)
                  representation.cy.$id(grapholElement.id).data('displayedName', grapholElement.displayedName)
              })
            } else {
              diagram.representations.get(renderState)?.cy.$id(grapholElement.id).data('displayedName', grapholElement.displayedName)
            }
          } else {
            this._grapholscape.renderer.diagram?.representations.forEach(representation => representation.updateElement(grapholElement!.id))
          }
        }
      })
    })
  }
}