import chroma from 'chroma-js';
import { CollectionArgument, NodeSingular, SingularElementReturnValue } from 'cytoscape';
import { ClassInstanceEntity, DiagramRepresentation, GrapholEntity, Ontology, TypesEnum } from "../model";

abstract class ColorManager {

  protected abstract setClassColor(classEntity: any, overwrite: boolean): void
  protected abstract getTopSuperClass(classEntity: any): any
  protected abstract getAllChildren(classEntity: any, result: any): any

  private static readonly brewerSequentialPalettes = [
    "Blues",
    "BuGn",
    "BuPu",
    "GnBu",
    "Greens",
    // "Greys",
    "Oranges",
    "OrRd",
    "PuBu",
    "PuBuGn",
    "PuRd",
    "Purples",
    "RdPu",
    "Reds",
    "YlGn",
    // "YlGnBu",
    // "YlOrBr",
    "YlOrRd"
  ];

  protected getColors(numberOfColors: number) {

    if (numberOfColors <= 1) {
      return [chroma.scale('Accent').mode('lab').colors(20)[Math.floor(Math.random() * 10)]]
    }

    const scaleIndex = Math.floor(Math.random() * ColorManager.brewerSequentialPalettes.length)

    return chroma.scale(ColorManager.brewerSequentialPalettes[scaleIndex])
      .mode('lab')
      .padding(numberOfColors > 10 ? 1 / numberOfColors : 0.2)
      .correctLightness(true)
      .colors(numberOfColors)
  }
}

export class OntologyColorManager extends ColorManager {


  constructor(private ontology: Ontology, private diagramRepresentation: DiagramRepresentation) {
    super()
  }

  setInstanceColor(classInstance: ClassInstanceEntity, overwrite = false) {
    if (classInstance.parentClassIris.length <= 0 || (classInstance.color && !overwrite))
      return

    let parentClassInDiagram: GrapholEntity | undefined

    // get first parent class' color in current diagram 
    for (let parentClassIri of classInstance.parentClassIris) {
      if (this.diagramRepresentation.containsEntity(parentClassIri)) {
        parentClassInDiagram = this.ontology.getEntity(parentClassIri.fullIri)
        if (parentClassInDiagram?.color) {
          classInstance.color = parentClassInDiagram.color
          return
        }
      }
    }

    // if not returned then get first parent class color defined, anywhere
    for (let parentClassIri of classInstance.parentClassIris) {
      const parentClassEntity = this.ontology.getEntity(parentClassIri.fullIri)
      if (parentClassEntity?.color) {
        classInstance.color = parentClassEntity.color
        return
      }
    }

    // No parent classes with defined colors? => compute it

    // if a parent class is in current diagram then use it, otherwise just get first in list
    const parentClassEntity = parentClassInDiagram || this.ontology.getEntity(classInstance.parentClassIris[0].fullIri)

    if (parentClassEntity) {
      this.setClassColor(parentClassEntity)
      classInstance.color = parentClassEntity.color
    }
  }

  setClassColor(classEntity: GrapholEntity, overwrite = false) {
    if (classEntity.color && !overwrite) {
      return
    }

    const topSuperClass = this.getTopSuperClass(classEntity)

    const childrenClasses = this.getAllChildren(topSuperClass)
    const colors = this.getColors(childrenClasses.size + 1)

    let i = 0
    for (let childClass of childrenClasses.values()) {
      childClass.color = colors[i]
      i++
    }

    if (childrenClasses.size > 0) {
      topSuperClass.color = chroma(colors[colors.length - 1]).saturate().css()
    } else {
      topSuperClass.color = chroma(colors[0]).css()
    }
  }

  protected getTopSuperClass(classEntity: GrapholEntity): GrapholEntity {

    const directSuperclass = Array.from(this.ontology.getSuperclassesOf(classEntity.iri))[0]

    const hierarchies = this.ontology.getSuperHierarchiesOf(classEntity.iri)
    if (hierarchies.length > 0) {
      return this.getTopSuperClass(hierarchies[0].superclasses[0].classEntity)

    } else if (directSuperclass) {

      return this.getTopSuperClass(directSuperclass)

    } else {
      return classEntity
    }
  }

  protected getAllChildren(classEntity: GrapholEntity, result: Set<GrapholEntity> = new Set()): Set<GrapholEntity> {
    // let result: Set<GrapholEntity> = new Set()

    for (let directChild of this.ontology.getSubclassesOf(classEntity.iri)) {
      if (!result.has(directChild)) {
        result.add(directChild)
        result = new Set([...result, ...this.getAllChildren(directChild, result)])
      }
    }

    const hierarchies = this.ontology.getSubHierarchiesOf(classEntity.iri)

    if (hierarchies.length > 0) {
      hierarchies.forEach(h => {
        h.inputs.forEach(inputClass => {
          if (!result.has(inputClass)) {
            result.add(inputClass)
            result = new Set([...result, ...this.getAllChildren(inputClass, result)])
          }
        })
      })
    }

    return result
  }

}

export class DiagramColorManager extends ColorManager {

  constructor(private diagramRepresentation: DiagramRepresentation) {
    super()
  }

  colorDiagram(overwrite = false) {
    this.diagramRepresentation.cy.$(`node[type = "${TypesEnum.CLASS}"]`).forEach(classNode => {
      this.setClassColor(classNode, overwrite)
    })
  }

  setClassColor(classNode: SingularElementReturnValue, overwrite = false) {
    if (classNode.data().computedFillColor && !overwrite) {
      return
    }

    if (classNode.isNode()) {
      const topSuperClass = this.getTopSuperClass(classNode)
      const childrenClasses = this.getAllChildren(topSuperClass)
      const colors = this.getColors(childrenClasses.size() + 1)
      childrenClasses.forEach((childClass, i) => {
        childClass.data('computedFillColor', colors[i])
        // childClass.style().update()
      })

      if (childrenClasses.nonempty()) {
        topSuperClass.data('computedFillColor', chroma(colors[colors.length - 1]).saturate().css())
      } else {
        topSuperClass.data('computedFillColor', colors[0])
      }

      // topSuperClass.style().update()
    }
  }

  protected getTopSuperClass(classNode: NodeSingular) {
    const directSuperclass = classNode.outgoers(`edge[type = "${TypesEnum.INCLUSION}"], edge[type = "${TypesEnum.EQUIVALENCE}"]`).targets().first()

    const hierarchies = classNode.outgoers(`edge[type = "${TypesEnum.INPUT}"]`).targets().first()

    if (hierarchies.nonempty()) {
      return this.getTopSuperClass(hierarchies.outgoers(`node[type = "${TypesEnum.CLASS}"]`))

    } else if (directSuperclass.nonempty()) {

      return this.getTopSuperClass(directSuperclass)

    } else {
      return classNode
    }
  }

  protected getAllChildren(classNode: SingularElementReturnValue | NodeSingular, result = this.diagramRepresentation.cy.collection()) {

    classNode.incomers(`edge[type = "${TypesEnum.INCLUSION}"]`).sources().forEach(elem => {
      if (!result.contains(elem)) {
        result = result.union(elem)
        result = result.union(this.getAllChildren(elem, result))
      }
    })

    const hiearchies = classNode.incomers(`node[type = "${TypesEnum.UNION}"], node[type = "${TypesEnum.DISJOINT_UNION}"]`)

    hiearchies.incomers(`edge[type = "${TypesEnum.INPUT}"]`).sources().forEach(elem => {
      if (!result.contains(elem)) {
        result = result.union(elem)
        result = result.union(this.getAllChildren(elem, result))
      }
    })

    return result
  }
}