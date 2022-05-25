import Lifecycle, { LifecycleEvent } from "../lifecycle";
import Ontology, { GrapholscapeState } from "../model";
import { EntityNameType, Language } from "../model/state";
import { setDisplayedNames } from "./set-entity-name-type";

function _setLanguage(language: Language): void
function _setLanguage(language: string): void
function _setLanguage(language: string) {
  const languageValue = language as Language
  const actualState: GrapholscapeState = this.actualState

  if (!actualState.ontology.languages.list.includes(language)) {
    console.warn(`Language ${language} is not supported by this ontology`)
    return
  }

  if (languageValue === actualState.language) {
    return
  }

  actualState.language = languageValue

  if (actualState.entityNameType === EntityNameType.LABEL) {
    for (let entity of actualState.ontology.entities.values()) {
      setDisplayedNames.call(this, entity)
    }
  }

  const lifecycle: Lifecycle = this.lifecycle
  lifecycle.trigger(LifecycleEvent.LanguageChange, languageValue)
}

export const setLanguage = _setLanguage