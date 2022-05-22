import { EntityNameType, Language } from "../../grapholscape"
import Diagram from "../diagram"
import Iri from "../iri"
import Ontology from "../ontology"
import GrapholscapeTheme from "../theme"

export default class GrapholscapeState {
  private _language: Language
  private _theme: GrapholscapeTheme
  private _diagram: Diagram
  private _ontology: Ontology
  private _selectedEntityIri: Iri
  private _entityNameType: EntityNameType

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
}