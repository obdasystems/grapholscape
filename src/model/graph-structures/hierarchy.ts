
import { Position } from "cytoscape";
import GrapholEdge from "../graphol-elems/edge";
import GrapholEntity from "../graphol-elems/entity";
import GrapholNode from "../graphol-elems/node";
import { GrapholTypesEnum, Shape } from "../graphol-elems/enums";

export default class Hierarchy {

  private _id?: string
  private _inputs: string[] = []
  private _superclasses: { classIri: string, complete?: boolean }[] = []

  constructor(public type: GrapholTypesEnum.UNION | GrapholTypesEnum.DISJOINT_UNION) { }

  addInput(classIri: string) {
    this.inputs.push(classIri)
  }

  addSuperclass(classIri: string, complete = false) {
    this._superclasses.push({ classIri: classIri, complete: complete })
  }

  get inputs() { return this._inputs }
  get superclasses() { return this._superclasses }

  set id(newId: string | undefined) { this._id = newId }
  get id() { return this._id }

  getUnionGrapholNode(position?: Position): GrapholNode | undefined {
    if (!this.isValid()) {
      console.warn('[Grapholscape] Hierarchy not valid, cannot create the union graphol node - check id, inputs and superclasses')
      return
    }

    const unionNode = new GrapholNode(this._id!, GrapholTypesEnum.CLASS)
    unionNode.type = this.type
    unionNode.identity = GrapholTypesEnum.CLASS
    unionNode.shape = Shape.ELLIPSE
    unionNode.displayedName = !this.isDisjoint() ? 'or' : undefined
    unionNode.height = unionNode.width = 30
    unionNode.position = position!
    unionNode.setLabelXposFromXML(position!.x)
    unionNode.setLabelYposFromXML(position!.y)

    return unionNode
  }

  getInputGrapholEdges(): GrapholEdge[] | undefined {
    if (!this.isValid()) {
      console.warn('[Grapholscape] Hierarchy not valid, cannot create input edges - check id, inputs and superclasses')
      return
    }

    const res: GrapholEdge[] = []

    this.inputs.forEach((inputClassIri, i) => {
      const newInputEdge = new GrapholEdge(`${this._id}-e-${i}`, GrapholTypesEnum.INPUT)
      newInputEdge.sourceId = inputClassIri
      newInputEdge.targetId = this._id!
      res.push(newInputEdge)
    })

    return res
  }

  getInclusionEdges(): GrapholEdge[] | undefined {
    if (!this.isValid()) {
      console.warn('[Grapholscape] Hierarchy not valid, cannot create inclusions edges - check id, inputs and superclasses')
      return
    }

    const res: GrapholEdge[] = []
    this._superclasses.forEach((superclass, i) => {
      const newInclusionEdge = new GrapholEdge(`${this._id}-inclusion-${i}`, this.type)
      newInclusionEdge.sourceId = this._id!
      newInclusionEdge.targetId = superclass.classIri

      if (superclass.complete) {
        newInclusionEdge.targetLabel = 'C'
      }

      res.push(newInclusionEdge)
    })

    return res
  }

  isDisjoint() {
    return this.type === GrapholTypesEnum.DISJOINT_UNION
  }

  private isValid() {
    return this._id && this.inputs.length > 0 && this._superclasses.length > 0
  }
}