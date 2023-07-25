import GrapholEdge from "../graphol-elems/edge";
import GrapholEntity from "../graphol-elems/entity";
import { Shape } from "../graphol-elems/enums";
import GrapholNode from "../graphol-elems/node";
import { Hierarchy as IHierarchy, Position, TypesEnum } from "../rdf-graph/swagger";
import { RendererStatesEnum } from "../renderers/i-render-state";

export default class Hierarchy implements IHierarchy {

  private _id: string
  private _inputs: GrapholEntity[] = []
  private _superclasses: { classEntity: GrapholEntity, complete: boolean }[] = []

  constructor(id: string, public type: TypesEnum.UNION | TypesEnum.DISJOINT_UNION) {
    this.id = id
  }

  addInput(classEntity: GrapholEntity) {
    this.inputs.push(classEntity)
  }

  removeInput(classEntity: GrapholEntity) {
    const index = this.inputs.findIndex(i => i === classEntity)
    this.inputs.splice(index, 1)
  }

  addSuperclass(classEntity: GrapholEntity, complete = false) {
    this._superclasses.push({ classEntity: classEntity, complete: complete })
  }

  removeSuperclass(classEntity: GrapholEntity) {
    const index = this.superclasses.findIndex(i => i.classEntity === classEntity)
    this.superclasses.splice(index, 1)
  }

  get inputs() { return this._inputs }
  get superclasses() { return this._superclasses }

  set id(newId: string) { this._id = newId }
  get id() { return this._id }

  getUnionGrapholNode(position?: Position): GrapholNode | undefined {
    if (!this.isValid()) {
      console.warn('[Grapholscape] Hierarchy not valid, cannot create the union graphol node - check id, inputs and superclasses')
      return
    }

    const unionNode = new GrapholNode(this._id!, TypesEnum.CLASS)
    unionNode.type = this.type
    unionNode.identity = TypesEnum.CLASS
    unionNode.shape = Shape.ELLIPSE
    unionNode.hierarchyID = this._id
    unionNode.displayedName = !this.isDisjoint() ? 'or' : undefined
    unionNode.height = unionNode.width = 30
    unionNode.position = position || { x: 0, y: 0 }
    unionNode.setLabelXposFromXML(position?.x || 0)
    unionNode.setLabelYposFromXML(position?.y || 0)

    return unionNode
  }

  getInputGrapholEdges(diagramId: number, rendererState: RendererStatesEnum): GrapholEdge[] | undefined {
    if (!this.isValid()) {
      console.warn('[Grapholscape] Hierarchy not valid, cannot create input edges - check id, inputs and superclasses')
      return
    }

    const res: GrapholEdge[] = []
    let sourceId: string | undefined
    this.inputs.forEach((inputEntity, i) => {
      const newInputEdge = new GrapholEdge(`${this._id}-e-${i}`, TypesEnum.INPUT)
      sourceId = inputEntity.getIdInDiagram(diagramId, TypesEnum.CLASS, rendererState)
      if (!sourceId) return
      newInputEdge.sourceId = sourceId
      newInputEdge.targetId = this._id!
      res.push(newInputEdge)
    })

    return res
  }

  getInclusionEdges(diagramId: number, rendererState: RendererStatesEnum): GrapholEdge[] | undefined {
    if (!this.isValid()) {
      console.warn('[Grapholscape] Hierarchy not valid, cannot create inclusions edges - check id, inputs and superclasses')
      return
    }

    const res: GrapholEdge[] = []
    let targetId: string | undefined
    this._superclasses.forEach((superclass, i) => {
      const newInclusionEdge = new GrapholEdge(`${this._id}-inclusion-${i}`, this.type)
      newInclusionEdge.sourceId = this._id!
      targetId = superclass.classEntity.getIdInDiagram(diagramId, TypesEnum.CLASS, rendererState)
      if (!targetId) return
      newInclusionEdge.targetId = targetId

      if (superclass.complete) {
        newInclusionEdge.targetLabel = 'C'
      }

      res.push(newInclusionEdge)
    })

    return res
  }

  isDisjoint() {
    return this.type === TypesEnum.DISJOINT_UNION
  }

  private isValid() {
    return this._id && this.inputs.length > 0 && this._superclasses.length > 0
  }
}