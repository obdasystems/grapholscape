import AnnotatedElement, { AnnotationsKind } from "../annotated-element"
import Iri from "../iri"
import { Type } from "../node-enums"
import Annotation from "./annotation"

export enum Functionalities {
  functional = 'functional',
  inverseFunctional = 'inverseFunctional',
  transitive = 'transitive',
  symmetric = 'symmetric',
  asymmetric = 'asymmetric',
  reflexive = 'reflexive',
  irreflexive = 'irreflexive'
}


export default class GrapholEntity extends AnnotatedElement {
  private _iri!: Iri
  private _occurrences: { elementId: string, diagramId: number }[]
  private _type: Type
  private _functionalities?: Functionalities[]

  constructor(iri: Iri, type: Type) {
    super()
    this.iri = iri
    this.type = type
  }

  public addOccurrence(occurenceId: string, diagramId: number) {
    this._occurrences.push({
      elementId: occurenceId,
      diagramId: diagramId,
    })
  }

  get type() { return this._type }
  set type(type: Type) {
    this._type = type
  }

  /**
   * Check if entity is of a certain type
   * @param type 
   */
  is(type: Type): boolean {
    return this.type === type
  }

  public get occurrences() {
    return this.occurrences
  }

  public set iri(val: Iri) {
    this._iri = val
  }

  public get iri() {
    return this._iri
  }

  public get functionalities() {
    return this._functionalities
  }

  public set functionalities(functionalities) {
    this._functionalities = functionalities
  }

  public hasFunctionality(functionalityKind: Functionalities) {
    return this._functionalities?.includes(functionalityKind)
  }
}