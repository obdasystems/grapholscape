import AnnotatedElement from "../annotated-element"
import { RendererStatesEnum } from "../renderers/i-render-state"
import Iri from "../iri"
import { GrapholTypesEnum } from "./enums"
import { EntityNameType } from "../../config"
import ClassInstanceEntity from "./class-instance-entity"

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
  private _occurrences: Map<RendererStatesEnum, EntityOccurrence[]> = new Map([[RendererStatesEnum.GRAPHOL, []]])
  private _type: GrapholTypesEnum
  private _datatype: string
  private _functionalities: FunctionalityEnum[] = []

  constructor(iri: Iri, type: GrapholTypesEnum) {
    super()
    this.iri = iri
    this.type = type
  }

  public addOccurrence(occurenceId: string, diagramId: number, representationKind = RendererStatesEnum.GRAPHOL) {
    if (!this.occurrences.get(representationKind)) {
      this.occurrences.set(representationKind, [])
    }

    const occurrences = this.occurrences.get(representationKind)
    if (!occurrences?.find(r => r.elementId === occurenceId && r.diagramId === diagramId)) {
      occurrences?.push({
        elementId: occurenceId,
        diagramId: diagramId,
      })
    }
  }

  public removeOccurrence(occurrenceId: string, diagramId: number, representationKind: RendererStatesEnum) {
    const occurrences = this.occurrences.get(representationKind)

    const occurrenceToRemoveIndex = occurrences?.indexOf({ elementId: occurrenceId, diagramId: diagramId })
    if (occurrenceToRemoveIndex !== undefined) {
      occurrences?.splice(occurrenceToRemoveIndex, 1)
    }
  }

  /**
   * Get all occurrences of the entity in a given diagram
   * @param diagramId the diagram in which the entity must occurr
   * @param representationKind the diagram representation identifier ({@link RendererStatesEnum}) 
   * if not set, all representations will be considered
   * @returns A map with the occurrences in the original Graphol representation and other 
   * replicated occurrences in other diagram representations
   */
  getOccurrencesByDiagramId(diagramId: number, representationKind?: RendererStatesEnum): Map<RendererStatesEnum, EntityOccurrence[]> {
    const result = new Map<RendererStatesEnum, EntityOccurrence[]>()
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

  public get datatype() { return this._datatype }
  public set datatype(datatype) { this._datatype = datatype }

  public hasFunctionality(functionalityKind: FunctionalityEnum) {
    return this._functionalities?.includes(functionalityKind) || false
  }

  public hasOccurrenceInDiagram(diagramId: number, representationKind: RendererStatesEnum) {
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

  public getDisplayedName(nameType: EntityNameType, actualLanguage?: string) {
    let newDisplayedName: string

    switch (nameType) {
      case EntityNameType.LABEL:
        newDisplayedName =
          this.getLabels(actualLanguage)[0]?.lexicalForm ||
          this.iri.remainder
        break

      case EntityNameType.PREFIXED_IRI:
        newDisplayedName = this.iri.prefixed
        break

      case EntityNameType.FULL_IRI:
        newDisplayedName = this.iri.fullIri
        break
    }

    if (this.is(GrapholTypesEnum.CLASS) || this.is(GrapholTypesEnum.INDIVIDUAL))
      return newDisplayedName.replace(/\r?\n|\r/g, '')
    else
      return newDisplayedName
  }

  public getEntityOriginalNodeId() {
    const grapholRepresentationOccurrences = this.occurrences.get(RendererStatesEnum.GRAPHOL)
    if (grapholRepresentationOccurrences) {
      return grapholRepresentationOccurrences[0].elementId // used in UI to show the original nodeID in graphol
    }
  }
}