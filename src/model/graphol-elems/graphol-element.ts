import { ElementDefinition } from "cytoscape"
import { Element, TypesEnum, FunctionPropertiesEnum } from "../rdf-graph/swagger"
import GrapholEntity from "./entity"
import { GrapholNode } from "./node"
import { GrapholEdge } from "./edge"
import { GrapholElementVisitor } from "./entity-visitor"

export default class GrapholElement implements Element {
  private _displayedName?: string
  private _originalId?: string // In case of replicated elements, this is the id of the original node
  protected _iri?: string
  private _diagramId: number

  constructor(private _id: string, protected _type: TypesEnum) { }

  get id() { return this._id }
  set id(value: string) {
    this._id = value
  }

  get type() { return this._type }
  set type(type: TypesEnum) {
    this._type = type
  }

  get displayedName() { return this._displayedName }
  set displayedName(displayedName: string | undefined) {
    this._displayedName = displayedName
  }

  get originalId() { return this._originalId }
  set originalId(id: string | undefined) { this._originalId = id }

  get iri() { return this._iri }
  set iri(iri: string | undefined) { this._iri = iri }

  get diagramId() { return this._diagramId }
  set diagramId(newdiagramId) {
    this._diagramId = newdiagramId
  }

  /**
   * Check if element is of a certain type
   * @param type 
   */
  is(type: TypesEnum): boolean {
    return this.type === type
  }

  isHierarchy: () => boolean

  /**
   * 
   * @returns whether node is an entity
   */
  isEntity(): boolean {
    switch (this.type) {
      case TypesEnum.DATA_PROPERTY:
        return this.isNode()
      case TypesEnum.CLASS:
      case TypesEnum.OBJECT_PROPERTY:
      case TypesEnum.ANNOTATION_PROPERTY:
      case TypesEnum.INDIVIDUAL:
        return true
    }

    return false
  }

  getCytoscapeRepr(grapholEntity?: GrapholEntity): ElementDefinition[] {
    const result: ElementDefinition = {
      data: {
        id: this.id,
        type: this.type || undefined,
        displayedName: this.displayedName || undefined,
        originalId: this.originalId || undefined,
        iri: this.iri || grapholEntity?.iri.fullIri,
        datatype: grapholEntity?.datatype,
      }
    }

    // Set functionality for data/object properties
    if (grapholEntity && (this.is(TypesEnum.DATA_PROPERTY) || this.is(TypesEnum.OBJECT_PROPERTY)) && (grapholEntity.is(TypesEnum.DATA_PROPERTY) || grapholEntity.is(TypesEnum.OBJECT_PROPERTY))) {
      result.data[FunctionPropertiesEnum.FUNCTIONAL] = grapholEntity.hasFunctionProperty(FunctionPropertiesEnum.FUNCTIONAL)
      result.data[FunctionPropertiesEnum.INVERSE_FUNCTIONAL] = grapholEntity.hasFunctionProperty(FunctionPropertiesEnum.INVERSE_FUNCTIONAL)
    }
    return [result]
  }

  clone() {
    const cloneObj = new GrapholElement(this.id, this.type)
    Object.assign(cloneObj, this)

    return cloneObj
  }

  json(): Element {
    const result: Element = {
      id: this.id,
      type: this.type,
      originalId: this.originalId,
      diagramId: this.diagramId,
      displayedName: this.displayedName,
      iri: this.iri,
    }

    return result
  }

  equals(grapholElement: GrapholElement) {
    return this === grapholElement ||
      (
        this.id === grapholElement.id &&
        this.diagramId === grapholElement.diagramId
      )
  }

  isNode(): this is GrapholNode {
    return (this as unknown as GrapholNode).position !== undefined
  }

  isEdge(): this is GrapholEdge {
    return (this as unknown as GrapholEdge).sourceId !== undefined
  }

  accept<T>(visitor: GrapholElementVisitor<T>): T {
    return visitor.visitUnknown(this)
  }
}