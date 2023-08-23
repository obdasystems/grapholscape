import chroma from 'chroma-js';
import { ClassInstanceEntity, DiagramRepresentation, GrapholEntity, GrapholscapeTheme, Hierarchy, Ontology, TypesEnum } from "../model"

export class ColorManager {
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

  private forest: Set<GrapholEntity> = new Set()


  constructor(private ontology: Ontology, private diagramRepresentation: DiagramRepresentation, private theme: GrapholscapeTheme) { }

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

    this.forest.clear()
    const childrenClasses = this.getAllChildren(topSuperClass)
    const colors = this.getColors(childrenClasses.size + 1)

    let i = 0
    for(let childClass of childrenClasses.values()) {
      childClass.color = colors[i]
      i++
    }

    if (childrenClasses.size > 0) {
      topSuperClass.color = chroma(colors[childrenClasses.size]).saturate().css()
    } else {
      topSuperClass.color = chroma(colors[0]).css()
    }
  }

  computeAllColors() {
    this.diagramRepresentation.grapholElements.forEach(elem => {
      if (elem.is(TypesEnum.CLASS) && elem.iri) {
        const entity = this.ontology.getEntity(elem.iri)
        if (entity && !entity.color) {
          this.setClassColor(entity)
        }

        this.diagramRepresentation.updateElement(elem, entity)
      }
    })
  }

  private getTopSuperClass(classEntity: GrapholEntity): GrapholEntity {

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

  private getAllChildren(classEntity: GrapholEntity, result: Set<GrapholEntity> = new Set()): Set<GrapholEntity> {
    // let result: Set<GrapholEntity> = new Set()

    for(let directChild of this.ontology.getSubclassesOf(classEntity.iri)) {
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

  private getColors(numberOfColors: number) {
    const scaleIndex = Math.floor(Math.random() * ColorManager.brewerSequentialPalettes.length)

    return chroma.scale(ColorManager.brewerSequentialPalettes[scaleIndex])
      .mode('lab')
      .padding(numberOfColors > 10 ? 1 / numberOfColors : 0.1)
      .correctLightness(true)
      .colors(numberOfColors)
  }
}