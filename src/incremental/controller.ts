import { SingularElementReturnValue } from "cytoscape";
import { Grapholscape } from "../core";
import { Annotation, GrapholElement, GrapholEntity, RendererStatesEnum, TypesEnum } from "../model";
import { Command, NodeButton } from "../ui";
import IncrementalBase, { IncrementalHighlights } from "./i-incremental";
import NeighbourhoodFinder, { ObjectPropertyConnectedClasses } from "./neighbourhood-finder";
import * as IncrementalCommands from './ui/commands-widget/commands';
import { initIncrementalUI } from './ui'
import { IncrementalEvent } from "./lifecycle";
import { individualIcon, objectPropertyIcon } from "../ui/assets";
// import individualButtonHandler from "./individual-button-handler";
import objectPropertyButtonHandler from "./object-property-button-handler";

export default class IncrementalController extends IncrementalBase {

  private neighbourhoodFinder: NeighbourhoodFinder
  private individualsButton: NodeButton
  private objectPropertyButton: NodeButton

  constructor(grapholscape: Grapholscape) {
    super(grapholscape)
    this.neighbourhoodFinder = new NeighbourhoodFinder(grapholscape.ontology)
    this.individualsButton = new NodeButton(individualIcon)
    this.objectPropertyButton = new NodeButton(objectPropertyIcon)
  }

  getHighlights(iris: string[], isInstance: boolean): Promise<IncrementalHighlights> {
    throw new Error("Method not implemented.");
  }

  getDataPropertiesHighlights(iris: string[], _isInstance: boolean): Promise<GrapholEntity[]> {
    return new Promise((resolve) => {
      resolve(this.neighbourhoodFinder.getDataProperties(iris[0]))
    })
  }

  getObjectPropertiesHighlights(iris: string[], isInstance: boolean): Promise<Map<GrapholEntity, ObjectPropertyConnectedClasses>> {
    return new Promise((resolve) => {
      resolve(this.neighbourhoodFinder.getObjectProperties(iris[0]))
    })
  }

  getAnnotations(iri: string): Promise<Annotation[]> {
    return new Promise((resolve, reject) => {
      const grapholEntity = this.grapholscape.ontology.getEntity(iri)
      if (grapholEntity) {
        resolve(grapholEntity.getAnnotations())
      } else {
        reject('Entity not found')
      }
    })
  }

  getSuperClasses(classIri: string): Promise<GrapholEntity[]> {
    return new Promise((resolve) => {
      const resultIris = this.neighbourhoodFinder.getSuperclassesIris(classIri)
      const result: GrapholEntity[] = []
      let classEntity: GrapholEntity | undefined
      for (let superclassIri of resultIris) {
        classEntity = this.grapholscape.ontology.getEntity(superclassIri)
        if (classEntity)
          result.push(classEntity)
      }
      resolve(result)
    })
  }

  getSubClasses(classIri: string): Promise<GrapholEntity[]> {
    return new Promise((resolve) => {
      const resultIris = this.neighbourhoodFinder.getSubclassesIris(classIri)
      const result: GrapholEntity[] = []
      let classEntity: GrapholEntity | undefined
      for (let superclassIri of resultIris) {
        classEntity = this.grapholscape.ontology.getEntity(superclassIri)
        if (classEntity)
          result.push(classEntity)
      }
      resolve(result)
    })
  }

  getContextMenuCommands(grapholElement: GrapholElement, cyElement: SingularElementReturnValue): Command[] {
    const commands: Command[] = []

    if (grapholElement.is(TypesEnum.CLASS) && grapholElement.iri) {
      const superHierarchies = this.grapholscape.ontology.getSuperHierarchiesOf(grapholElement.iri)
      if (superHierarchies && superHierarchies.length > 0) {
        const areAllSuperHierarchiesVisible = superHierarchies.every(hierarchy => this.diagram.isHierarchyVisible(hierarchy))

        commands.push(IncrementalCommands.showHideSuperHierarchies(
          areAllSuperHierarchiesVisible,
          () => {
            if (areAllSuperHierarchiesVisible) {
              superHierarchies?.forEach(hierarchy => this.removeHierarchy(hierarchy, [grapholElement.iri!]))
            } else {
              this.performActionWithBlockedGraph(() => {
                superHierarchies?.forEach(hierarchy => {
                  this.diagramBuilder.addHierarchy(hierarchy, cyElement.position())
                })
              })
            }
          }
        ))
      }

      const subHierarchies = this.grapholscape.ontology.getSubHierarchiesOf(grapholElement.iri)
      if (subHierarchies && subHierarchies.length > 0) {
        const areAllSubHierarchiesVisible = subHierarchies.every(hierarchy => this.diagram.isHierarchyVisible(hierarchy))
        commands.push(
          IncrementalCommands.showHideSubHierarchies(
            areAllSubHierarchiesVisible,
            () => {
              areAllSubHierarchiesVisible
                ? subHierarchies?.forEach(hierarchy => this.removeHierarchy(hierarchy, [grapholElement.iri!]))
                : this.performActionWithBlockedGraph(() => {
                  subHierarchies?.forEach(hierarchy => {
                    this.diagramBuilder.addHierarchy(hierarchy, cyElement.position())
                  })
                })
            }
          ),
        )
      }

      const subClasses = this.neighbourhoodFinder.getSubclassesIris(grapholElement.iri)
      if (subClasses.length > 0) {
        const areAllSubclassesVisible = subClasses.every(subclass => this.diagram.containsEntity(subclass))
        commands.push(
          IncrementalCommands.showHideSubClasses(
            areAllSubclassesVisible,
            () => {
              if (areAllSubclassesVisible) {
                subClasses.forEach(sc => {
                  const scEntity = this.grapholscape.ontology.getEntity(sc)
                  if (scEntity)
                    this.removeEntity(scEntity, [grapholElement.iri!])
                })
              } else {
                this.showClassesInIsa(grapholElement.iri!, subClasses, TypesEnum.INCLUSION, 'sub')
              }
            }
          )
        )
      }

      const superClasses = this.neighbourhoodFinder.getSuperclassesIris(grapholElement.iri)
      if (superClasses.length > 0) {
        const areAllSuperclassesVisible = superClasses.every(superClasses => this.diagram.containsEntity(superClasses))
        commands.push(
          IncrementalCommands.showHideSuperClasses(
            areAllSuperclassesVisible,
            () => {
              areAllSuperclassesVisible
                ? superClasses.forEach(sc => {
                  const scEntity = this.grapholscape.ontology.getEntity(sc)
                  if (scEntity)
                    this.removeEntity(scEntity, [grapholElement.iri!])
                })
                : this.showClassesInIsa(grapholElement.iri!, superClasses, TypesEnum.INCLUSION, 'super')
            }
          )
        )
      }

      const equivalentClasses = this.neighbourhoodFinder.getEquivalentClassesIris(grapholElement.iri)
      if (equivalentClasses.length > 0) {
        const areAllEquivalentClassesVisible = equivalentClasses.every(ec => this.diagram.containsEntity(ec))
        commands.push(
          IncrementalCommands.showHideEquivalentClasses(
            areAllEquivalentClassesVisible,
            () => {

              if (areAllEquivalentClassesVisible) {
                equivalentClasses.forEach(sc => {
                  const scEntity = this.grapholscape.ontology.getEntity(sc)
                  if (scEntity)
                    this.removeEntity(scEntity, [grapholElement.iri!])
                })
              } else {
                this.showClassesInIsa(grapholElement.iri!, equivalentClasses, TypesEnum.EQUIVALENCE)
              }
            }
          )
        )
      }
    }

    const selectedElems = this.diagram.representation?.cy.$(':selected[?iri]')
    let elemsToBeRemoved = cyElement
    if (selectedElems && selectedElems.size() > 1) {
      elemsToBeRemoved = selectedElems
    }
    commands.push(IncrementalCommands.remove(elemsToBeRemoved, () => {
      elemsToBeRemoved.forEach(cyElem => {
        if (cyElem.data().iri) {
          const entity = this.grapholscape.ontology.getEntity(cyElem.data().iri)
          if (entity) {
            if (cyElem.data().type === TypesEnum.OBJECT_PROPERTY) {
              const grapholOccurrence = this.diagram.representation?.grapholElements.get(cyElem.id())
              if (grapholOccurrence) {
                entity.removeOccurrence(grapholOccurrence, RendererStatesEnum.INCREMENTAL)
              }
              this.diagram.removeElement(cyElem.id())
              this.lifecycle.trigger(IncrementalEvent.DiagramUpdated)
            } else {
              this.removeEntity(entity)
            }
          }
        }
      })
    }))

    return commands
  }

  init(): void {
    this.setIncrementalEventHandlers()
    initIncrementalUI(this)
    this.initNodeButtons()
  }

  private initNodeButtons() {
    // this.individualsButton.title = 'Search Individuals'
    // this.individualsButton.onclick = e => individualButtonHandler(e, this)

    this.objectPropertyButton.title = 'Navigate through object properties'
    this.objectPropertyButton.onclick = e => objectPropertyButtonHandler(e, this)
  }

  getNodeButtons(grapholElement: GrapholElement): NodeButton[] {
    if (grapholElement.is(TypesEnum.CLASS)) {
      return [this.objectPropertyButton]
    }

    return []
  }

  setIncrementalEventHandlers() {
    if (this.diagram.representation?.cy.scratch('_gscape-incremental-graph-handlers-set')) return

    // const classOrInstanceSelector = `node[type = "${TypesEnum.CLASS}"], node[type = "${TypesEnum.CLASS_INSTANCE}"]`
    this.diagram.representation?.cy.on('tap', evt => {
      const targetType = evt.target.data().type

      if (targetType === TypesEnum.CLASS || targetType === TypesEnum.INDIVIDUAL) {
        const targetIri = evt.target.data().iri
        const entity = this.grapholscape.ontology.getEntity(targetIri)
        if (entity)
          this.lifecycle.trigger(IncrementalEvent.ClassSelection, entity)
      }
    })

    this.diagram.representation?.cy.scratch('_gscape-incremental-graph-handlers-set', true)
  }

  reset() {
    let clearedEntities: string[] = []
    this.diagram.representation?.grapholElements.forEach(elem => {
      if (elem.iri && !clearedEntities.includes(elem.iri)) {
        const entity = this.grapholscape.ontology.getEntity(elem.iri)
        if (entity) {
          entity.occurrences.set(RendererStatesEnum.INCREMENTAL, [])
        }

        clearedEntities.push(elem.iri)
      }
    })
    clearedEntities = []
    this.diagram.clear()
    this.lifecycle.trigger(IncrementalEvent.Reset)
  }

}