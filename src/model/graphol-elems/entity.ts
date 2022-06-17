import AnnotatedElement from "../annotated-element"
import { RenderStatesEnum } from "../renderers/i-render-state"
import Iri from "../iri"
import { GrapholTypesEnum } from "./node-enums"

export enum FunctionalityEnum {
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
  private _occurrences: Map<RenderStatesEnum, EntityOccurrence[]> = new Map([[RenderStatesEnum.GRAPHOL, []]])
  private _type: GrapholTypesEnum
  private _functionalities: FunctionalityEnum[] = []

  constructor(iri: Iri, type: GrapholTypesEnum) {
    super()
    this.iri = iri
    this.type = type
  }

  public addOccurrence(occurenceId: string, diagramId: number, representationKind = RenderStatesEnum.GRAPHOL) {
    if (!this.occurrences.get(representationKind)) {
      this.occurrences.set(representationKind, [])
    }

    this.occurrences.get(representationKind)?.push({
      elementId: occurenceId,
      diagramId: diagramId,
    })
  }

  /**
   * Get all occurrences of the entity in a given diagram
   * @param diagramId the diagram in which the entity must occurr
   * @param representationKind the diagram representation identifier ({@link RenderStatesEnum}) 
   * if not set, all representations will be considered
   * @returns A map with the occurrences in the original Graphol representation and other 
   * replicated occurrences in other diagram representations
   */
  getOccurrencesByDiagramId(diagramId: number, representationKind?: RenderStatesEnum): Map<RenderStatesEnum, EntityOccurrence[]> {
    const result = new Map<RenderStatesEnum, EntityOccurrence[]>()
    if (representationKind) {
      const occurrences = this.occurrences.get(representationKind)
      if (occurrences) {
        result.set(representationKind, occurrences.filter(occ => occ.diagramId === diagramId))
      }
    } else {
      for (let [representationKind, occurrences] of this.occurrences) {
        result.set(representationKind, occurrences.filter(occ => occ.diagramId === diagramId))
      }
    }
    return result
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

  public hasFunctionality(functionalityKind: FunctionalityEnum) {
    return this._functionalities?.includes(functionalityKind) || false
  }

  public hasOccurrenceInDiagram(diagramId: number, representationKind: RenderStatesEnum) {
    if (representationKind) {
      const result = this.occurrences.get(representationKind)?.some(occ => occ.diagramId === diagramId)
      return result === true
    }

    for (let occurrenceInRepresentation of this.occurrences.values()) {
      if (occurrenceInRepresentation.some(occ => occ.diagramId === diagramId)) {
        return true
      }
    }

    return false
  }
}