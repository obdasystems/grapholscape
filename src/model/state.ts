import Diagram from "./diagram"
import Iri from "./iri"
import Ontology from "./ontology"
import GrapholscapeTheme from "./theme"

export enum Language {
  DE = 'de',
  EN = 'en',
  ES = 'es',
  FR = 'fr',
  IT = 'it',
}

export enum EntityNameType {
  LABEL = 'label',
  PREFIXED_IRI = 'prefixedIri',
  FULL_IRI = 'fullIri'
}

export default class GrapholscapeState {
  private _language: Language
  private _theme: GrapholscapeTheme
  private _diagram: Diagram
  private _ontology: Ontology
  private _selectedEntityIri: Iri
  private _entityNameType: EntityNameType = EntityNameType.LABEL
  private _focusedElementZoom: number = 1.2

  constructor() {}

  get language() { return this._language }
  set language(lang) {
    this._language = lang
  }

  get theme() { return this._theme }
  set theme(newTheme: GrapholscapeTheme) {
    this._theme = newTheme
  }

  get diagram() { return this._diagram }
  
  set diagram(newDiagram) {
    this._diagram = newDiagram
  }

  get ontology() { return this._ontology }
  
  set ontology(newOntology) {
    this._ontology = newOntology
  }

  get selectedEntityIri() { return this._selectedEntityIri }
  
  get entityNameType() {
    return this._entityNameType
  }
  set entityNameType(value) {
    this._entityNameType = value
  }

  get focusedElementZoom() { return this._focusedElementZoom }
  set focusedElementZoom(zoom: number) {
    this._focusedElementZoom = zoom
  }
}