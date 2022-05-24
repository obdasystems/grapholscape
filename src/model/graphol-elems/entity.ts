import AnnotatedElement from "../annotated-element"
import Iri from "../iri"
import { GrapholTypesEnum } from "./node-enums"

export enum Functionalities {
  functional = 'functional',
  inverseFunctional = 'inverseFunctional',
  transitive = 'transitive',
  symmetric = 'symmetric',
  asymmetric = 'asymmetric',
  reflexive = 'reflexive',
  irreflexive = 'irreflexive'
}

export type EntityOccurrence = {
  elementId: string,
  diagramId: number,
}

export default class GrapholEntity extends AnnotatedElement {
  private _iri!: Iri
  private _occurrences: EntityOccurrence[] = []
  private _type: GrapholTypesEnum
  private _functionalities?: Functionalities[]

  constructor(iri: Iri, type: GrapholTypesEnum) {
    super()
    this.iri = iri
    this.type = type
  }

  public addOccurrence(occurenceId: string, diagramId: number) {
    this._occurrences.push({
      elementId: occurenceId,
      diagramId: diagramId,
    })

    if (this.iri.remainder === 'Azienda') console.log(this._occurrences)
  }

  getOccurrencesByDiagramId(diagramId: number) {
    return this._occurrences.filter(occ => occ.diagramId === diagramId)
  }

  get type() { return this._type }
  set type(type: GrapholTypesEnum) {
    this._type = type
  }

  /**
   * Check if entity is of a certain type
   * @param type 
   */
  is(type: GrapholTypesEnum): boolean {
    return this.type === type
  }

  public get occurrences() {
    return this._occurrences
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

  public hasOccurrence(occurrenceId: string, diagramId: number) {
    return this.occurrences.find(occ => occ.elementId === occurrenceId && diagramId === diagramId)
  }
}