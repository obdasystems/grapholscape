import AnnotatedElement from "../annotated-element"
import { RendererStatesEnum } from "../renderers/i-render-state"
import Iri from "../iri"
import GrapholElement from "./graphol-element"
import { Entity, RDFGraphConfigEntityNameTypeEnum as EntityNameType, FunctionPropertiesEnum, TypesEnum } from "../rdf-graph/swagger"

// export enum FunctionalityEnum {
//   functional = 'functional',
//   inverseFunctional = 'inverseFunctional',
//   transitive = 'transitive',
//   symmetric = 'symmetric',
//   asymmetric = 'asymmetric',
//   reflexive = 'reflexive',
//   irreflexive = 'irreflexive'
// }

export default class GrapholEntity extends AnnotatedElement implements Entity {

  static newFromSwagger(iri: Iri, e: Entity) {
    const instance = new GrapholEntity(iri)

    Object.entries(e).forEach(([key, value]) => {
      if (e[key] && key !== 'fullIri') {
        instance[key] = value
      }
    })

    return instance
  }

  private _iri!: Iri
  private _occurrences: Map<RendererStatesEnum, GrapholElement[]> = new Map([[RendererStatesEnum.GRAPHOL, []]])
  private _datatype: string
  private _isDataPropertyFunctional: boolean = false
  private _functionProperties: FunctionPropertiesEnum[] = []
  private _color?: string

  // only used when resuming from VKG, in that case we need entities to store their types
  // even if they do not appear in graph.
  // in all other cases types are derived from occurrences in graphs.
  protected _manualTypes?: Set<TypesEnum>

  constructor(iri: Iri) {
    super()
    this.iri = iri
  }

  public addOccurrence(newGrapholElement: GrapholElement, representationKind = RendererStatesEnum.GRAPHOL) {
    if (!this.occurrences.get(representationKind)) {
      this.occurrences.set(representationKind, [])
    }

    const occurrences = this.occurrences.get(representationKind)
    if (!occurrences?.some(occ => occ.equals(newGrapholElement))) {
      occurrences?.push(newGrapholElement)
    }
  }


  public removeOccurrence(grapholElement: GrapholElement, representationKind: RendererStatesEnum) {
    const occurrences = this.occurrences.get(representationKind)

    const occurrenceToRemoveIndex = occurrences?.findIndex(o => o === grapholElement)
    if (occurrenceToRemoveIndex !== undefined && occurrenceToRemoveIndex >= 0) {
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
  getOccurrencesByDiagramId(diagramId: number, representationKind?: RendererStatesEnum): Map<RendererStatesEnum, GrapholElement[]> {
    const result = new Map<RendererStatesEnum, GrapholElement[]>()
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

  get types() {
    let types = new Set<TypesEnum>()
    this._manualTypes?.forEach(t => types.add(t))

    // compute from occurrences
    for (let [_, elements] of this.occurrences) {
      elements.forEach(e => types.add(e.type))
    }

    return Array.from(types)
  }

  // only used when resuming from VKG, in that case we need entities to store their types
  // even if they do not appear in graph.
  // in all other cases types are derived from occurrences in graphs.
  set manualTypes(newTypes: Set<TypesEnum>) {
    this._manualTypes = newTypes
  }

  /**
   * Check if entity is of a certain type
   * @param type 
   */
  is(type: TypesEnum): boolean {

    if (this._manualTypes?.has(type))
      return true

    for (let [_, elements] of this.occurrences) {
      if (elements.some(e => e.is(type))) {
        return true
      }
    }

    return false
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

  public get fullIri() {
    return this.iri.fullIri
  }

  public get functionProperties() {
    return this._functionProperties
  }

  public set functionProperties(properties) {
    this._functionProperties = properties
  }

  public get isDataPropertyFunctional() {
    return this._isDataPropertyFunctional
  }

  public set isDataPropertyFunctional(value) {
    this._isDataPropertyFunctional = value
  }

  public get datatype() { return this._datatype }
  public set datatype(datatype) { this._datatype = datatype }

  public get color() { return this._color }
  public set color(color) { this._color = color }

  public getOccurrenceByType(type: TypesEnum, rendererState: RendererStatesEnum) {
    return this.occurrences.get(rendererState)?.find(o => o.type === type)
  }

  public getOccurrencesByType(type: TypesEnum, rendererState: RendererStatesEnum) {
    return this.occurrences.get(rendererState)?.filter(o => o.type === type)
  }

  public hasFunctionProperty(property: FunctionPropertiesEnum) {
    const resVal = this._functionProperties?.includes(property) || false
    if (property === FunctionPropertiesEnum.FUNCTIONAL) {
      return this.isDataPropertyFunctional || resVal
    }
    return resVal
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

  public getDisplayedName(nameType: EntityNameType, currentLanguage?: string) {
    let newDisplayedName: string

    switch (nameType) {
      case EntityNameType.LABEL:
        newDisplayedName =
          this.getLabels(currentLanguage)[0]?.value ||
          this.getLabels()[0]?.value ||
          (this.iri.remainder.length > 0 ? this.iri.remainder : undefined) ||
          this.iri.toString()
        break

      case EntityNameType.PREFIXED_IRI:
        newDisplayedName = this.iri.prefixed
        break

      case EntityNameType.FULL_IRI:
        newDisplayedName = this.iri.fullIri
        break
    }

    if (this.is(TypesEnum.CLASS) || this.is(TypesEnum.INDIVIDUAL))
      return newDisplayedName.replace(/\r?\n|\r/g, '')
    else
      return newDisplayedName
  }

  public getEntityOriginalNodeId() {
    const grapholRepresentationOccurrences = this.occurrences.get(RendererStatesEnum.GRAPHOL)
    if (grapholRepresentationOccurrences) {
      return grapholRepresentationOccurrences[0].id // used in UI to show the original nodeID in graphol
    }
  }

  public getIdInDiagram(diagramId: number, type: TypesEnum, rendererState: RendererStatesEnum) {
    let entityOccurrences = this.getOccurrencesByType(type, rendererState)

    if (!entityOccurrences || entityOccurrences.length === 0)
      entityOccurrences = this.getOccurrencesByType(type, RendererStatesEnum.GRAPHOL)

    if (!entityOccurrences)
      return

    return entityOccurrences.find(o => o.diagramId === diagramId)?.id
  }

  public json(): Entity {
    return {
      fullIri: this.fullIri,
      annotations: this.getAnnotations().map(ann => {
        return {
          property: ann.property,
          value: ann.value,
          language: ann.language,
          datatype: ann.datatype,
          hasIriValue: ann.hasIriValue,
        }
      }),
      datatype: this.datatype,
      functionProperties: this.functionProperties,
      isDataPropertyFunctional: this.isDataPropertyFunctional,
    }
  }
}